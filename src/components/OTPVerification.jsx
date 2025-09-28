import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OTPVerification = () => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    // Define API_URL here
    const API_URL = process.env.REACT_APP_API_URL + "/auth";

    const handleVerification = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            // Updated API call
            const res = await axios.post(`${API_URL}/verify-otp`, { email, otp });
            setMessage(res.data.msg);
            setTimeout(() => navigate('/auth'), 2000);
        } catch (err) {
            setMessage(err.response?.data?.msg || 'An error occurred.');
        }
    };

    if (!email) {
        return <div className="text-center text-red-500">No email provided. Please go back to the signup page.</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">OTP Verification</h1>
                <p className="text-center text-gray-600 mb-4">Enter the OTP sent to **{email}**</p>
                <form onSubmit={handleVerification} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                        Verify OTP
                    </button>
                </form>
                {message && <p className="text-center mt-4 text-red-500">{message}</p>}
            </div>
        </div>
    );
};

export default OTPVerification;