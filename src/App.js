import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Home from './components/Home.jsx';
import Auth from './components/Auth.jsx';
import OTPVerification from './components/OTPVerification.jsx';
import Dashboard from './components/Dashboard.jsx';
import Admin from './components/Admin.jsx';
import Services from './components/services/Services.jsx';
import MyBookings from './components/MyBookings.jsx';

// ProtectedRoute component to guard routes
const ProtectedRoute = ({ children, roles = ['user', 'admin'] }) => {
    const { isLoggedIn, user, isLoading } = useAuth();
    
    if (isLoading) {
        return <div className="text-center text-xl text-gray-600">Loading...</div>;
    }
    
    if (!isLoggedIn || (user && !roles.includes(user.role))) {
        return <div className="text-center text-xl text-red-600">You do not have access to this page.</div>;
    }
    
    return children;
};

// PublicRoute to redirect logged-in users from auth pages
const PublicRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();
    if (isLoggedIn) {
        return <Navigate to="/dashboard" />;
    }
    return children;
};

// Navbar component for navigation
const Navbar = () => {
    const { isLoggedIn, isAdmin, logout } = useAuth();

    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">CoolCare</Link>
                <div className="space-x-4 flex items-center">
                    <Link to="/" className="hover:text-gray-300">Home</Link>
                    <Link to="/services" className="hover:text-gray-300">Services</Link>
                    {isLoggedIn ? (
                        <>
                            <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                            {isAdmin && <Link to="/admin" className="hover:text-gray-300">Admin</Link>}
                            <button onClick={logout} className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">Logout</button>
                        </>
                    ) : (
                        <Link to="/auth" className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Login/Signup</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <div className="container mx-auto p-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
                        <Route path="/verify-otp" element={<PublicRoute><OTPVerification /></PublicRoute>} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
                        <Route path="*" element={<h1 className="text-center text-4xl text-red-600 font-bold">404: Page Not Found</h1>} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;