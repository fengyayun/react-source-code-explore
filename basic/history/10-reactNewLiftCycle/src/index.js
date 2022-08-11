import React from './react';
import ReactDOM from './react-dom'
class Counter extends React.Component {
  static getDerivedStateFromProps(nextProps,prevState){
    console.log('getDerivedStateFromProps')
    return undefined
  }
  static defaultProps = {
    name:'yyfeng'
  }
  shouldComponentUpdate(nextProps,nextState){
    console.log('shouldComponentUpdate',nextProps)
    return true
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
  render(){
    console.log('3-render');
    return (<div>
      <h1>num:{this.state.number}</h1>
      <ChildCount count={this.state.number}></ChildCount>
      <button onClick={this.handleClick}>+</button>
    </div>)
  }
  getSnapshotBeforeUpdate(prevProps,prevState){
    console.log('getSnapshotBeforeUpdate')
    return null
  }
  componentDidMount(){
    console.log('4-componentDidMount')
  }
  componentDidUpdate(){
    console.log('6-componentDidUpdate')
  }
}
class ChildCount extends React.Component {
  static getDerivedStateFromProps(nextProps,prevState){
    console.log('child-getDerivedStateFromProps')
    const { count } = nextProps;
    return { number: count * 2 };;
  }
  constructor(props){
    super(props)
    this.state = {
      number:0
    }
    console.log('0-child-constructor')
  }
  shouldComponentUpdate(nextProps,nextState){
    console.log('child-shouldComponentUpdate',nextProps)
    return true
  }
  render(){
    console.log('3-child-render');
    return (<div>{this.state.number}</div>)
  }
  getSnapshotBeforeUpdate(prevProps,prevState){
    console.log('child-getSnapshotBeforeUpdate',prevProps,prevState)
    return null
  }
  componentDidMount(){
    console.log('4-child-componentDidMount')
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



