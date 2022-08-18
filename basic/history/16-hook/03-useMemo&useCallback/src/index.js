import React from './react';
import ReactDOM from './react-dom';
function Child({ data, handleClick }) {
  console.log('Child render');
  return (
    <button onClick={handleClick}>{data.number}</button>
  )
}
const MemoChild = React.memo(Child);
function App() {
  const [name, setName] = React.useState('zhufeng'); // 0
  const [number, setNumber] = React.useState(0); // 1
  let data = React.useMemo(() => ({ number }), [number]);// 2
  let handleClick = React.useCallback(() => setNumber(number + 1), [number]);//3
  return (
    <div>
      <input type="text" value={name} onChange={event => setName(event.target.value)} />
      <MemoChild data={data} handleClick={handleClick} />
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
