import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import NewPage from './NewPage';
import Main from './Main';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/new' element={<NewPage />} />



      </Routes>
    </>
  );
}

export default App;
