import React from './react';
import ReactDOM from './react-dom';
const stateContext = React.createContext()
const reducer = (state,action) =>{
  switch (action.type) {
    case 'ADD':
      return {number:state.number+1}
    default:
      return state
  }
}

function Child(){
  const { state, dispatch } = React.useContext(stateContext)
  return (<>
    <h1>{state.number}</h1>
    <button onClick={() => dispatch({type:"ADD"})}>+</button>
  </>)
}

function App(){
  const [ state, dispatch ] = React.useReducer(reducer,{number:1})
  return (<>
    <stateContext.Provider value={{state,dispatch}}>
      <Child></Child>
    </stateContext.Provider>
  </>)
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
