import React from 'react';
import ReactDOM from 'react-dom';
const withLoading = message => OldComponent => {
  return class extends React.Component {
    render() {
      const state = {
        show() {
          let div = document.createElement('div');
          div.id = 'loadingDiv';
          div.innerHTML = `<p style="position:absolute;top:100px;z-index:10;background-color:gray">${message}</p>`;
          document.body.appendChild(div);
        },
        hide() {
          document.getElementById('loadingDiv').remove();
        }
      }
      return <OldComponent {...this.props} {...state} />
    }
  }
}
class App extends React.Component {
  render() {
    return (
      <div>
        <p>App</p>
        <button onClick={this.props.show}>show</button>
        <button onClick={this.props.hide}>hide</button>
      </div>
    )
  }
}
const WithLoadingApp = withLoading('加载中......')(App);

ReactDOM.render(
  <WithLoadingApp />,
  document.getElementById('root')
);
