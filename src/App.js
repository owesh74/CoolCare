import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Home from './components/Home.jsx';
import Admin from './components/Admin.jsx';
import AdminLogin from './components/AdminLogin.jsx'; 
import Services from './components/services/Services.jsx';
// REMOVED: import ForgotPassword from './components/ForgotPassword.jsx';

// ProtectedRoute component to guard routes
const ProtectedRoute = ({ children, roles = ['user', 'admin'] }) => {
    const { isLoggedIn, user, isLoading } = useAuth();
    
    if (isLoading) {
        return <div className="text-center text-xl text-gray-600">Loading...</div>;
    }
    
    // Only allow access if user is logged in AND is an admin
    if (!isLoggedIn || user.role !== 'admin') {
        // If not logged in, redirect to login page
        return <Navigate to="/admin-login" replace />; 
    }
    
    return children;
};

// Navbar component for navigation
const Navbar = () => {
    const { isLoggedIn, isAdmin, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false); 

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const NavLink = ({ to, children, isButton = false, onClick }) => (
        <Link 
            to={to} 
            onClick={onClick ? onClick : () => setIsOpen(false)} // Close menu on link click
            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition-colors ${isButton ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-300 hover:text-white'}`}
        >
            {children}
        </Link>
    );

    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto">
                <div className="flex items-center justify-between">
                    {/* Logo/Brand */}
                    <Link to="/" className="text-2xl font-bold" onClick={() => setIsOpen(false)}>CoolCare</Link>

                    {/* Mobile Menu Button (Hamburger) */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <svg className={`h-6 w-6 ${isOpen ? 'hidden' : 'block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg className={`h-6 w-6 ${isOpen ? 'block' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Desktop Menu Links */}
                    <div className="hidden md:flex space-x-4 items-center">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/services">Book Service</NavLink> {/* Always show booking link */}
                        {isLoggedIn && isAdmin ? (
                            <>
                                <NavLink to="/admin">Dashboard</NavLink>
                                <button onClick={logout} className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">Logout</button>
                            </>
                        ) : (
                            <></> // Admin Login button removed for stealth
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Collapsible) */}
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700 mt-2">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/services">Book Service</NavLink> {/* Always show booking link */}
                    {isLoggedIn && isAdmin ? (
                        <>
                            <NavLink to="/admin">Dashboard</NavLink>
                            <button onClick={logout} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700 transition-colors mt-1">Logout</button>
                        </>
                    ) : (
                        <></> // Admin Login button removed for stealth
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
                        <Route path="/services" element={<Services />} /> 
                        <Route path="/admin-login" element={<AdminLogin />} /> 

                        {/* REMOVED: <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} /> */}

                        {/* Admin Protected Route */}
                        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />

                        {/* Fallback route */}
                        <Route path="*" element={<h1 className="text-center text-4xl text-red-600 font-bold">404: Page Not Found</h1>} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;