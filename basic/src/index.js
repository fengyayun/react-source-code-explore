import React from './react';
import ReactDOM from './react-dom'
import { updateQueue } from './Component.js'
class ClassComponent extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      num:0,
      age:13
    }
  }
  /**
   * 1.react控制的事件中setState的执行是异步且批量的
   * 2.不受react控制的事件执行是同步的且非批量的
  */
  handleClick = (amount) =>{
    console.log('handleClick');
    updateQueue.isBatchingUpdate = true
    // this.setState({num:this.state.num + amount})
    // this.setState((state) => ({ num: state.num + amount }), () => {
    //   console.log('callback', this.state);
    // });
    // this.setState({num:this.state.num + amount})
    // console.log(this.state.num)
    // this.setState({num:this.state.num + amount})
    // console.log(this.state.num)
    this.setState((state) => ({num:state.num + amount}))
    console.log(this.state.num)
    this.setState((state) => ({num:state.num + amount}))
    console.log(this.state.num)
    setTimeout(() => {
      console.log(this.state.num);
      this.setState({num:this.state.num + amount})
      console.log(this.state.num)
      this.setState({num:this.state.num + amount})
      console.log(this.state.num)
    }, 0);
    updateQueue.batchUpdate()
  }
  render(){
    return <div>
     <h1>num:{this.state.num}</h1>
     <button onClick={() => this.handleClick(10)}>+</button>
    </div>
  }
}

let element = <ClassComponent ></ClassComponent>
ReactDOM.render(
  element,
  document.getElementById('root')
);



