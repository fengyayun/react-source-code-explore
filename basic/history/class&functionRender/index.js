import React from './react';
import ReactDOM from './react-dom'
// let element = <h1 className="element" style={{color:'red'}}>hello<span>span</span></h1>
class ClassComponent extends React.Component{
  render(){
    return <h1 style={{color:'red'}}>
      <span>{this.props.name}</span>
      <div>{this.props.children}</div>
    </h1>
  }
}
// function FunctionComponent(props){
//   return <h1 style={{color:'red'}}>
//     <span>{props.name}</span>
//     <div>{props.children}</div>
//   </h1>
// }
// let element = <FunctionComponent name="hello">world</FunctionComponent>
let element = <ClassComponent name="hello">world</ClassComponent>
ReactDOM.render(
  element,
  document.getElementById('root')
);

/**
 * React 执行的基本流程
 * 1.babel 在编译时把jsx语法转换成React.createElement 语法形式
 * 2.在浏览器运行时 把React.createElement  生成的结果(vdom)丢给ReactDOM.render去转成真实的dom去挂载
 */

/** 
 * vdom的格式如下
 * 
 $$typeof: Symbol(react.element)
  key: null
  props: {className: 'element', style: {…}, children: 'hello'}
  ref: null
  type: "h1"
  _owner: null
  _store: {validated: false}
  _self: null
  _source: null
 * 
*/

