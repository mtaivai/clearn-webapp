import React from 'react';

import './NIEditor.css'

// const getAttr = (node, attrName) => {
//     if (node && node.attributes) {
//
//         const a = node.attributes[attrName];
//         return a && a.nodeValue;
//     }
// };
//
// const logRange = (range) => {
//     console.log("commonAncestorContainer: " + range.commonAncestorContainer.nodeName + "(" + getAttr(range.commonAncestorContainer, 'id') + ") - " + range.commonAncestorContainer.nodeValue);
//     console.log("startContainer: " + range.startContainer.nodeName + " - " + range.startContainer.nodeValue + ":" + range.startOffset);
//     console.log("endContainer: " + range.endContainer.nodeName + " - " + range.endContainer.nodeValue + ":" + range.endOffset);
//     return range;
// };




// const flattenNodes = (start) => {
//     // Flatten:
//     let nodes = [];
//     let n = start;
//     while (n) {
//         nodes.push(n);
//         if (n.nodeType === 1) {
//             // Element node // TODO tagName or localName?
//             //console.log("C:" + n.tagName);
//             nodes = nodes.concat(flattenNodes(n.firstChild));
//         }
//         n = n.nextSibling;
//     }
//     return nodes;
// };

const unwrap = (container) => {
    let modified = false;
    const parent = container.parentNode;
    while (container.firstChild) {
        parent.insertBefore(container.firstChild, container);
        modified = true;
    };
    return modified;
};


// const printNode = (n, prefix) => {
//     console.log((prefix || "") + n.nodeName + "(#" + getAttr(n, "id") + ") " + n.nodeValue);
//     let c = n.firstChild;
//     while (c) {
//         printNode(c, (prefix || "") + "  ");
//         c = c.nextSibling;
//     }
// };
//

const unwrapAll = (n, filter) => {

    let modified = false;

    let c = n.firstChild;
    while (c) {
        modified |= unwrapAll(c, filter);
        c = c.nextSibling;
    }

    if (!filter || filter(n)) {
        modified |= unwrap(n);
    }

    return modified;
};

const removeStyleInRange = (range, styleFilter) => {

    let modified;

    const startContainer = range.startContainer;
    let insideRemovedStyle = false;
    let outerStyleContainer;
    let p = startContainer.parentNode;

    // TODO stop in the editor wrapper!
    while (p) {
        if (styleFilter(p)) {
            insideRemovedStyle = true;
            outerStyleContainer = p;
            break;
        }
        p = p.parentNode;
    }

    if (insideRemovedStyle && range.commonAncestorContainer.isSameNode(range.startContainer)) {
        // The whole selection is inside the selected style

        // Split the outer style container to three ranges:
        // 1. Before selected range
        // 2. The selected range
        // 3. After the selected range

        // In reality, we just need to extract  "before" and "selected" ranges
        // and insert them back in reverse order before the "after" range:


        const rangeBefore = document.createRange();
        rangeBefore.setStartBefore(outerStyleContainer);
        rangeBefore.setEnd(range.startContainer, range.startOffset);

        const contentsBefore = rangeBefore.extractContents();
        const selectedContents = range.extractContents();

        // Insert ranges back and restore the selection:
        rangeBefore.insertNode(selectedContents);
        const selectionStartNode = rangeBefore.endContainer;
        const selectionStartOffset = rangeBefore.endOffset;

        rangeBefore.insertNode(contentsBefore);

        range.setStart(selectionStartNode, selectionStartOffset);
        range.setEnd(rangeBefore.endContainer, rangeBefore.endOffset);

        rangeBefore.detach();

        modified = true;

    } else {
        let rangeContents = range.extractContents();
        modified = unwrapAll(rangeContents, styleFilter);
        range.insertNode(rangeContents);


    }

    return modified;

};

class StyleTool {
    createWrapperElement() {

    }

}

// Key shortcut modifiers:
//  alt     The ALT key
//  meta    The META key (CMD, '' on Mac; WINDOWS '' on Windows)
//  shift   The SHIFT key
//  ctrl    The CTRL key
//  cmd     (Custom) Platform-independent: CMD on Mac, CTRL on Windows
const TOOLS = {

    'bold': {
        short: "B",
        exec: 'bold',
        key: 'cmd+b',

        allowDefault: () => false
    },
    'italic': {
        exec: 'italic'
    }
};

const isMacPlatform = true;

