import React from './react';
import ReactDOM from './react-dom';
function App(){
  let divRef = React.useRef()
  let style = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: 'red',
  }
  //如果此处用的是React.useEffect就可以看到小球的变化过程
  React.useLayoutEffect(() =>{
    divRef.current.style.transform = `translate(500px)`
    divRef.current.style.transition = 'all 500ms'
  },[])
  return(<>
    <div style={style} ref={divRef}></div>
  </>)
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
