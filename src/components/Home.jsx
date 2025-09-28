import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    // State for the one-time initial pop-up (appears on load)
    const [showToaster, setShowToaster] = useState(false);
    // State for the persistent pop-up when clicking the fixed button
    const [showFixedToaster, setShowFixedToaster] = useState(false);
    
    const CONTACT_NUMBER = "9999999999"; // <-- Set your official contact number here

    useEffect(() => {
        // --- Logic for one-time initial pop-up ---
        const hasShown = localStorage.getItem('hasShownContactPopUp');
        
        if (!hasShown) {
            setShowToaster(true);
            localStorage.setItem('hasShownContactPopUp', 'true');
        }
        
        const timer = setTimeout(() => {
            setShowToaster(false);
        }, 5000); // Pop-up stays visible for 5 seconds

        return () => clearTimeout(timer);
    }, []);

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
                        <Link to="/auth" className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                            Book Online
                        </Link>
                        {/* Static Call CTA (Main Hero Button) */}
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

            {/* Fixed Call Button (Clickable, not a direct link) */}
            <button
                onClick={() => setShowFixedToaster(true)}
                className="fixed bottom-6 right-6 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110 z-40"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.137a11.042 11.042 0 005.516 5.516l1.137-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            </button>

            {/* Fixed Toaster Pop-up (Appears on clicking the fixed button) */}
            {showFixedToaster && (
                <div className="fixed bottom-20 right-6 p-4 bg-white rounded-lg shadow-2xl w-80 z-50 transform transition-transform duration-300 animate-slide-in">
                    <p className="text-gray-800 font-semibold mb-3">
                        Book directly by calling our service line!
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="text-lg text-blue-600 font-bold">{CONTACT_NUMBER}</span>
                        <button
                            onClick={handleCall}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Call Now
                        </button>
                    </div>
                    <button
                        onClick={() => setShowFixedToaster(false)}
                        className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
                    >
                        &times;
                    </button>
                </div>
            )}
            
            {/* One-Time Initial Pop-up (Shows only on initial load) */}
            {showToaster && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 p-4 bg-yellow-400 text-gray-800 rounded-lg shadow-2xl w-full max-w-sm z-50 animate-bounce-fade">
                    <div className="flex justify-between items-center">
                        <p className="font-bold">✨ Quick Service! Call Now! ✨</p>
                        <a
                            href={`tel:${CONTACT_NUMBER}`}
                            className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
                        >
                            {CONTACT_NUMBER}
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;