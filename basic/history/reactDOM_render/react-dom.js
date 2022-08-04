import { REACT_TEXT } from './ReactSymbol'
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
  container.append(el)
}
/**
 * 虚拟dom转成真实dom
 * @param {*} vdom 虚拟dom
 */
function createDOM(vdom){
  let { type, props } = vdom

  let dom = createElement(type,props)
  if (props) {
    updateProps(dom,null,props)
    const children = props.children
    if (typeof children === 'object' && children.$$typeof){
      mount(children,dom)
    }else if (Array.isArray(children)){
      children.forEach(child =>{
        mount(child,dom)
      })
    }
  }
  //虚拟dom上挂载一个真实dom
  vdom.dom = dom
  return dom
}


/**
 * 根据新老虚拟dom中的属性去更新真实dom的属性
 * @param {*} dom 真实dom
 * @param {*} oldVdom 老的虚拟dom
 * @param {*} newVdom 新的虚拟dom
 */
function updateProps(dom,oldVdom={},newVdom={}){
  for (const key in newVdom) {
    if (key === 'children'){
      continue;
    }else if (key === 'style'){
      let styleObj = newVdom[key]
      for (const style in styleObj) {
        dom.style[style] = styleObj[style]
      }
    }else {
      dom[key] = newVdom[key]
    }
  }
  //老的有新的没有需要删除
  for (const key in oldVdom) {
    // style需要进一步处理这里就不在写了
    if (!newVdom.hasOwnProperty(key)) {
      dom[key] = null;
    }
  }
}

/**
 * 根据虚拟dom创建成真实dom
 * @param {*} type 虚拟dom类型
 */
function createElement(type,props){
  let dom;
  if (type === REACT_TEXT){
    dom = document.createTextNode(props)
  }else {
    dom = document.createElement(type)
  }
  return dom
}
const ReactDOM = {
  render
}
export default ReactDOM