class ParsedKey {
    constructor(key) {
       this.altKey = false;
       this.metaKey = false;
       this.shiftKey = false;
       this.ctrlKey = false;
       this.plainKey = true;


        if (key) {

            const components = key.split("+");

            if (isMacPlatform) {
                // cmd ==> meta
            } else {
                // cmd ==> ctrl
            }
            components.forEach((c) => {
                c = c.trim().toLowerCase();
                switch (c) {
                    case 'alt':
                        this.altKey = true;
                        this.plainKey = false;
                        break;
                    case 'meta':
                        this.metaKey = true;
                        this.plainKey = false;
                        break;
                    case 'shift':
                        this.shiftKey = true;
                        this.plainKey = false;
                        break;
                    case 'ctrl':
                        this.ctrlKey = true;
                        this.plainKey = false;
                        break;
                    case 'cmd':
                        if (isMacPlatform) {
                            this.metaKey = true;
                        } else {
                            this.ctrlKey = true;
                        }
                        this.plainKey = false;
                        break;
                    default:
                        this.key = c;

                }
            });
        }
        if (!this.key) {
            console.error("Invalid key specification: '" + key + "' - missing the actual key part");
        }
    }
    matchesKeyboardEvent(e) {
        return (e.altKey === this.altKey
            && e.metaKey === this.metaKey
            && e.shiftKey === this.shiftKey
            && e.ctrlKey === this.ctrlKey
            && e.key.toLowerCase() === this.key);
    }


};


const buildToolsModifierLookup = (tools) => {
    const lookup = {
        'altKey': {},
        'metaKey': {},
        'shiftKey': {},
        'controlKey': {},
        'plain': {}
    };
    for (let toolName in TOOLS) {
        if (!tools.hasOwnProperty(toolName)) {
            continue;
        }
        const tool = tools[toolName];
        const key = tool.key;
        if (!key || !key.key) {
            continue;
        }

        let hasModifier = false;
        if (key.altKey) {
            lookup.altKey[toolName] = tool;
            hasModifier |= true;
        }
        if (key.metaKey) {
            lookup.metaKey[toolName] = tool;
            hasModifier |= true;
        }
        if (key.shiftKey) {
            lookup.shiftKey[toolName] = tool;
            hasModifier |= true;
        }
        if (key.controlKey) {
            lookup.controlKey[toolName] = tool;
            hasModifier |= true;
        }
        if (!hasModifier) {
            lookup.plain[toolName] = tool;
        }
    }
    return lookup;
};
const parseToolKeys = (tools) => {
    for (let toolName in TOOLS) {
        if (!tools.hasOwnProperty(toolName)) {
            continue;
        }
        const tool = tools[toolName];
        tool.key = new ParsedKey(tool.key);
    }
};

parseToolKeys(TOOLS);
const TOOLS_MODIFIER_LOOKUP = buildToolsModifierLookup(TOOLS);



/**
 * Non-invasive editor
 */
class NIEditor extends React.Component {

    constructor(props) {
        super(props);
    }

    nextBlockStyle() {

    }

    toggleInlineElementContainer(nodeName) {
        // wrap
        const sel = window.getSelection();
        // TODO gecko allows more than one range on tables!
        const range = sel.getRangeAt(0);
        const node = range.startContainer;
        const parentNode = node.parentNode;


        if (!removeStyleInRange(range, (n) => n.nodeName === nodeName)) {
            // Nothing was removed, so apply
            console.log("X");

            const contents = range.extractContents();
            const styleNode = document.createElement(nodeName);
            styleNode.appendChild(contents);
            range.insertNode(styleNode);
        }



        range.detach();
    }

    componentDidMount() {
        this.editableContainer.setAttribute("contentEditable", "true");
        console.log(this.editableContainer.innerHTML);
        this.sourceContainer.innerHTML = "";
        this.sourceContainer.appendChild(document.createTextNode(this.editableContainer.innerHTML));
    }

