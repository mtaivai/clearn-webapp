import React, { Component } from 'react';
import CKEditor from 'react-ckeditor-component';
import logo from './logo.svg';
import './App.css';
//import Fetch from 'react-fetch'

class DocumentBlock extends Component {

    constructor(props) {
        super(props);
        this.documentRepository = this.props.documentRepository;
        this.documentId = this.props.documentId;
        this.state = {
            content: null
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        //this.getContent = this.getContent.bind(this);

    }
    //
    // getContent() {
    //
    //     fetch('http://localhost:8080/document/6/content')
    //         .then(function(response) {
    //             console.log("OK? " + response.ok);
    //             return response.text();
    //         }).then(text => {
    //             console.log("Text: " + text);
    //             this.setState({content: text});
    //     });
    // }

    getContent() {
        return this.documentRepository.getDocumentContent(this.documentId);

    }

    componentDidMount() {
       // this.getContent();

        /*client({method: 'GET', path: '/api/employees'}).done(response => {
            this.setState({employees: response.entity._embedded.employees});
        });
        */
       this.setState({content: this.getContent()});


    }

    getContentMarkup() {
        if (this.state.content != null) {
            return {__html: this.state.content.contentBody};
        } else {
            return {__html: "Ladataan..."};
        }
    }
    render() {
        return (
            <div>
                <p>Dokkari {this.documentId}</p>
                <hr/>
                <div dangerouslySetInnerHTML={this.getContentMarkup()}></div>
                <hr/>
            </div>
    );
    }
}

export default DocumentBlock;
