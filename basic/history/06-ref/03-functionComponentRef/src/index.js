import React from './react';
import ReactDOM from './react-dom'
function TextInput(props,inputRef){
  return <input ref={inputRef}></input>
}
const ForwardedTextInput = React.forwardRef(TextInput)
console.log('ForwardedTextInput',ForwardedTextInput)
/**
 *ForwardedTextInput = $$typeof: Symbol(react.forward_ref)
render: ƒ TextInput(props, inputRef)
 */
class Form extends React.Component {
  constructor(){
    super()
    this.textInputRef = React.createRef()
  }
  setFocus = () =>{
    this.textInputRef.current.focus()
  }
  render() {
    return (<div>
      <ForwardedTextInput ref={this.textInputRef}></ForwardedTextInput>
      <button onClick={this.setFocus}>获取焦点</button>
    </div>)
  }
}


let element = <Form ></Form>
ReactDOM.render(
  element,
  document.getElementById('root')
);



