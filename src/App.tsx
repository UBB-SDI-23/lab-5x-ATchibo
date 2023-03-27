import React from 'react';
import logo from './logo.svg';
import './App.css';

import Header from './components/Header';
import Teste from './components/Teste';
import MainSection from './components/MainSection';

function App() {

  return (
    <div className="App">
        <Header/>
        <MainSection/>
        <Teste/>
    </div>
  );
}

export default App;
