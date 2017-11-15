import React from 'react'


import PropTypes from 'prop-types'
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
// import ReactModal from 'react-modal'

import './Block.scss'

// function XFormGroup({ id, label, help, ...props }) {
//
//     var getValidationState = function() {
//         return "success";
//     }
//     return (
//         <FormGroup
//             controlId="foo"
//             validationState={getValidationState()}>
//             <ControlLabel>Foo</ControlLabel>
//             <FormControl
//                 type="text"
//                 defaultValue="Something"
//                 placeholder="Enter text"
//
//             />
//             <FormControl.Feedback />
//             <HelpBlock>Validation is based on string length.</HelpBlock>
//         </FormGroup>
//     )
// }
class FieldGroup extends React.Component  {
    // constructor(props) {
    //     super(props);
    //
    // }
    render() {
        return (
            <FormGroup controlId={this.props.id}>
                <ControlLabel>{this.props.label}</ControlLabel>
                <FormControl {...this.props} />
                {this.props.help && <HelpBlock>{this.props.help}</HelpBlock>}
            </FormGroup>
        )
    }
}
class BlockSettingsForm extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            someText: "",
            blockSpec: JSON.parse(JSON.stringify(props.blockSpec))
        };

        this.getValidationState = this.getValidationState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getBlockSpec = this.getBlockSpec.bind(this);

        if (props.getBlockSpec) {
            props.getBlockSpec(this.getBlockSpec);
        }
    }
    getBlockSpec() {
        return this.state.blockSpec;
    }

    getValidationState() {
        return 'success';
    }
    handleInputChange(e) {
        console.log("handleInputChange: " + e);
        this.setState({ someText: e.target.value });
    }

    updateBlockSpec(update) {
        const blockSpec = this.state.blockSpec;
        if (update) {
            update(blockSpec);
        }
        this.setState({blockSpec: blockSpec});
    }

    render() {

        const blockSpec = this.state.blockSpec;

        return (
            <div>
                <form>
                    {/*
                    <FormGroup
                        controlId="title"
                        validationState={this.getValidationState()}>
                        <ControlLabel>Working example with validation</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.someText}
                            placeholder="Enter text"
                            onChange={this.handleInputChange}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>Validation is based on string length.</HelpBlock>
                    </FormGroup>

                    <XFormGroup />
                    */}

                    <FieldGroup id="title" label={"Title"} help={"Displayed title"}
                                ref={input => {this.input = input}}
                        type="text" value={blockSpec.title}
                        onChange={(e) => this.updateBlockSpec((blockSpec) => {blockSpec.title = e.target.value})}/>

                    <FieldGroup id="span" label={"Span"} help={"Span 1 - 12"}
                                type="number" value={blockSpec.layoutOptions.span}
                                onChange={(e) => this.updateBlockSpec((blockSpec) => {blockSpec.layoutOptions.span = e.target.value})}/>
                </form>
            </div>

        )
    }



}


BlockSettingsForm.propTypes = {
    getBlockSpec: PropTypes.func
    //layoutRepository: PropTypes.instanceOf(LayoutRepository).isRequired,
    //contentRepository: PropTypes.instanceOf(ContentRepository).isRequired
    // todos: PropTypes.arrayOf(
    //     PropTypes.shape({
    //         id: PropTypes.number.isRequired,
    //         completed: PropTypes.bool.isRequired,
    //         text: PropTypes.string.isRequired
    //     }).isRequired
    // ).isRequired,
    // onTodoClick: PropTypes.func.isRequired
}

export default BlockSettingsForm
