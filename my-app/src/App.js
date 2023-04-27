import React, { useState } from 'react';
import './App.css';
import MainGame from './Components/MainGame';
import { SocketProvider } from './Components/SocketProvider';

function App() {

  return (
    <SocketProvider>
      <div className="App">
        <MainGame />
      </div>
    </SocketProvider>
  );
}

export default App;
