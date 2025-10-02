import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); 

    // New Endpoint for Password-Only Login
    const API_URL = process.env.REACT_APP_API_URL + "/auth/admin-pass-login";

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setMessage('');

        try {
            const response = await axios.post(API_URL, { password });
            
            // 1. Manually set the token in local storage
            localStorage.setItem('token', response.data.token);

            // *** IMPORTANT FIX: Store the admin's email for AuthContext to use ***
            localStorage.setItem('userEmail', response.data.user.email);
            
            setMessage('Login successful!');

            // 2. Force a full page reload and redirect to the protected admin route.
            window.location.href = '/admin'; // Triggers AuthContext check
            
        } catch (error) {
            const errorMessage = error.response?.data?.msg || 'Invalid Password. Please check.';
            setMessage(errorMessage);
            setPassword(''); 
        }
    };

    return (
        <div className="py-8 min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Admin Login</h1>
                <p className="text-center text-gray-600 mb-6">Enter the Admin Password to continue.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                        Login
                    </button>
                </form>
                {message && <p className={`mt-4 text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
            </div>
        </div>
    );
};

export default AdminLogin;