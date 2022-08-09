import React from 'react';
import ReactDOM from 'react-dom'
class Form extends React.Component {
  constructor(){
    super()
    this.textInputRef = React.createRef()
  }
  setFocus = () =>{
    this.textInputRef.current.getFocus()
  }
  render() {
    return (<div>
      <TextInput ref={this.textInputRef}></TextInput>
      <button onClick={this.setFocus}>获取焦点</button>
    </div>)
  }
}
class TextInput extends React.Component {
  constructor(){
    super()
    this.inputRef = React.createRef()
  }
  getFocus = () =>{
    this.inputRef.current.focus()
  }
  render(){
    return <input ref={this.inputRef}></input>
  }
}

let element = <Form ></Form>
ReactDOM.render(
  element,
  document.getElementById('root')
);



