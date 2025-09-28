import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // navigate imported here

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP, 3: Set New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate(); // Hook initialized here

    const API_URL = process.env.REACT_APP_API_URL + "/auth";

    // --- Step 1: Send OTP ---
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSuccess(false);

        try {
            const response = await axios.post(`${API_URL}/send-reset-otp`, { email });
            setMessage(response.data.msg);
            setIsSuccess(true);
            setStep(2); // Move to OTP verification
        } catch (error) {
            setMessage(error.response?.data?.msg || 'Failed to send OTP.');
            setIsSuccess(false);
        }
    };

    // --- Step 2: Verify OTP ---
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSuccess(false);

        try {
            const response = await axios.post(`${API_URL}/verify-reset-otp`, { email, otp });
            setMessage(response.data.msg);
            setIsSuccess(true);
            setStep(3); // Move to set new password
        } catch (error) {
            setMessage(error.response?.data?.msg || 'OTP verification failed.');
            setIsSuccess(false);
        }
    };

    // --- Step 3: Update Password ---
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSuccess(false);

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/update-password`, { email, password });
            setMessage(response.data.msg);
            setIsSuccess(true);
            
            // Redirect to login after a short delay
            setTimeout(() => {
                navigate('/auth'); // Using the navigate function
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data?.msg || 'Failed to update password.');
            setIsSuccess(false);
        }
    };
    
    const renderForm = () => {
        switch (step) {
            case 1: // Enter Email
                return (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label className="block text-gray-700">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                            Send Verification Code
                        </button>
                    </form>
                );
            case 2: // Enter OTP
                return (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                         <p className="text-center text-gray-600 mb-4">A 6-digit code has been sent to **{email}**.</p>
                        <div>
                            <label className="block text-gray-700">Verification Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
                                maxLength="6"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                            Verify Code
                        </button>
                         <p className="text-center"><button type="button" onClick={() => setStep(1)} className="text-sm text-blue-600 hover:underline">Resend Code / Change Email</button></p>
                    </form>
                );
            case 3: // Set New Password
                return (
                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        <div>
                            <label className="block text-gray-700">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                            Update Password
                        </button>
                    </form>
                );
            default:
                return null;
        }
    };

    return (
        <div className="py-8 min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify Code' : 'Set New Password'}
                </h1>
                
                {renderForm()}

                {message && <p className={`mt-4 text-center ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
                
                <p className="mt-4 text-center">
                    <Link to="/auth" className="text-blue-600 hover:underline">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;