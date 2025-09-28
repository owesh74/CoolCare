import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    
    // Define API_URL here
    const API_URL = process.env.REACT_APP_API_URL + "/auth";

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            if (isLogin) {
                // Login uses the context, which is already updated
                await login(formData.email, formData.password);
                setMessage('Login successful!');
            } else {
                // Updated API call for signup
                const response = await axios.post(`${API_URL}/signup`, formData);
                setMessage(response.data.msg || response.data.message);
                navigate('/verify-otp', { state: { email: formData.email } });
            }
        } catch (error) {
            setMessage(error.response?.data?.msg || error.response?.data?.message || 'Authentication failed.');
        }
    };

    return (
        <div className="py-8 min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
                    {isLogin ? 'Login' : 'Signup'}
                </h1>
                {message && <p className={`text-center mb-4 ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
                <form onSubmit={handleAuthSubmit} className="space-y-6">
                    {!isLogin && (
                        <div>
                            <label className="block text-gray-700">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" required />
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleFormChange} className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" required />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleFormChange} className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" required />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                        {isLogin ? 'Login' : 'Signup'}
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:underline ml-1">
                        {isLogin ? 'Signup' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;