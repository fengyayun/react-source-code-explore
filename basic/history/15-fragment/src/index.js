import React from './react';
import ReactDOM from './react-dom';

function App(){
  console.log(<>d</>)
  console.log(<React.Fragment>
    <p>p1</p>
    <p>p2</p>
  </React.Fragment>)
  // type 指向的fragment对象
  /**
   * 1.type:'div' 指向原生标签 <div></div>
   * 2.type:{
      $$typeof: Symbol(Symbol(react.element))
      type: Symbol(Symbol(react.fragment))}
      是用fragment 或 <></>包装的type指向
     3.当是组件时 type: ƒ App()/type: class Child type指向函数组件或者class
     4.forwardRef 包装时 type:{$$typeof: Symbol(Symbol(react.forward_ref))
        render: ƒ TextInput(props, inputRef)}
     5.Consumer 组件包装时:type:{$$typeof: Symbol(Symbol(react.context))
      _context: {$$typeof: Symbol(Symbol(react.context)), _currentValue: {…}, Provider: {…}, Consumer: {…}}
     6.Provider 组件包装时 type:{
      $$typeof: Symbol(Symbol(react.provider))
      _context: {$$typeof: Symbol(Symbol(react.context)), _currentValue: {…}, Provider: {…}, Consumer: {…}}
     }
     7.memo组件包装时type:{
      $$typeof: Symbol(Symbol(react.memo))
      compare: ƒ shallowEqual(obj1, obj2)
      type: ƒ FunctionCounter(props)
      [[Prototype]]: Object
     }


   */
  return (<React.Fragment>
    <p>p1</p>
    <p>p2</p>
  </React.Fragment>)
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
