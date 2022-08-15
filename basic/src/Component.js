import { findDOM, compareTwoVdom } from './react-dom'
export let updateQueue = {
  isBatchingUpdate: false, //更新队列中有个是否执行批量更新
  updaters: new Set(),// 更新队列中的实例集合
  batchUpdate(){ //批量更新函数
    updateQueue.isBatchingUpdate = false
    for (const update of updateQueue.updaters) {
      update.updateComponent()
    }
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
  emitUpdate = (nextProps = {}) =>{
    this.nextProps = nextProps
    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.add(this)
    }else {
      this.updateComponent()
    }
  }
  updateComponent = () =>{
    let { classInstance, pendingStates,nextProps } = this
    if (nextProps || (pendingStates && pendingStates.length > 0)){
      shouldUpdate(classInstance,nextProps,this.getState())
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
// 根组件不会走 shouldUpdate
function shouldUpdate(classInstance,nextProps={},nextState){
  let willUpdate = true
  if (classInstance.constructor.getDerivedStateFromProps){
    let tempNewState = classInstance.constructor.getDerivedStateFromProps(nextProps,classInstance.state)
    if (tempNewState){
      nextState = {...nextState,...tempNewState}
    }
  }
    //不管是否需要更新 状态值都应该更新成最新的 
    //非首次渲染才走shouldComponentUpdate并且非根组件 TODO
  if (classInstance.shouldComponentUpdate && !classInstance.shouldComponentUpdate(nextProps,nextState)){
    willUpdate = false
  }
  classInstance.prevState = classInstance.state
  classInstance.state = nextState
  if (nextProps) {
    classInstance.prevProps = classInstance.props
    classInstance.props = nextProps
  }
  if (willUpdate) classInstance.forceUpdate()
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
    if (this.componentWillUpdate){
      this.componentWillUpdate()
    }
    if (this.constructor.contextType){
      this.context = this.constructor.contextType._currentValue
    }
    let newRenderVdom = this.render()
    let snapshot = this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate(this.prevProps,this.prevState);
    //把差异更新到dom上
    compareTwoVdom(oldDom.parentNode,oldRenderVdom,newRenderVdom,null)
    this.oldRenderVdom = newRenderVdom
    if (this.componentDidUpdate){
      this.componentDidUpdate(this.props, this.state, snapshot)
    }

  }
}
export default Component