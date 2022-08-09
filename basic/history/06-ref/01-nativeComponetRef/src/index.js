import React from './react';
import ReactDOM from './react-dom'

class Sum extends React.Component {
  constructor(props){
    super(props)
    this.a = React.createRef()
    this.b = React.createRef()
    this.c = React.createRef()
  }
  add = () =>{
    this.c.current.value = this.a.current.value + this.b.current.value
  }
  render(){
    return (<div>
      <input ref={this.a} ></input>+
      <input ref={this.b} ></input>
      <button onClick={this.add}>=</button>
      <input ref={this.c} ></input>
    </div>)
  }
}

let element = <Sum ></Sum>
ReactDOM.render(
  element,
  document.getElementById('root')
);



