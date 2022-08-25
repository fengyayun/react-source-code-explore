import React from 'react';
import ReactDOM from 'react-dom';
function FancyInput(props,ref){
  const inputRef = React.useRef()
  React.useImperativeHandle(ref,() =>({
    focus:() =>{
      inputRef.current.focus()
    }
  }))
  return (<div>
    <input ref={inputRef}></input>
  </div>)
}
const FancyInputForward = React.forwardRef(FancyInput)
function App(){
  const FancyRef = React.useRef()
  return (<div>
    <FancyInputForward ref={ FancyRef }></FancyInputForward>
    <button onClick={ () => FancyRef.current.focus() }>获取焦点</button>
  </div>)
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
