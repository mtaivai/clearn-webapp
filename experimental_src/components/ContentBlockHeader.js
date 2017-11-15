import React from 'react'

const ContentBlockHeader = (props) => (
    <div className='content-block-header'>
        <ContentBlockTitle {...props}/>
        <ContentBlockStatus {...props}/>
        <ContentBlockActions {...props}/>
    </div>
)


const ContentBlockTitle = ({contentItem}) => (
    <span className='content-block-title'>Title of {contentItem.id}</span>
)
const ContentBlockStatus = (props) => (
    <span className="content-block-status">Muokkaus: {props.editMode ? 'Joo' : 'ei'}</span>
)
const ContentBlockActions = (props) => {
    var editAction = (e) => {
        props.onAction("edit");
    }
    var refreshContentAction = (e) => {
        props.onAction("refreshContent");
    }
    return (
        <div className="content-block-actions">
            <button onClick={editAction}>Muokkaa</button>
            <button onClick={refreshContentAction}>Päivitä</button>

        </div>
    )
}

export default ContentBlockHeader
