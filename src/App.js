import React from 'react';
import './styles/style.sass';
import MyMapComponent from './components/map';

function App() {
  return (
    <div className="App">
      <MyMapComponent from="palarivattom" to="dream flower lyra" waypoint="changampuzha park" />
    </div>
  );
}

export default App;
