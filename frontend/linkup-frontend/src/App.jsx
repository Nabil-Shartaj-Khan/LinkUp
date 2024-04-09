import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome/Welcome';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import NotFound from './NotFound';
import Navbar from './components/Navbar/Navbar';
import Homepage from './components/HomePage/Homepage';
import Profile from './components/Profile/Profile';
import Message from './components/Message/Message';
import Friends from './components/Friends/Friends';
import Create from './components/CreatePost/Create';
import Notification from './components/Notification/Notification';
import Warning from './Warning';
import Maybe from './components/Friends/Maybe';

const App = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="fs-3 text-center my-5">Please wait while redirecting....</div>;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {token && (
          <>
            <Route path="/home" element={<Homepage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Message />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/maybe_friends" element={<Maybe />} />
            <Route path="/create-post" element={<Create />} />
            <Route path="/notifications" element={<Notification />} />
          </>
        )}

        {!token && (
          <>
            <Route path="/home" element={<Warning />} />
            <Route path="/profile" element={<Warning />} />
            <Route path="/messages" element={<Warning />} />
            <Route path="/friends" element={<Warning />} />
            <Route path="/create-post" element={<Warning />} />
            <Route path="/notifications" element={<Warning />} />
          </>
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
