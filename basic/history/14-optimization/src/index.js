import React from './react';
import ReactDOM from './react-dom';


function FunctionCounter(props){
  console.log('FunctionCounter')
  return (<div>
    FunctionCounter:{props.number}
  </div>)
}
class ClassCounter extends React.PureComponent {
  render(){
    console.log('ClassCounter')
    return (<div>
      ClassCounter:{this.props.number}
    </div>)
  }
}
const MemoFunctionCounter = React.memo(FunctionCounter)
console.log(MemoFunctionCounter)
/*
$$typeof: Symbol(react.memo)
compare: null
type: ƒ FunctionCounter(props)
displayName: （…）

*/
class Counter extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      number:1,
    }
    this.mountRef = React.createRef()
  }
  handleClick = () =>{
    let number = this.state.number + parseInt(this.mountRef.current.value)
    this.setState({
      number
    })
  }
  render(){
    console.log(<MemoFunctionCounter number={this.state.number}></MemoFunctionCounter>)
    /*
    $$typeof: Symbol(Symbol(react.element))
    key: undefined
    props: {number: 7, children: undefined}
    ref: undefined
    type:
      $$typeof: Symbol(Symbol(react.memo))
      compare: ƒ shallowEqual(obj1, obj2)
      type: ƒ FunctionCounter(props)
      [[Prototype]]: Object
    */
    return(<div>
      <p>Counter{this.state.number}</p>
      <ClassCounter number={this.state.number}></ClassCounter>
      <MemoFunctionCounter number={this.state.number}></MemoFunctionCounter>
      <input ref={this.mountRef}></input>
      <button onClick={this.handleClick}>+</button>
    </div>)
  }
}
ReactDOM.render(
  <Counter  />,
  document.getElementById('root')
);
