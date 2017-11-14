import React, { Component } from 'react';
// import CKEditor from 'react-ckeditor-component';

//import logo from './logo.svg';
import './App.css';


// import ContentBlock from './components/ContentBlock'
// import UnknownBlock from './components/UnknownBlock'

import Layout from './components/Layout'

//import ContentRepository from './ContentRepository'
import MockContentRepository from './services/content/MockContentRepository'
import MockLayoutRepository from './services/layout/MockLayoutRepository'
// import BlockSettingsForm from './components/BlockSettingsForm'

// import ObjectUtils from './util/ObjectUtils'



class App extends Component {

    constructor(props) {
        super(props);
        //this.documentRepository = new DocumentRepository();
        this.contentRepository = new MockContentRepository();
        this.layoutRepository = new MockLayoutRepository();
    }



  render() {

        // var getBlockSpec = function() {
        //     console.error("getConfiguration is not bound");
        // }
        //
        // var blockSpec = {
        //     type: "StaticContentBlock",
        //     title: "Some static content 3",
        //     layout: {
        //         targetZone: "footer",
        //         span: 4
        //     },
        //     configuration: {
        //         contentType: "text/html",
        //         contentBodyText: "One"
        //     }
        // }


      // const obj = {
      //     foo: "bar",
      //     one: {
      //         two: {
      //             three: "3",
      //             arr: [
      //                 "item1",
      //                 ["item2.1", "item2.2", {foo: "foo"}],
      //                 {
      //                     "x": "X",
      //                     "y": ["Y1", "Y2"]
      //                 }
      //             ]
      //         },
      //         three: "tre"
      //     }
      // }
      // console.log("foo: " + ObjectUtils.getProperty(obj, "foo"));
      // console.log("one: " + ObjectUtils.getProperty(obj, "one"));
      // console.log("one.three: " + ObjectUtils.getProperty(obj, "one.three"));
      // console.log("one.two.three: " + ObjectUtils.getProperty(obj, "one.two.three"));
      // console.log("one.two.arr[0]: " + ObjectUtils.getProperty(obj, "one.two.arr[0]"));
      // console.log("one.two.arr[1][2].foo: " + ObjectUtils.getProperty(obj, "one.two.arr[1][2].foo"));
      // ObjectUtils.setProperty(obj, "one.two.arr[1][2].foo", "bar");
      // console.log("one.two.arr[1][2].foo: " + ObjectUtils.getProperty(obj, "one.two.arr[1][2].foo"));

      // console.log("one.two.arr[2].x[0]: " + ObjectUtils.getProperty(obj, "one.two.arr[2].x[0]"));
      // console.log("one.two.arr[1][0]: " + ObjectUtils.getProperty(obj, "one.two.arr[1][0]"));
      // console.log("one.['two'].[ \"arr\"][1][0]: " + ObjectUtils.getProperty(obj, "one.['two']['arr'][1][0]"));
    return (
      <div className="App">

          {/*
          <BlockSettingsForm
              blockSpec = {blockSpec}
              getBlockSpec={(fn) => {getBlockSpec = fn}}/>

          <button onClick={(e) => {console.log("settings: " + JSON.stringify(getBlockSpec()))}}>Apply</button>
*/}
          <Layout layoutId="home" layoutRepository={this.layoutRepository} contentRepository={this.contentRepository}/>

          {/*
          <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" ></img>
              <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          */}
          {/*
          <AddTodo/>
          <VisibleTodoList/>
          <Footer/>
          <DocumentBlock documentId={"6"} documentRepository={this.documentRepository}></DocumentBlock>
          */}


          {/*this.getBlockComponents()*/}
          {/* Content here




          */}


      </div>
    );
  }
}
//
// class Example extends Component {
//     constructor(props) {
//         super(props);
//         this.updateContent = this.updateContent.bind(this);
//         this.onChange = this.onChange.bind(this);
//         this.onBlur = this.onBlur.bind(this);
//
//         this.state = {
//             content: 'content',
//         }
//     }
//
//     updateContent(newContent) {
//         this.setState({
//             content: newContent
//         })
//     }
//
//     onChange(evt){
//         console.log("onChange fired with event info: ", evt);
//         var newContent = evt.editor.getData();
//         this.setState({
//             content: newContent
//         })
//     }
//
//     onBlur(evt){
//         console.log("onBlur event called with event info: ", evt);
//     }
//
//     afterPaste(evt){
//         console.log("afterPaste event called with event info: ", evt);
//     }
//
//     render() {
//         return (
//             <CKEditor
//                 activeClass="p10"
//                 content={this.state.content}
//                 events={{
//                     "blur": this.onBlur,
//                     "afterPaste": this.afterPaste,
//                     "change": this.onChange
//                 }}
//             />
//         )
//     }
// }

export default App;
//export default Example;
