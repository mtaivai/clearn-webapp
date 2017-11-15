import React from 'react'

import ProgressIndicator from './ProgressIndicator'

class ContentBlockBody extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    contentStateChanged(ev) {
    }

    componentDidMount() {
        this.props.contentStateEvents.bind("content-state", this.contentStateChanged);
    }
    componentWillUnmount() {
        this.props.contentStateEvents.bind("content-state", this.contentStateChanged);
    }

    render() {
        return (
            <div className="content-block-body">
                <ContentBlockBodyHeader {...this.props}/>
                <ContentBlockBodyContent {...this.props}/>
            </div>

        )
    }
}


class ContentBlockBodyHeader extends React.Component {


    constructor(props) {
        super(props);
        this.state = {

            contentState: "none"
        }
        this.contentStateChanged = this.contentStateChanged.bind(this);
    }

    onBeginFetchContent() {

    }
    onEndFetchContent() {

    }

    // componentWillReceiveProps(nextProps) {
    //     console.log("COMPONENT WILL: " + JSON.stringify(nextProps));
    // }

    contentStateChanged(ev) {

        /*if (this.stateTextElement != null) {
            this.stateTextElement.innerHTML = "Foo";
        }*/


        this.setState({
            contentState: ev.contentState
        });

    }

    componentDidMount() {
        this.props.contentStateEvents.bind("content-state", this.contentStateChanged);


    }
    componentWillUnmount() {
        this.props.contentStateEvents.bind("content-state", this.contentStateChanged);
    }

    stateNameToProgressIndicatorStatusName(stateName) {
        switch (stateName) {
            case "fetching":
                return "working";
            default:
                return stateName;

        }
    }
    render() {


        // State: {JSON.stringify(this.state.contentState)} since {new Date().toTimeString()}

        var progressStatus = this.stateNameToProgressIndicatorStatusName(this.state.contentState.state);

        return (
            <div className="content-block-body-header">
                {/*
                <span className={"content-state-icon content-state-icon-" + contentStateName}>{contentStateName}</span>
                */}
                <ProgressIndicator status={progressStatus}/>
            </div>
        )
        // if (this.props.contentBodyReady) {
        //     className += " empty";
        //
        // } else {
        //     return (<span className={className}></span>)
        // }

    }

}

class ContentBlockBodyContent extends React.Component {


    constructor(props) {
        super(props);
        this.content = props.content;
    }

    shouldComponentUpdate(nextProps, nextState) {
        // We don't want to update if contentBodyReady changes from true --> false, because
        // otherwise we would lost the current body content temporarily (while fetching the new)

        if (this.props.contentBodyReady && !nextProps.contentBodyReady) {
            this.props.requireContentBody();
            return false;
        } else {
            // TODO HACK
            return !(this.props.contentBodyReady && nextProps.contentBodyReady);
            // return true;
        }
    }

    render() {
        return (this.renderContentBlockBodyContent())
    }

    renderContentBlockBodyContent() {

        // const forceRefresh = this.props.forceRefreshContent;
        // if (forceRefresh) {
        //     this.props.forceRefreshContent = false;
        // }

        // Trigger fetching of the body content (if outdated or not yet fetched):
        this.props.requireContentBody();

        if (this.props.contentBodyReady) {
            var body = this.props.getContentBodyContent();

            return (
                <div className='content-block-body-content' dangerouslySetInnerHTML={{__html: body}}></div>
            )
        } else {

            return (
                <div className='content-block-body-content'>Ladataan...</div>
            )
        }
    }
}


ContentBlockBody.propTypes = {
    // todos: PropTypes.arrayOf(
    //     PropTypes.shape({
    //         id: PropTypes.number.isRequired,
    //         completed: PropTypes.bool.isRequired,
    //         text: PropTypes.string.isRequired
    //     }).isRequired
    // ).isRequired,
    // onTodoClick: PropTypes.func.isRequired
}

export default ContentBlockBody
