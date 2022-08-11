import { updateQueue } from './Component'
/**
 * 给dom添加合成事件
 * 1.做一个类似面向切面编程的操作 AOP 。在用户自己的handler函数之前做一些事情，之后做一些事情
 * 2.处理浏览器的兼容性 提供兼容所有的浏览器的统一的API，屏蔽浏览器的差异
 * 3.模拟事件冒泡的阻止冒泡的过程
 * @param {*} dom 真实dom
 * @param {*} eventType 事件类型
 * @param {*} handler 事件处理函数
 */
export const addEvent = (dom,eventType,handler) =>{
  let store = dom._store || (dom._store = {});
  store[eventType] = handler
  if (!document[eventType]){
    document[eventType] = dispatchEvent
  }
}
/**
 * document 上绑定的点击事件处理函数
 * @param {*} nativeEvent 原生事件对象
 */
function dispatchEvent(nativeEvent){
  updateQueue.isBatchingUpdate = true
  let { type, target } = nativeEvent
  let eventType = `on${type}`
  let syntheticEvent = createSyntheticEvent(nativeEvent)
  while(target) {
    let { _store } = target
    let handler = _store && _store[eventType]
    if (handler) handler(syntheticEvent)
    // 阻止冒泡
    if (syntheticEvent.isPropagationStopped){
      break;
    }
    target = target.parentNode;
  }
  updateQueue.batchUpdate()
}

/**
 * 根据原生事件对象生成合成事件对象
 * @param {*} nativeEvent 原生事件对象
 */
function createSyntheticEvent(nativeEvent){
  let syntheticEvent = {}
  for (const key in nativeEvent) {
    let value = nativeEvent[key]
    if (typeof value === 'function') value = value.bind(nativeEvent)
    syntheticEvent[key] = value
  }
  syntheticEvent.nativeEvent = nativeEvent
  syntheticEvent.isPropagationStopped = false //当前是否已经阻止冒泡了
  syntheticEvent.stopPropagation = stopPropagation //调用可以阻止冒泡
  syntheticEvent.defaultPrevented = false;//当前的是否已经阻止冒泡了
  syntheticEvent.preventDefault = preventDefault;//调用此方法可以阻止冒泡
  return syntheticEvent
}
//阻止冒泡 屏蔽浏览器点差异性
function stopPropagation(){
  let event = this.nativeEvent
  if (event.stopPropagation){
    event.stopPropagation()
  }else {
    event.cancelBubble = true
  }
  this.isPropagationStopped = true
}
//阻止默认事件 屏蔽浏览器差异性
function preventDefault() {
  const event = this.nativeEvent;
  if (event.preventDefault) {//标准浏览器
      event.preventDefault();
  } else {//IE
      event.returnValue = false;
  }
  this.defaultPrevented = true;
}