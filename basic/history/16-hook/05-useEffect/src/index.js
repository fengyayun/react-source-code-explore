import React from 'react';
import ReactDOM from 'react-dom';
function Counter(){
  const [number, setNumber] = React.useState(0)
  React.useEffect(() =>{
    console.log('开启定时器');
    let timer = setInterval(() => {
      console.log('setNumber');
      setNumber(number + 1)
    }, 1000);
    return () =>{
      console.log('关闭定时器');
      clearInterval(timer)
    }
  },[ number ])
  return (<>
    <div>{ number }</div>
  </>)
}

ReactDOM.render(
  <Counter />,
  document.getElementById('root')
);
