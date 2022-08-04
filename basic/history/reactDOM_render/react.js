import { REACT_ELEMENT } from './ReactSymbol'
import { wrapToVdom } from './util'
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

const React = {
  createElement
}
export default React