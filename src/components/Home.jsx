import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="text-center py-20">
            <h1 className="text-5xl font-extrabold text-gray-900">Your Premier AC Service Provider</h1>
            <p className="mt-4 text-xl text-gray-600">
                Book professional AC services like installation, repair, and servicing with ease.
            </p>
            <Link to="/auth" className="mt-8 inline-block px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
                Get Started
            </Link>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800">Quick & Easy Booking</h2>
                    <p className="mt-2 text-gray-600">
                        Book your service in just a few clicks. Choose your service, date, and time.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800">Certified Technicians</h2>
                    <p className="mt-2 text-gray-600">
                        All our technicians are certified and experienced to provide the best service.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800">Transparent Pricing</h2>
                    <p className="mt-2 text-gray-600">
                        No hidden costs. You'll know the price upfront before confirming your booking.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;
