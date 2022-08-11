import React from './react';
import ReactDOM from './react-dom'
class Counter extends React.Component {
  static defaultProps = {
    name:'yyfeng'
  }
  constructor(props){
    super(props)
    this.state = {
      number:0
    }
    console.log('1-constructor')
  }
  handleClick = () =>{
    this.setState({number:this.state.number+1})
  }
  shouldComponentUpdate(nextProps,nextState){
    return nextState.number % 2 === 0
  }
  componentWillMount(){
    console.log('2-componentWillMount')
  }
  render(){
    console.log('3-render');
    return (<div>
      <h1>num:{this.state.number}</h1>
      {this.state.number === 4?null:<ChildCount count={this.state.number}></ChildCount>}
      <button onClick={this.handleClick}>+</button>
    </div>)
  }
  componentDidMount(){
    console.log('4-componentDidMount')
  }
  componentWillUpdate(){
    console.log('5-componentWillUpdate')
  }
  componentDidUpdate(){
    console.log('6-componentDidUpdate')
  }
}
class ChildCount extends React.Component {
  constructor(props){
    super(props)
    this.state = {}
    console.log('0-child-constructor')
  }
  componentWillReceiveProps(){
    console.log('1-child-componentWillReceiveProps')
  }
  shouldComponentUpdate(nextProps,nextState){
    return nextProps.number % 3 === 0
  }
  componentWillMount(){
    console.log('2-child-componentWillMount')
  }
  render(){
    console.log('3-child-render');
    return (<div>{this.props.count}</div>)
  }
  componentDidMount(){
    console.log('4-child-componentDidMount')
  }
  componentWillUpdate(){
    console.log('5-child-componentWillUpdate')
  }
  componentDidUpdate(){
    console.log('6-child-componentDidUpdate')
  }
  componentWillUnmount() {
    console.log(`7-child-componentWillUnmount`);
  }
}
ReactDOM.render(
  <Counter></Counter>,
  document.getElementById('root')
);



