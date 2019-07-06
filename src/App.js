import React from 'react';
import './styles/style.sass';
import MyMapComponent from './components/map';

function App() {
  return (
    <div className="App">
      <MyMapComponent from="Changampuzha Park" to="Ramakkodam Lane" />
    </div>
  );
}

export default App;
