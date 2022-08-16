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
    return (<div onMouseMove={this.mouseMove} style={{border:'1px solid red'}}>
      <div>
        <h1>移动鼠标</h1>
        <div>当前鼠标的位置{this.state.x},{this.state.y}</div>
      </div>
    </div>)
  }
}
ReactDOM.render(
  <MouseTracker></MouseTracker>,
  document.getElementById('root')
);
