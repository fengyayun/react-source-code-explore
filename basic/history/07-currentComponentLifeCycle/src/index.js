import React from 'react';
import ReactDOM from 'react-dom'
class Counter extends React.Component {
  static defaultProps = {
    name:'yyfeng'
  }
  constructor(props){
    super(props)
    this.state = {
      number:0
    }
    console.log('1-constructor',props)
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
      <h1>props:{this.props.name}</h1>
      <button onClick={this.handleClick}>+</button>
    </div>)
  }
  componentDidMount(){
    console.log('4-componentWillMount')
  }
  componentWillUpdate(){
    console.log('5-componentWillUpdate')
  }
  componentDidUpdate(){
    console.log('6-componentDidUpdate')
  }
}
ReactDOM.render(
  <Counter></Counter>,
  document.getElementById('root')
);



