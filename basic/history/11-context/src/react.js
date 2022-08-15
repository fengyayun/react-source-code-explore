import { REACT_ELEMENT, REACT_FORWARD_REF, REACT_CONTEXT, REACT_PROVIDER } from './ReactSymbol'
import { wrapToVdom } from './util'
import Component from './Component';
/**
 * 工厂方法去创建虚拟dom
 * @param {*} type 元素的类型
 * @param {*} config 配置对象
 * @param {*} children 子元素
 */
function createElement(type,config,children){
  let ref,key;
  if (config){
    ref = config.ref
    key = config.key
    delete config.ref
    delete config.key
    delete config._self
    delete config._source
  }
  let props = { ...config }
  if (arguments.length > 2){
    props.children = Array.prototype.slice.call(arguments,2).map(wrapToVdom)
  }else {
    props.children = wrapToVdom(children)
  }
  return {
    $$typeof: REACT_ELEMENT,
    type,
    ref,
    key,
    props
  }
}

function createRef(){
  return {current:null}
}
function forwardRef(render) {
  return {
    $$typeof:REACT_FORWARD_REF,
    render
  }
}
let Children = {
  map(children,mapFn){
    return children.flat(mapFn)
  }
}
function createContext(){
  let context = { $$typeof:REACT_CONTEXT, _currentValue:''}
  context.Provider = {
    $$typeof:REACT_PROVIDER,
    _context:context
  }
  context.Consumer = {
    $$typeof:REACT_CONTEXT,
    _context:context
  }
  return context
}

const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
  Children,
  createContext
}
export default React