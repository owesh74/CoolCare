import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    // State for the persistent pop-up when clicking the fixed button
    const [showFixedToaster, setShowFixedToaster] = useState(false);
    
    // NOTE: Replace this with your actual phone number
    const CONTACT_NUMBER = "7620437704"; 

    const handleCall = () => {
        // Redirects to the phone dialer application
        window.location.href = `tel:${CONTACT_NUMBER}`;
    };

    return (
        <div className="py-8 bg-gray-100 min-h-screen relative">
            {/* Main Content */}
            <div className="flex flex-col items-center justify-center text-center p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                        CoolCare: Your Ultimate AC Service Partner
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-600">
                        Experience seamless AC service booking, from installation to repair, with our reliable and efficient platform.
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <Link to="/services" className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                            Book Online
                        </Link>
                        {/* Main Hero Button - Styled to look like the image */}
                        <button
                            onClick={handleCall}
                            className="px-8 py-4 text-lg font-semibold text-green-600 bg-white border border-green-600 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                        >
                            Call Us Now
                        </button>
                    </div>
                </div>
                <div className="mt-20 w-full">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                            <h3 className="text-xl font-semibold text-gray-800">Professional Technicians</h3>
                            <p className="mt-2 text-gray-600">Our certified experts ensure top-notch service every time.</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                            <h3 className="text-xl font-semibold text-gray-800">Transparent Pricing</h3>
                            <p className="mt-2 text-gray-600">No hidden fees. What you see is what you pay.</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                            <h3 className="text-xl font-semibold text-gray-800">24/7 Support</h3>
                            <p className="mt-2 text-gray-600">We're always here to help with your queries and concerns.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Call Button (FAB) */}
            <button
                onClick={() => setShowFixedToaster(true)}
                className="fixed bottom-6 right-6 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110 z-40"
            >
                {/* Phone Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.137a11.042 11.042 0 005.516 5.516l1.137-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            </button>

            {/* Styled Toaster Pop-up (Matches Image) */}
            {showFixedToaster && (
                <div className="fixed bottom-20 right-6 bg-white rounded-xl shadow-2xl w-72 z-50 transform transition-transform duration-300">
                    {/* Header/Title Area */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-100">
                        <div className="flex items-center text-pink-600 font-semibold"> 
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                {/* CORRECTED PATH TAGS HERE */}
                                <path fillRule="evenodd" d="M14.414 7l-5.586-5.586A2 2 0 007.586 1H5a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V9.586A2 2 0 0014.414 7zM10 18a1 1 0 100-2 1 1 0 000 2zM10 5a1 1 0 011 1v4a1 1 0 11-2 0V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            <span>Quick Service Call</span>
                        </div>
                        <button
                            onClick={() => setShowFixedToaster(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            &times;
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-4">
                        <p className="text-gray-700 text-sm mb-3">
                            Book directly by calling our service line!
                        </p>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-lg text-blue-600 font-bold">{CONTACT_NUMBER}</span>
                            <button
                                onClick={handleCall}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                                Call Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
