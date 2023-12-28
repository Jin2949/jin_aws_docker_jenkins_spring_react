import { Routes, Route, Link } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home'
import SignUp from './pages/SignUp';
import List from './pages/List';

export default function App() {
  
  return (
    <div className="App">
      <nav>
        <Link to="/">Home</Link> | <Link to="/signup">SignUp</Link>
        | <Link to="/list">List</Link>
      </nav>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/list' element={<List/>} />
      </Routes>
    </div>
  );
}