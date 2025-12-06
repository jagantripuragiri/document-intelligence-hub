import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import './index.css'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard'; 
import Chat from './pages/Chat'; 

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    
    // While loading auth state, maybe show a spinner
    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    
    return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                <Route path="/chat" element={
                    <PrivateRoute>
                        <Chat />
                    </PrivateRoute>
                } />
            </Routes>
        </AuthProvider>
    </Router>
  );
}

export default App;
