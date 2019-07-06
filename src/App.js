import React from 'react';
import './styles/style.sass';
import MyMapComponent from './components/map';

function App() {
  return (
    <div className="App">
      <MyMapComponent from="changampuzha park" to="dream flower lyra" />
    </div>
  );
}

export default App;
