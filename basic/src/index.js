import React from './react';
import ReactDOM from './react-dom';
let ThemeContext = React.createContext()
console.log('ThemeContext',ThemeContext)
// $$typeof: Symbol(react.context)
// Consumer: {$$typeof: Symbol(react.context), _context: {…}, …}
// Provider: {$$typeof: Symbol(react.provider), _context: {…}}
// _currentRenderer: null
// _currentRenderer2: null
// _currentValue: undefined
// _currentValue2: undefined
// _defaultValue: null
// _globalName: null
// _threadCount: 0
const { Consumer, Provider } = ThemeContext
const style = { padding:'10px',margin:'10px'}
function Title(props){
  console.log('Title');
  return (<Consumer>
    {(contentValue) =>(<div style={{ ...style,border:`5px solid ${contentValue.color}`}}>
      Title
    </div>)}
  </Consumer>)

}
class Header extends React.Component {
  static contextType = ThemeContext
  render() {
    console.log('Header');
    return (
      <div style={{ ...style, border: `5px solid ${this.context.color}` }}>
        Header
        <Title />
      </div>
    )
  }
}
class Main extends React.Component {
  static contextType = ThemeContext
  render(){
    console.log('Main')
    return (
      <div style={{...style,border: `5px solid ${this.context.color}`}}>
        Main
        <Content></Content>
      </div>
    )
  }
}
function Content() {
  console.log('Content')
  return (
    <Consumer>
      {
        (contentValue) =>(
          <div style={{ ...style,border:`5px solid ${contentValue.color}`}}>
            Content
            <button style={{ color:'red'}} onClick={ () => contentValue.changeColor('red') }>红色</button>
            <button style={{ color:'green'}} onClick={ () => contentValue.changeColor('green')}>变绿</button>
          </div>
        )
      }
    </Consumer>
  )
}
class Page extends React.Component {
  constructor(props){
    super(props)
    this.state = { color: 'black'}
  }
  changeColor = (color) =>{
    this.setState({color})
  }
  render(){
    console.log('Page')
    let contentValue = { color:this.state.color,changeColor:this.changeColor}
    return (
      <Provider value={contentValue}>
        <div style={{ ...style,border:`5px solid ${this.state.color}`}}>
          Page
          <Header />
          <Main />
        </div>
      </Provider>
    )
  }
}
ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
