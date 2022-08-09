import { findDOM, compareTwoVdom } from './react-dom'
export let updateQueue = {
  isBatchingUpdate: false, //更新队列中有个是否执行批量更新
  updaters: new Set(),// 更新队列中的实例集合
  batchUpdate(){ //批量更新函数
    for (const update of updateQueue.updaters) {
      update.updateComponent()
    }
    updateQueue.isBatchingUpdate = false
    updateQueue.updaters.clear()
  },
}
class Updater {
  constructor(classInstance){
    //类组件实例
    this.classInstance = classInstance
    //等待更新的状态
    this.pendingStates = []
    //回调
    this.callbacks = []
  }
  addState = (partialState,callback) =>{
    this.pendingStates.push(partialState)
    if (typeof callback === 'function'){
      this.callbacks.push(callback)
    }
    //触发更新
    this.emitUpdate()
  }
  emitUpdate = () =>{
    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.add(this)
    }else {
      this.updateComponent()
    }
  }
  updateComponent = () =>{
    let { classInstance, pendingStates } = this
    if (pendingStates && pendingStates.length > 0){
      shouldUpdate(classInstance,this.getState())
    }
    this.callbacks.forEach(callback =>{
      callback && callback()
    })
    this.callbacks.length = 0
  }
  //返回最新的状态
  getState(){
    let { pendingStates, classInstance } = this
    let { state } = classInstance
    pendingStates.forEach(partialState =>{
      if (typeof partialState === 'function'){
        partialState = partialState(state)
      }
      state = {...state,...partialState}
    })
    pendingStates = 0
    return state
  }
}
function shouldUpdate(classInstance,nextState){
  classInstance.state = nextState
  classInstance.forceUpdate()
}
class Component {
  static isReactComponent = true
  constructor(props){
    this.props = props
    this.state = {}
    this.updater = new Updater(this)
  }
  setState = (partialState,callback) =>{
    //react更新是交给一个更新器进行更新的
    this.updater.addState(partialState,callback)
  }
  forceUpdate = () =>{
    //拿到老的虚拟dom
    let { oldRenderVdom } = this
    //找到虚拟dom对应的dom
    let oldDom = findDOM(oldRenderVdom)
    //拿到最新的虚拟dom
    let newRenderVdom = this.render()
    //把差异更新到dom上
    compareTwoVdom(oldDom.parentNode,oldRenderVdom,newRenderVdom)
    this.oldRenderVdom = newRenderVdom

  }
}
export default Component