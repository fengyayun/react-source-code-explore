import { REACT_TEXT, REACT_FORWARD_REF, REACT_CONTEXT, REACT_PROVIDER } from './ReactSymbol'
import { MOVE, PLACEMENT } from './ReactFlags'
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
    if (el.componentDidMount) el.componentDidMount()
  }
}
/**
 * 虚拟dom转成真实dom
 * @param {*} vdom 虚拟dom
 */
function createDOM(vdom){
  let { type, props,ref } = vdom
  if (type && type.$$typeof === REACT_FORWARD_REF){
    return mountForwardComponent(vdom)
  }else if(type && type.$$typeof === REACT_CONTEXT){
    return mountContextComponent(vdom)
  }else if(type && type.$$typeof === REACT_PROVIDER){
    return mountProviderComponent(vdom)
  }

  let dom = createElement(type,props,vdom)
  if (props) {
    updateProps(dom,null,props)
    const children = props.children
    if (Array.isArray(children)){
      reconcileChildren(children,dom)
    }else if (typeof children === 'object' && children.$$typeof){
      children.mountIndex = 0
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
      child.mountIndex = index
      mount(child, parentDOM);
  });
}

function mountContextComponent(vdom){
  let { type,props } = vdom
  let context = type._context
  let renderDom = props.children[0](context._currentValue)
  vdom.oldRenderVdom = renderDom
  return createDOM(renderDom)
}
function mountProviderComponent(vdom){
  let { type,props } = vdom
  let context = type._context
  context._currentValue = props.value
  let renderDom = props.children[0]
  vdom.oldRenderVdom = renderDom
  return createDOM(renderDom)
}


function mountForwardComponent(vdom){
  //render=TextInput函数组件
  //vdom = {type:ForwardedTextInput,props:{},ref:this.textInputRef}
  //vdom = {type:{render},props:{},ref:this.textInputRef}
  let { type, ref, props} = vdom
  let renderDom = type.render(props,ref)
  vdom.oldRenderVdom = renderDom
  return createDOM(renderDom)
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
  let newProps = type.defaultProps?{...props,...type.defaultProps}:props
  let classInstance = new type(newProps)
  if (type.contextType){
    classInstance.context = type.contextType._currentValue
  }
  if (type.getDerivedStateFromProps){
    type.getDerivedStateFromProps(props,classInstance.state || {})
  }
  if (ref) ref.current = classInstance
  vdom.classInstance = classInstance;
  if (classInstance.componentWillMount){
    classInstance.componentWillMount()
  }
  let renderDom = classInstance.render()
  classInstance.oldRenderVdom = renderDom
  let dom =  createDOM(renderDom)
  if (dom && classInstance.componentDidMount){
    dom.componentDidMount = classInstance.componentDidMount.bind(classInstance)
  }
  return dom
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
//TODO nextDOM
export const compareTwoVdom = (parentDom,oldVdom,newVdom,nextDOM) =>{
  // let newDom = createDOM(newRenderVdom)
  // let oldDom = findDOM(oldRenderVdom)
  // parentDom.replaceChild(newDom,oldDom)
  //两个虚拟dom都没有就什么都不做
  if (!oldVdom && !newVdom){
    return
  }else if (oldVdom && !newVdom){
    // 老的有 新的没有 就执行卸载老的
    unMountVdom(oldVdom)
  }else if (!oldVdom && newVdom){
    //老的没有 新的有 就直接创建
    let newDOM = createDOM(newVdom)
    if (nextDOM){
      parentDom.insertBefore(newDOM,nextDOM)
    }else {
      parentDom.appendChild(newDOM)
    }
    if (newDOM.componentDidMount) newDOM.componentDidMount()
  }else if (oldVdom && newVdom && oldVdom.type !== newVdom.type){
    //新老都有但是type不同不能复用 就直接卸载老的 然后创建新的
    unMountVdom(oldVdom)
    let newDOM = createDOM(newVdom)
    if (nextDOM){
      parentDom.insertBefore(newDOM,nextDOM)
    }else {
      parentDom.appendChild(newDOM)
    }
    if (newDOM.componentDidMount) newDOM.componentDidMount()
  }else {
    updateElement(oldVdom,newVdom)
  }
}

/**
 * 深度比较虚拟dom以及把其差异更新到真实dom上
 * @param {*} oldVdom 老的虚拟dom
 * @param {*} newVdom 新的虚拟dom
 */
function updateElement(oldVdom,newVdom){
  let { type } = oldVdom
  if(type === REACT_TEXT){
    let currentDOM = newVdom.dom = findDOM(oldVdom)
    if (oldVdom.props !== newVdom.props){
      currentDOM.textContent = newVdom.props
    }
  }else if (type.$$typeof === REACT_CONTEXT){
    //渲染CONTEXT组件
    updateContextComponent(oldVdom,newVdom)
  }else if (type.$$typeof === REACT_PROVIDER){
    //渲染PROVIDER组件
    updateProviderComponent(oldVdom,newVdom)
  }else if (typeof type === 'string'){
    //原生组件
    let currentDom = newVdom.dom = findDOM(oldVdom)
    updateProps(currentDom,oldVdom.props,newVdom.props)
    updateChildren(currentDom,oldVdom.props.children,newVdom.props.children)
  }else if (typeof type === 'function'){
    if (type.isReactComponent){
      //类组件
      updateClassComponent(oldVdom,newVdom)
    }else {
      //函数组件
      updateFunctionComponent(oldVdom,newVdom)
    }
  }
}

function updateFunctionComponent(oldVdom,newVdom){
  let currentDOM = findDOM(oldVdom)
  if (!currentDOM) return
  let parentDOM = currentDOM.parentNode;
  let { type, props } = newVdom;
  let newRenderVdom = type(props);
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom);
  newVdom.oldRenderVdom = newRenderVdom;
}

