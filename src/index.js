import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Home from './pages/home'
import Login from './pages/login';
import Profile from './pages/profile';
import Edit from './pages/edit';
import Inbox from './pages/inbox';
import View404 from './pages/404';


ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/" element={<Home/>}/>
      <Route path="/:username" element={<Profile/>}/>
      <Route path="/:username/saved" element={<div>guardados</div>}/>
      <Route path="/edit" element={<Edit/>}/>
      <Route path="/inbox" element={<Inbox/>}/>
      <Route path="/inbox/:username" element={<Inbox/>}/>
      <Route path="/accounts" element={<Inbox/>}/>
      <Route path="*" element={<View404/>}/>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
