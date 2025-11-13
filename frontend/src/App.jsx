import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VideoChat from './components/VideoChat';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import {Profile} from './pages/Profile'
export default function App() {
  return (
    <Routes>
      <Route path="/video" element={<VideoChat />} />
      <Route path="/login" element={<Login />} />
     <Route path="/" element={<Home/>} />
    <Route path ="/profile" element={<Profile/>}/>
    </Routes>
  );
}