/**
 * 更新Context组件
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateContextComponent(oldVdom,newVdom){
  let currentDOM = findDOM(oldVdom);
  if (!currentDOM) return;
  let parentDOM = currentDOM.parentNode;
  let { type, props } = newVdom
  let childrenFunction = Array.isArray(props.children)?props.children[0]:props.children
  let newRenderDom = childrenFunction(type._context._currentValue)
  compareTwoVdom(parentDOM,oldVdom.oldRenderVdom,newRenderDom)
  newVdom.oldRenderVdom = newRenderDom
}

/**
 * 更新Provider组件
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateProviderComponent(oldVdom,newVdom){
  let currentDOM = findDOM(oldVdom);
  if (!currentDOM) return;
  let parentDOM = currentDOM.parentNode;
  let { type, props } = newVdom
  let context = type._context
  context._currentValue = props.value
  let newRenderDom = Array.isArray(props.children)?props.children[0]:props.children
  compareTwoVdom(parentDOM,oldVdom.oldRenderVdom,newRenderDom)
  newVdom.oldRenderVdom = newRenderDom
}

/**
 * 更新类组件 要复用老的类组件实例
 * @param {*} oldVdom 老的虚拟dom
 * @param {*} newVdom 新的虚拟dom
 */
function updateClassComponent(oldVdom,newVdom){
  let classInstance = oldVdom.classInstance
  newVdom.classInstance = classInstance
  if (classInstance.componentWillReceiveProps){
    classInstance.componentWillReceiveProps(newVdom.props)
  }
  //然后走组件的更新
  classInstance.updater.emitUpdate(newVdom.props)
}
function updateChildren(parentDOM,oldVChildren = [],newVChildren = []){
  oldVChildren = (Array.isArray(oldVChildren)?oldVChildren:[oldVChildren]).filter(item => item)
  newVChildren = (Array.isArray(newVChildren)?newVChildren:[newVChildren]).filter(item => item)
  /**
   * diff算法的原则:
   * 1.只进行同级比较不会跨级比较
   * 2.相同类型的vdom才会复用
   * 3.通过key标识要移动的元素
   */
  //把老节点存在以key属性，节点为值的map中
  let keyedOldMap = {}
  //上一个可复用dom的挂载索引
  let lastPlacedIndex = 0
  oldVChildren.forEach((oldChild,index) =>{
    keyedOldMap[oldChild.key || index] = oldChild
  })
  //存放操作的补丁包
  let patch = [];
  newVChildren.forEach((newVChild, index) => {
      let newKey = newVChild.key || index;
      let oldVChild = keyedOldMap[newKey];
      if (oldVChild && oldVChild.type === newVChild.type) {
          //更新老节点
          updateElement(oldVChild, newVChild);
          if (oldVChild.mountIndex < lastPlacedIndex) {
              patch.push({
                  type: MOVE,
                  oldVChild,
                  newVChild,
                  mountIndex: index
              });
          }
          //如果你复用了一个老节点，那就要从map中删除
          delete keyedOldMap[newKey];
          lastPlacedIndex = Math.max(lastPlacedIndex, oldVChild.mountIndex);
      } else {
          patch.push({
              type: PLACEMENT,
              newVChild,
              mountIndex: index
          });
      }
  });
  //获取所有的要移动的老节点
  let moveChild = patch.filter(action => action.type === MOVE).map(action => action.oldVChild);
  //把剩下的没有复用到的老节点和要移动的节点全部从DOM树中删除
  let deleteVChildren = Object.values(keyedOldMap)
  deleteVChildren.concat(moveChild).forEach(oldVChild => {
      let currentDOM = findDOM(oldVChild);
      parentDOM.removeChild(currentDOM);
  });
  if (patch) {
      patch.forEach(action => {
          let { type, oldVChild, newVChild, mountIndex } = action
          let childNodes = parentDOM.childNodes;//[0 A,1:C:2 E]
          let currentDOM;
          if (type === PLACEMENT) {
              currentDOM = createDOM(newVChild);
              newVChild.mountIndex = mountIndex;
          } else if (type === MOVE) {
              currentDOM = findDOM(oldVChild);
              oldVChild.mountIndex = mountIndex;
          }
          let childNode = childNodes[mountIndex]
          if (childNode) {
              parentDOM.insertBefore(currentDOM, childNode);
          } else {
              parentDOM.appendChild(currentDOM);
          }
      });
  }

}
function unMountVdom(vdom){
  let { props, ref } = vdom
  let children = props.children
  let currentDom = findDOM(vdom)
  if (vdom.classInstance && vdom.classInstance.componentWillUnmount) {
    vdom.classInstance.componentWillUnmount();
  }
  if (ref) ref.current = null
  if (children){
    let childrenArr = Array.isArray(children)?children:[children]
    childrenArr.forEach(unMountVdom)
  }
  //删除老节点
  if (currentDom) {
    currentDom.parentNode.removeChild(currentDom)
  }
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