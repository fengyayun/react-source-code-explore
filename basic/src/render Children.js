import React from './react';
import ReactDOM from './react-dom';


class MouseTracker extends React.Component {
  state = {
    x:0,
    y:0
  }
  mouseMove = (event) =>{
    this.setState({
      x:event.clientX,
      y:event.clientY
    })
  }
  render(){
    console.log('this.props',this.props)
    return (<div onMouseMove={this.mouseMove} style={{border:'1px solid red'}}>
      {this.props.children[0](this.state)}
    </div>)
  }
}
ReactDOM.render(
  <MouseTracker >{
    (props) =>(
      <div>
        <h1>移动鼠标</h1>
        <div>当前鼠标的位置{props.x},{props.y}</div>
      </div>
    )
  }</MouseTracker>,
  document.getElementById('root')
);
