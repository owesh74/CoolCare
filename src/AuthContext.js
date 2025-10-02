import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);
const API_URL = process.env.REACT_APP_API_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const checkAuthStatus = (token) => {
        const userEmail = localStorage.getItem('userEmail'); // Get the stored email
        
        if (!token) {
            setIsLoading(false);
            return;
        }

        // Since the only logged-in user is the Admin, we set the state based on the presence of the token and email.
        if (token && userEmail) {
            // We set the user object with the known admin role for ProtectedRoutes
            setUser({ email: userEmail, role: 'admin' }); 
            setIsLoggedIn(true);
            setIsAdmin(true);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        checkAuthStatus(token);
    }, []);

    // NOTE: login function is kept as a placeholder but is not used by AdminLogin.jsx anymore.

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail'); // Clear the stored email
        setUser(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate('/');
    };

    const value = { user, isLoggedIn, isAdmin, isLoading, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};