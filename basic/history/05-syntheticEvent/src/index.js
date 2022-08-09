import React from './react';
import ReactDOM from './react-dom'
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
  handleClick = (event,amount) =>{
    console.log('handleClick');
    console.log('event',event);
    event.stopPropagation()
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
  }
  divClick = () =>{
    console.log('divClick');
  }
  render(){
    return <div onClick={this.divClick}>
     <h1>num:{this.state.num}</h1>
     <button onClick={(e) => this.handleClick(e,10)}>+</button>
    </div>
  }
}

let element = <ClassComponent ></ClassComponent>
ReactDOM.render(
  element,
  document.getElementById('root')
);



