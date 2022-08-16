import React from './react';
import ReactDOM from './react-dom';

class button extends React.Component {
  state = {
    name:'按钮'
  }
  componentWillMount(){
    console.log('componentWillMount')
  }
  componentDidMount(){
    console.log('componentDidMount')
  }
  render(){
    return (<div>
      <button name={this.state.name} title={this.props.title}>按钮</button>
    </div>)
  }
}

const enhancer = oldComponent =>{
  return class extends oldComponent {
    state = {
      number:1
    }
    componentWillMount(){
      console.log('enhancer-componentWillMount')
      super.componentWillMount()
    }
    componentDidMount(){
      console.log('enhancer-componentDidMount')
      super.componentDidMount()
    }
    handleClick = () =>{
      this.setState({
        number:this.state.number + 1
      })
    }
    render(){
      const renderDom = super.render()
      let newProps = {
        ...this.state,
        ...renderDom.props,
        onClick:this.handleClick
      }
      return React.cloneElement(renderDom,newProps,this.state.number,this.state.number)
    }
  }
}
let EnhancerButton = enhancer(button)

ReactDOM.render(
  <EnhancerButton title="测试" />,
  document.getElementById('root')
);
