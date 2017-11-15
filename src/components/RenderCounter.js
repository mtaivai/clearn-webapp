import React from 'react';



export default class RenderCounter extends React.Component {

    constructor(props) {
        super(props);
        this.counter = 0;
    }
    render() {
        return (
            <div className={"RenderCounter"}>{this.counter++}</div>
        );
    }
}
