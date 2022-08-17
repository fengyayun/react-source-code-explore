import React from './react';
import ReactDOM from './react-dom';


function App(){
  const [number,setNumber] = React.useState(0)
  const handleClick = () =>{
    setNumber(number+1)
    console.log(number)
  }
  return (<>
    <p>{number}</p>
    <button onClick={handleClick}>+</button>
  </>)
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
