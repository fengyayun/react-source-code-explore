import { REACT_TEXT } from './ReactSymbol'
import { addEvent } from './event'
function render(vdom,container){
  mount(vdom,container)
}
/**
 * 把虚拟转成真实dom并挂载到容器中
 * @param {*} vdom 虚拟dom
 * @param {*} container 容器
 */
function mount(vdom,container){
  let el = createDOM(vdom)
  if (el) {
    container.appendChild(el)
  }
}
/**
 * 虚拟dom转成真实dom
 * @param {*} vdom 虚拟dom
 */
function createDOM(vdom){
  let { type, props,ref } = vdom

  let dom = createElement(type,props,vdom)
  if (props) {
    updateProps(dom,null,props)
    const children = props.children
    if (Array.isArray(children)){
      reconcileChildren(children,dom)
    }else if (typeof children === 'object' && children.$$typeof){
      mount(children,dom)
    }
  }
  //虚拟dom上挂载一个真实dom
  vdom.dom = dom
  if (ref) ref.current = dom
  return dom
}
function reconcileChildren(children, parentDOM) {
  children.forEach((child, index) => {
      mount(child, parentDOM);
  });
}

/**
 * 根据新老虚拟dom中的属性去更新真实dom的属性
 * @param {*} dom 真实dom
 * @param {*} oldVdom 老的虚拟dom
 * @param {*} newVdom 新的虚拟dom
 */
function updateProps(dom,oldProps={},newProps={}){
  for (const key in newProps) {
    if (key === 'children'){
      continue;
    }else if (key === 'style'){
      let styleObj = newProps[key]
      for (const style in styleObj) {
        dom.style[style] = styleObj[style]
      }
    }else if (/^on[A-Z].*/.test(key)) {
      // dom[key.toLowerCase()] = newProps[key];
      addEvent(dom,key.toLowerCase(),newProps[key])
    }else {
      dom[key] = newProps[key]
    }
  }
  //老的有新的没有需要删除
  for (const key in oldProps) {
    // style需要进一步处理这里就不在写了
    if (!newProps.hasOwnProperty(key)) {
      dom[key] = null;
    }
  }
}

/**
 * 根据虚拟dom创建成真实dom
 * @param {*} type 虚拟dom类型
 */
function createElement(type,props,vdom){
  let dom;
  if (type === REACT_TEXT){
    dom = document.createTextNode(props)
  }else if(typeof type === 'function'){
    if (type.isReactComponent){
      return mountClassComponent(vdom)
    }
    return mountFunctionComponent(vdom)
  }else if (type) {
    dom = document.createElement(type)
  }
  return dom
}
/**
 * 渲染class组件
 * @param {*} vdom 虚拟dom
 * @returns 返回真实dom
 */
function mountClassComponent(vdom){
  let { type, props,ref } = vdom
  let classInstance = new type(props)
  if (ref) ref.current = classInstance
  vdom.classInstance = classInstance;
  let renderDom = classInstance.render()
  classInstance.oldRenderVdom = renderDom
  return createDOM(renderDom)
}

/**
 * 渲染函数式组件
 * @param {*} vdom 虚拟dom
 * @returns 返回真实dom
 */
function mountFunctionComponent(vdom) {
  let { type, props } = vdom
  //拿出函数进行执行取出renderDOM
  let renderVdom = type(props);
  //vdom.老的要渲染的虚拟DOM=renderVdom,方便后面的DOM
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}
export const compareTwoVdom = (parentDom,oldRenderVdom,newRenderVdom) =>{
  let newDom = createDOM(newRenderVdom)
  let oldDom = findDOM(oldRenderVdom)
  parentDom.replaceChild(newDom,oldDom)
}
export const findDOM = (vdom) =>{
  if (!vdom) return null
  if (vdom.dom) {
    return vdom.dom
  }
  let oldRenderVdom = vdom.classInstance?vdom.classInstance.oldRenderVdom:vdom.oldRenderVdom
  return findDOM(oldRenderVdom)
}
const ReactDOM = {
  render
}
export default ReactDOM