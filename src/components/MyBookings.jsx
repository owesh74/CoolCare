import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

const MyBookings = () => {
    const { isLoggedIn, isLoading } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!isLoading && isLoggedIn) {
            const fetchBookings = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('http://localhost:5000/bookings/my', {
                        headers: { 'x-auth-token': token }
                    });
                    setBookings(response.data);
                } catch (error) {
                    setMessage(error.response?.data?.message || 'Failed to fetch bookings.');
                }
            };
            fetchBookings();
        }
    }, [isLoading, isLoggedIn]);

    if (isLoading) return <div className="text-center text-xl text-gray-600">Loading...</div>;
    if (!isLoggedIn) return <div className="text-center text-xl text-red-600">Please log in to view your bookings.</div>;

    return (
        <div className="py-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Your Bookings</h1>
            {message && <p className="text-red-600 text-center mb-4">{message}</p>}
            {bookings.length === 0 ? (
                <div className="text-center text-gray-500">
                    <p>You have no bookings yet. </p>
                    <Link to="/services" className="mt-4 inline-block text-blue-600 hover:underline">Book a service now</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-gray-800">Service: {booking.serviceId?.name || 'N/A'}</h3>
                            <p className="text-gray-600">Status: <span className={`font-semibold ${booking.status === 'Completed' ? 'text-green-600' : booking.status === 'Pending' ? 'text-yellow-600' : 'text-blue-600'}`}>{booking.status}</span></p>
                            <p className="text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
                            <p className="text-gray-600">Time: {booking.time}</p>
                            <p className="text-gray-600">Address: {booking.address}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
