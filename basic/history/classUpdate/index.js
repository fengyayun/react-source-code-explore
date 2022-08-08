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
  handleClick = (amount) =>{
    console.log('handleClick');
    // this.setState({num:this.state.num + amount})
    this.setState((state) => ({ num: state.num + amount }), () => {
      console.log('callback', this.state);
    });
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



