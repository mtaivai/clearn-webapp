import React from 'react'
// import PropTypes from 'prop-types'
// import Todo from './Todo'

import './ContentBlock.css';
import MicroEvent from '../microevent.js';
import ContentBlockBody from './ContentBlockBody'
import ContentBlockHeader from './ContentBlockHeader'
import ContentBlockFooter from './ContentBlockFooter'


/*

  ContentBlock
    ContentBlockHeader
    ContentBlockContentArea
    ContentBlockFooter

  content = {
    id: "6",
    contentType: "text/html",
    contentBody: "...",

  }
 */

class ContentState {
    state = "";
    since;
    fetchTime;

    constructor(state, fetchTime, since) {
        this.state = state;
        this.fetchTime = fetchTime;
        this.since = since != null ? since : new Date();
    }
}
// class ContentStateEvent {
//     content;
//     contentState;
//     constructor(content, contentState) {
//         this.content = content;
//         if (typeof(contentState) == 'string') {
//             this.contentState = new ContentState(contentState, new Date());
//         } else {
//             this.contentState = contentState;
//         }
//     }
// }

class ContentStateEvents extends MicroEvent {
    constructor(content) {
        super();
        this.content = content;
    }
    triggerContentStateEvent(contentState) {
        if (typeof(contentState) === 'string') {
            contentState = new ContentState(contentState, new Date());
        }
        var ev = {content: this.content, contentState: contentState};
        this.trigger ("content-state", ev);
    }
}

class ContentBlock extends React.Component {

    contentItem
    contentRepository

    constructor(props) {
        super(props);
        this.state = {
            editMode: false,

            contentBodyReady: false,
            contentBodyTimestamp: null
        }

        //var ContentStateEvents = function() {};
        //MicroEvent.mixin(ContentStateEvents);
        this.contentStateEvents = new ContentStateEvents(props.content);

        this.contentRepository = props.contentRepository

        this.onAction = this.onAction.bind(this);
        this.requireContentBody = this.requireContentBody.bind(this);
    }

    componentWillMount() {
        const config = this.props.blockSpec.configuration

        this.contentItem = this.contentRepository.getContentItem(
            config.contentClass, config.contentId)
    }
    onAction(action) {
        console.log("onAction: " + action);
        switch(action) {
            case "edit":
                this.editAction();
                break;
            case "refreshContent":
                this.refreshContentAction();
                break;
            default:
                console.error("No such action defined: " + action);
        }
    }

    editAction() {
        //alert("EDIT: " + this.props.content.id);
        if (this.state.editMode) {
            console.error("Already in edit mode");
        } else {
            this.setState({
                editMode: true,
                contentBodyReady: false
            });

        }
    }
    refreshContentAction() {
        /*this.setState({
            contentBodyReady: false
        });*/
        this.requireContentBody(true);
    }

    requireContentBody(force) {

        // var promiseFunc = ;
        // return new Promise((resolve, reject) => {
        //     resolve("");
        // });

// console.log("*** requireContentBody: " + this.state.contentBodyReady);


        if (force || !this.state.contentBodyReady) {
            if (!this.fetchingContentBody) {
                this.fetchingContentBody = true;

                this.contentStateEvents.triggerContentStateEvent("fetching");

                this.contentItem.getContentBody().then(
                    (value) => {
                        // Fulfilled
                        this.fetchingContentBody = false;
                        // console.log("getContentBody() fulfilled");
                        this.newContentBody = value;
                        this.contentStateEvents.triggerContentStateEvent("ready");
                        this.setState({
                            contentBodyReady: true,
                            contentBodyTimestamp: new Date()
                        })

                        return value;
                    },
                    (reason) => {
                        // Rejected
                        this.fetchingContentBody = false;
                        this.contentStateEvents.triggerContentStateEvent("error");
                        console.error("getContentBody() rejected: " + reason);
                        return reason;
                    });


            }
        } else {
            // Right away!

        }

    }

    render() {
        const {...props} = this.props;
        props.onAction = this.onAction;
        props.editMode = this.state.editMode;

        props.contentBodyReady = this.state.contentBodyReady;
        props.requireContentBody = this.requireContentBody;
        props.fetchingContentBody = this.fetchingContentBody;

        props.contentItem = this.contentItem

        props.getContentBodyContent = () => {
            const val = this.newContentBody;
            this.newContentBody = null;
            return val;
        }


        props.contentStateEvents = this.contentStateEvents;

        //props.forceRefreshContent = this.state.forceRefreshContent;

       // props.progress = () =>

        return (
            <div className='content-block'>
                <ContentBlockHeader {...props}/>
                <ContentBlockBody {...props}/>
                <ContentBlockFooter {...props}/>
            </div>
        )
    }
}

/*
content-block-header
  content-block-title
  content-block-actions
  content-block-status
 */



ContentBlock.propTypes = {
    // todos: PropTypes.arrayOf(
    //     PropTypes.shape({
    //         id: PropTypes.number.isRequired,
    //         completed: PropTypes.bool.isRequired,
    //         text: PropTypes.string.isRequired
    //     }).isRequired
    // ).isRequired,
    // onTodoClick: PropTypes.func.isRequired
}

export default ContentBlock