    render() {
        const onClick = (e) => {
            // const el = document.getElementById("editable");
            // el.setAttribute("contentEditable", "true");
        };

        const onChange = () => {
            console.log("C");
        };

        const runTool = (name) => {
            const tool = TOOLS[name];



            // if ((typeof(tool.allowDefault) === 'function' && tool.allowDefault()) ||
            //     (typeof(tool.allowDefault) !== 'undefined' && tool.allowDefault)) {
            //
            // }
            document.execCommand(tool.exec, true, null);


        };

        const onKeyDown = (e) => {
            console.log('onKeyDown: ' + e.key);

            const plainKey = (e.altKey || e.metaKey || e.ctrlKey);

            if (plainKey) {
                if (e.key === 'Enter') {
                    // If we're inside <p>, insert new <p></p>

                    // If inside <pre>, insert new line

                    console.log(e.target.localName);

                    const sel = window.getSelection();
                    const range = sel.getRangeAt(0); // TODO does this work?

                    // TODO: Range.startContainer is for IE>=9
                    const node = range.startContainer;
                    const parentNode = node.parentNode;
                    console.log(parentNode.localName + " > " + node.localName);
                    const parentName = parentNode.localName.toLowerCase();
                    if (node.localName === 'pre' || parentNode.localName === 'pre') {
                        const foo = document.createTextNode("\n");
                        range.insertNode(foo);
                        range.setStartAfter(foo);
                        range.collapse(true);



                        e.preventDefault();
                    } else {

                    }

                    // If not in paragraph, just insert <br/>

                }
            } else {
                if (e.key === 'b') {

                    //this.toggleInlineElementContainer('STRONG');

                    runTool('bold');

                    e.preventDefault();
                }
            }

            //
            //
            // if (e.metaKey) {
            //     console.log("WITH META: " + e.key);
            //     const k = e.key.toLowerCase();
            //
            //     TOOLS_MODIFIER_LOOKUP.metaKey[k];
            //
            //     e.preventDefault();
            // }

            //TOOLS_MODIFIER_LOOKUP






        };


        return (
            <div id={"outer"}>
                <div ref={(container) => this.editableContainer = container} className={"NIEditor"} onClick={onClick} onKeyDown={onKeyDown}
                    onChange={onChange}>
                    Jotain ihan muuta. <em>Tämä <strong>on taas</strong> toinen <strong>esimerkki</strong></em> lause <em>testaukseen</em>.
                </div>
                <hr/>
                <div>
                    <pre ref={(pre) => this.sourceContainer = pre}></pre>
                </div>
            </div>
        );

        // return (
        //     <div>
        //         <div id="editable" className={"NIEditor"} contentEditable={false} onClick={onClick} onKeyDown={onKeyDown}>
        //             Default
        //             text
        //             <h3>H3 here</h3>
        //             <p>A paragraph</p>
        //             <pre>{"Preformatted\ntext\nsection"}</pre>
        //             Last line
        //         </div>
        //         <hr/>
        //         Source:
        //         <div>
        //             <pre ref={(pre) => console.log("PRE: " + pre)}></pre>
        //         </div>
        //     </div>
        // );
    }
}

// // const _get
// const onClick = (e) => {
//     var el = document.getElementById("editable");
//
//     el.setAttribute("contentEditable", "true");
//     var range = document.createRange();
//     // var range = document.caretRangeFromPoint(e.x, e.y);
//     var sel = window.getSelection();
//
//     // const efp = document.elementFromPoint(e.x, e.y);
//     // console.log("EFP: " + efp);
//     range.setStart(el.childNodes[0], 1);
//     range.collapse(true);
//
//     sel.removeAllRanges();
//     sel.addRange(range);
//     el.focus();
// };
//
//
//
// const onClick2 = (e) => {
//     var el = document.getElementById("editable");
//     el.setAttribute("contentEditable", "true");
//     return;
//     let range, textNode, offset;
//     if (document.caretPositionFromPoint) {
//         range = document.caretPositionFromPoint(e.clientX, e.clientY);
//         textNode = range.offsetNode;
//         offset = range.offset;
//
//     } else if (document.caretRangeFromPoint) {
//         range = document.caretRangeFromPoint(e.clientX, e.clientY);
//         textNode = range.startContainer;
//         offset = range.startOffset;
//     }
//
//     console.log("onClick2 offset = " + offset);
//
//     // only split TEXT_NODEs
//     if (textNode && textNode.nodeType == 3) {
//         // var replacement = textNode.splitText(offset);
//         // var br = document.createElement('br');
//         // textNode.parentNode.insertBefore(br, replacement);
//         const sel = window.getSelection();
//
//         // range.setStart(textNode, 0);
//         // range.collapse(true);
//
//         sel.removeAllRanges();
//         sel.addRange(range);
//         //textNode.focus();
//
//     }
// };
export default NIEditor