import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const Admin = () => {
    const { isAdmin, isLoggedIn, isLoading } = useAuth();
    const [allBookings, setAllBookings] = useState([]); // Stores all fetched bookings
    const [services, setServices] = useState([]);
    const [activeTab, setActiveTab] = useState('bookings');
    const [newService, setNewService] = useState({ name: '', description: '', price: '', duration: '' });
    const [message, setMessage] = useState('');
    const [statusFilter, setStatusFilter] = useState('All'); // NEW: State for filtering

    useEffect(() => {
        if (!isLoading && isAdmin) {
            fetchBookings();
            fetchServices();
        }
    }, [isLoading, isAdmin]);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/admin/bookings', {
                headers: { 'x-auth-token': token }
            });
            setAllBookings(response.data); // Store all bookings
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to fetch bookings.');
        }
    };

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/admin/services', {
                headers: { 'x-auth-token': token }
            });
            setServices(response.data);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to fetch services.');
        }
    };

    const handleServiceChange = (e) => {
        setNewService({ ...newService, [e.target.name]: e.target.value });
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/admin/services', newService, {
                headers: { 'x-auth-token': token }
            });
            setMessage('Service added successfully!');
            fetchServices();
            setNewService({ name: '', description: '', price: '', duration: '' });
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to add service.');
        }
    };

    const handleDeleteService = async (serviceId) => {
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/admin/services/${serviceId}`, {
                headers: { 'x-auth-token': token }
            });
            setMessage('Service deleted successfully!');
            fetchServices();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to delete service.');
        }
    };

    const handleUpdateStatus = async (bookingId, newStatus) => {
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/admin/bookings/${bookingId}/status`, { status: newStatus }, {
                headers: { 'x-auth-token': token }
            });
            setMessage('Booking status updated successfully!');
            fetchBookings(); // Re-fetch to update the list
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to update booking status.');
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) {
            return;
        }
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/admin/bookings/${bookingId}`, {
                headers: { 'x-auth-token': token }
            });
            setMessage('Booking deleted successfully!');
            fetchBookings(); // Re-fetch to update the list
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to delete booking.');
        }
    };
    
    // NEW: Filtered bookings list derived from allBookings
    const filteredBookings = allBookings.filter(booking => 
        statusFilter === 'All' || booking.status === statusFilter
    );


    if (isLoading) return <div className="text-center text-xl text-gray-600">Loading...</div>;
    if (!isLoggedIn || !isAdmin) return <div className="text-center text-xl text-red-600">Access Denied.</div>;

    return (
        <div className="py-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            <div className="mb-4 border-b border-gray-200">
                <nav className="flex space-x-4">
                    <button
                        className={`py-2 px-4 font-semibold ${activeTab === 'bookings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        Manage Bookings
                    </button>
                    <button
                        className={`py-2 px-4 font-semibold ${activeTab === 'services' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                        onClick={() => setActiveTab('services')}
                    >
                        Manage Services
                    </button>
                </nav>
            </div>

            {message && <p className="text-center mb-4 text-green-600">{message}</p>}

            {activeTab === 'bookings' && (
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">All Bookings</h2>
                    
                    {/* NEW: Status Filter Dropdown */}
                    <div className="mb-6 flex items-center space-x-3">
                        <label className="font-medium text-gray-700">Filter by Status:</label>
                        <select
                            className="border border-gray-300 rounded-lg p-2"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Assigned">Assigned</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    {/* END NEW FILTER */}

                    {filteredBookings.length === 0 ? (
                        <p className="text-gray-500">No {statusFilter !== 'All' && statusFilter} bookings found.</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredBookings.map((booking) => (
                                <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md">
                                    <h3 className="text-xl font-bold text-gray-800">Service: {booking.serviceId?.name || 'N/A'}</h3>
                                    
                                    {/* FIX: Show Customer Name and remove redundant email/user fields */}
                                    <p className="text-gray-600">Customer Name: <span className="font-semibold">{booking.customerName || 'N/A'}</span></p> 
                                    <p className="text-gray-600">Contact Number: {booking.contactNumber}</p>
                                    
                                    <p className="text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
                                    <p className="text-gray-600">Address: {booking.address}</p>
                                    
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <label className="text-gray-700 font-semibold">Status:</label>
                                            <select
                                                className="border border-gray-300 rounded-lg p-2"
                                                value={booking.status}
                                                onChange={(e) => handleUpdateStatus(booking._id, e.target.value)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Assigned">Assigned</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteBooking(booking._id)}
                                            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'services' && (
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Service</h2>
                    <form onSubmit={handleAddService} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <div>
                            <label className="block text-gray-700">Service Name</label>
                            <input type="text" name="name" value={newService.name} onChange={handleServiceChange} className="w-full px-4 py-2 mt-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-gray-700">Description</label>
                            <textarea name="description" value={newService.description} onChange={handleServiceChange} className="w-full px-4 py-2 mt-2 border rounded-lg" required></textarea>
                        </div>
                        <div>
                            <label className="block text-gray-700">Price</label>
                            <input type="number" name="price" value={newService.price} onChange={handleServiceChange} className="w-full px-4 py-2 mt-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-gray-700">Duration (minutes)</label>
                            <input type="number" name="duration" value={newService.duration} onChange={handleServiceChange} className="w-full px-4 py-2 mt-2 border rounded-lg" required />
                        </div>
                        <button type="submit" className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                            Add Service
                        </button>
                    </form>

                    <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">Existing Services</h2>
                    {services.length === 0 ? (
                        <p className="text-gray-500">No services found.</p>
                    ) : (
                        <div className="space-y-4">
                            {services.map((service) => (
                                <div key={service._id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
                                        <p className="text-gray-600">{service.description}</p>
                                        <p className="text-gray-600">Price: ₹{service.price} - Duration: {service.duration} mins</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteService(service._id)}
                                        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Admin;