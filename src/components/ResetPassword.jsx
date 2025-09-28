import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL + "/auth";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setSuccess(false);

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
            setMessage(response.data.msg);
            setSuccess(true);
        } catch (error) {
            setMessage(error.response?.data?.msg || 'Failed to reset password. Token may be invalid or expired.');
        }
    };

    return (
        <div className="py-8 min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Reset Password</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors" disabled={success}>
                        Reset Password
                    </button>
                </form>
                
                {message && <p className={`mt-4 text-center ${success ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
                {success && <p className="mt-2 text-center"><Link to="/auth" className="text-blue-600 hover:underline">Go to Login</Link></p>}
            </div>
        </div>
    );
};

export default ResetPassword;