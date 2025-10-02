import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

const Services = () => {
    const { isLoggedIn, isLoading } = useAuth();
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [message, setMessage] = useState('');
    // ADDED name to bookingData state
    const [bookingData, setBookingData] = useState({ name: '', date: '', time: '', address: '', contactNumber: '' });
    const [selectedService, setSelectedService] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const workingHours = [
        '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
    ];

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://localhost:5000/services');
                setServices(response.data);
            } catch (error) {
                setMessage(error.response?.data?.message || 'Failed to fetch services.');
            }
        };
        fetchServices();
    }, []);

    const fetchAvailableSlots = async (serviceId, date) => {
        try {
            const response = await axios.get(`http://localhost:5000/bookings/available-slots?serviceId=${serviceId}&date=${date}`);
            const bookedTimes = response.data.bookedTimes;
            const available = workingHours.filter(slot => !bookedTimes.includes(slot));
            setAvailableSlots(available);
            if (!available.length) {
                setMessage('No slots available for this date. Please choose another date.');
            }
        } catch (error) {
            setMessage('Failed to fetch available slots.');
        }
    };

    const handleBookingChange = (e) => {
        const { name, value } = e.target;
        setBookingData({ ...bookingData, [name]: value });

        if (name === 'date' && selectedService) {
            fetchAvailableSlots(selectedService._id, value);
        }
    };

    const handleBookService = async (e) => {
        e.preventDefault();
        setMessage('');

        // 2. Check if a service is selected
        if (!selectedService) {
            setMessage('Please select a service.');
            setShowModal(true);
            setIsSuccess(false);
            return;
        }

        // 3. Validate booking data on the frontend
        const currentDate = new Date();
        const selectedDate = new Date(bookingData.date);
        const contactNumber = bookingData.contactNumber;

        if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
            setMessage('You cannot book a service for a past date.');
            setIsSuccess(false);
            setShowModal(true);
            return;
        }

        if (!/^\d{10}$/.test(contactNumber)) {
            setMessage('Please enter a valid 10-digit contact number.');
            setIsSuccess(false);
            setShowModal(true);
            return;
        }

        if (bookingData.time === '') {
            setMessage('Please select a time slot.');
            setIsSuccess(false);
            setShowModal(true);
            return;
        }
        
        try {
            const payload = {
                ...bookingData,
                serviceId: selectedService._id,
            };
            
            await axios.post('http://localhost:5000/bookings', payload);

            // UPDATED SUCCESS MESSAGE
            setMessage('Booking confirmed! You will get a call from our technician soon to confirm service details.');
            setIsSuccess(true);
            setShowModal(true);
            
            setTimeout(() => {
                setShowModal(false);
                navigate('/');
            }, 3000); // Increased timeout for reading message

            setSelectedService(null);
            setBookingData({ name: '', date: '', time: '', address: '', contactNumber: '' });
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to book service. Please try again.');
            setIsSuccess(false);
            setShowModal(true);
        }
    };
    
    const closeModal = () => {
        setShowModal(false);
        setMessage('');
    };

    if (isLoading) return <div className="text-center text-xl text-gray-600">Loading...</div>;

    return (
        <div className="py-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Our Services</h1>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className={`p-8 rounded-lg shadow-lg w-full max-w-sm text-center ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        <h3 className="text-2xl font-bold mb-4">{isSuccess ? 'Success!' : 'Error!'}</h3>
                        <p className="mb-6">{message}</p>
                        <button
                            onClick={closeModal}
                            className={`px-6 py-2 rounded-lg font-semibold ${isSuccess ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.length === 0 ? (
                    <p className="col-span-3 text-center text-gray-500">No services available at the moment.</p>
                ) : (
                    services.map((service) => (
                        <div key={service._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800">{service.name}</h2>
                                <p className="mt-2 text-gray-600">{service.description}</p>
                                <p className="mt-2 text-lg font-bold text-gray-800">
                                    ₹{service.price} <span className="text-sm font-normal text-gray-500">({service.duration} mins)</span>
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedService(service);
                                    if (bookingData.date) {
                                        fetchAvailableSlots(service._id, bookingData.date);
                                    }
                                }}
                                className={`mt-4 px-4 py-2 rounded-lg transition-colors ${selectedService?._id === service._id ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            >
                                {selectedService?._id === service._id ? 'Selected' : 'Book Now'}
                            </button>
                        </div>
                    ))
                )}
            </div>

            {selectedService && (
                <div className="mt-12 p-8 bg-white rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Book {selectedService.name}</h2>
                    <form onSubmit={handleBookService} className="space-y-6">
                        {/* NEW NAME FIELD */}
                        <div>
                            <label className="block text-gray-700">Full Name</label>
                            <input type="text" name="name" value={bookingData.name} onChange={handleBookingChange} className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" required />
                        </div>
                        {/* END NEW NAME FIELD */}
                        
                        <div>
                            <label className="block text-gray-700">Date</label>
                            <input type="date" name="date" value={bookingData.date} onChange={handleBookingChange} className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" required />
                        </div>
                        <div>
                            <label className="block text-gray-700">Time</label>
                            <select
                                name="time"
                                value={bookingData.time}
                                onChange={handleBookingChange}
                                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                disabled={!bookingData.date}
                                required
                            >
                                <option value="">Select a time slot</option>
                                {availableSlots.map(slot => (
                                    <option key={slot} value={slot}>{slot}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700">Address</label>
                            <input type="text" name="address" value={bookingData.address} onChange={handleBookingChange} className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" required />
                        </div>
                        <div>
                            <label className="block text-gray-700">Contact Number</label>
                            <input type="tel" name="contactNumber" value={bookingData.contactNumber} onChange={handleBookingChange} className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" required />
                        </div>
                        <button type="submit" className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                            Confirm Booking
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Services;