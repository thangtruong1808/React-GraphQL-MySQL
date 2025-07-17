import React from 'react';

/**
 * Login Credentials Component
 * Displays test credentials in a 2x3 grid layout for development purposes
 */
const LoginCredentials: React.FC = () => {
  return (
    <div className="text-center text-xs text-gray-500 border border-gray-200 pt-4 py-2 px-4 rounded-lg mt-8 w-full max-w-6xl mx-auto">
      {/* First Row - 3 columns */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Column 1 */}
        <div className="flex flex-col items-start">
          <p className="text-gray-700 text-xs">Email: admin25@gmail.com</p>
          <p className="py-1 text-xs">Password: UserTest123!</p>
          <p className="text-red-600 text-xs">Role: ADMIN</p>
        </div>
        {/* Column 2 */}
        <div className="flex flex-col items-start">
          <p className="text-gray-700 text-xs">Email: karenacosta@gmail.com</p>
          <p className="py-1 text-xs">Password: UserTest123!</p>
          <p className="text-xs text-blue-600">Role: MANAGER</p>
        </div>
        {/* Column 3 */}
        <div className="flex flex-col items-start">
          <p className="text-gray-700 text-xs">Email: jgriffin@thomas.com</p>
          <p className="py-1 text-xs">Password: UserTest123!</p>
          <p className="text-xs text-purple-600">Role: DEVELOPER</p>
        </div>
      </div>

      {/* Second Row - 3 columns */}
      <div className="grid grid-cols-3 gap-4">
        {/* Column 1 */}
        <div className="flex flex-col items-start">
          <p className=" text-gray-700 text-xs">Email: dicksonmark@greene.com</p>
          <p className="py-1 text-xs">Password: UserTest123!</p>
          <p className="text-xs text-orange-600">Role: ADMIN</p>
        </div>
        {/* Column 2 */}
        <div className="flex flex-col items-start">
          <p className=" text-gray-700 text-xs">Email: andrewmay@yahoo.com</p>
          <p className="py-1 text-xs">Password: UserTest123!</p>
          <p className="text-xs text-blue-600">Role: MANAGER</p>
        </div>
        {/* Column 3 */}
        <div className="flex flex-col items-start">
          <p className=" text-gray-700 text-xs">Email: dherman@gmail.com</p>
          <p className="py-1 text-xs">Password: UserTest123!</p>
          <p className="text-xs text-purple-600">Role: DEVELOPER</p>
        </div>
      </div>
    </div>
  );
};

export default LoginCredentials; 