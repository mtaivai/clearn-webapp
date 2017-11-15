import React from 'react'

import './StaticContentBlock.css';


import {FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap'




class StaticContentBlock extends React.Component {
    constructor(props) {
        super(props);

        // props.actions.addEdit(() => this.setState({mode: "edit"}));

        this.props.blockContext.addSupportedModes("Foo");

        this.state = {
           // mode: 'edit'
            contentBodyText: this.props.blockSpec.configuration.contentBodyText
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleEditModeEvent = this.handleEditModeEvent.bind(this);
    }



    componentDidMount() {
        this.props.blockEvents.bind("edit-mode", this.handleEditModeEvent);


    }
    componentWillUnmount() {
        this.props.blockEvents.unbind("edit-mode", this.handleEditModeEvent);
    }

    handleEditModeEvent(e) {
        if (e === 'cancel') {
            this.setState({contentBodyText: this.props.blockSpec.configuration.contentBodyText});
        } else if (e === 'save') {
            // TODO we need to access the layout repository!
            this.props.layoutRepository.updateBlock(
                this.props.layoutId,
                this.props.blockSpec.id,
                [
                    {
                        property: "configuration.contentBodyText",
                        value: this.state.contentBodyText
                    }
                ]
            ).then((newBlockSpec) => {
                this.setState({contentBodyText: newBlockSpec.configuration.contentBodyText});
            });
        } else {
            console.log("Unsupported edit-mode event: " + e);
        }
    }

    render() {
        if (this.props.mode === 'edit') {
            return this.renderEdit();
        } else {
            return this.renderView();
        }
    }

    renderView() {
        // console.log("STATIC: " + JSON.stringify(this.props.blockSpec))
        // console.log("C: " + JSON.stringify(this.props.blockSpec.configuration))
        const content = this.state.contentBodyText;

        return (
            <div className="StaticContentBlock">{content}</div>
        )
    }


    getValidationState() {
        const length = this.state.contentBodyText.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }

    handleChange(e) {
        this.setState({ contentBodyText: e.target.value });
    }

    renderEdit() {
        return (
            <div className="StaticContentBlock edit">
                <form>
                    <FormGroup
                        controlId="formBasicText"
                        validationState={this.getValidationState()}>
                        <ControlLabel>Working example with validation</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.contentBodyText}
                            placeholder="Enter text"
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>Validation is based on string length.</HelpBlock>
                    </FormGroup>
                </form>

            </div>
        )
    }
}

StaticContentBlock.supportedModes = ["view", "edit"];

export default StaticContentBlock
