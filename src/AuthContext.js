import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const API_URL = "http://localhost:5000";

    const checkAuthStatus = async (token) => {
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/auth/me`, {
                headers: { 'x-auth-token': token }
            });
            setUser(response.data.user);
            setIsLoggedIn(true);
            if (response.data.user.role === 'admin') {
                setIsAdmin(true);
            }
        } catch (error) {
            console.error('User token invalid:', error);
            localStorage.removeItem('token');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        checkAuthStatus(token);
    }, []);

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        setIsLoggedIn(true);
        if (res.data.user.role === 'admin') {
            setIsAdmin(true);
            navigate('/admin');
        } else {
            setIsAdmin(false);
            navigate('/dashboard');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate('/');
    };

    const value = { user, isLoggedIn, isAdmin, isLoading, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};