import React from 'react';
import React2 from './react';
import ReactDOM from 'react-dom'
// let element = <h1 className="element" style={{color:'red'}}>hello<span>span</span></h1>
let element = React.createElement('h1',{
  className:'element',
  style:{
    color:'red'
  }
},'hello',React.createElement('span',null,'span'))
let el1 = React2.createElement('h1',{
  className:'element',
  style:{
    color:'red'
  }
},'hello',React.createElement('span',null,'span'))
console.log(el1)
console.log(element);
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

