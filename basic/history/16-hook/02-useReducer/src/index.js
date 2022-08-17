import React from './react';
import ReactDOM from './react-dom';


function init(initialCount){
  return {
    count:initialCount
  }
}
function reducer(state,action){
  switch (action.type) {
    case 'ADD':
      return {count:state.count+1}
    case 'MINUS':
      return {count:state.count-1}
    default:
      break;
  }
}
function Counter(){
  const [state,dispatch] = React.useReducer(reducer,0,init)
  return (<>
    <p>number:{state.count}</p>
    <button onClick={() => dispatch({type:"ADD"})}>+</button>
    <button onClick={() => dispatch({type:"MINUS"})}>-</button>
  </>)
}

// let initialState = {
//   count:0
// }
// function reducer(state,action){
//   switch (action.type) {
//     case 'ADD':
//       return {count:state.count+1}
//     case 'MINUS':
//       return {count:state.count-1}
//     default:
//       break;
//   }
// }
// function Counter(){
//   const [state,dispatch] = React.useReducer(reducer,initialState)
//   return (<>
//     <p>number:{state.count}</p>
//     <button onClick={() => dispatch({type:"ADD"})}>+</button>
//     <button onClick={() => dispatch({type:"MINUS"})}>-</button>
//   </>)
// }

ReactDOM.render(
  <Counter />,
  document.getElementById('root')
);
