
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.USER);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(activeRole, identifier, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };
  
  const getIdentifierLabel = () => {
    switch(activeRole) {
      case UserRole.USER: return 'Ration Card / Aadhaar Number';
      case UserRole.DEALER: return 'Dealer ID';
      case UserRole.ADMIN: return 'Admin ID';
      default: return 'ID';
    }
  };

  const renderRoleButton = (role: UserRole, label: string) => (
    <button
      onClick={() => {
          setActiveRole(role);
          setIdentifier('');
          setPassword('');
          setError('');
      }}
      className={`w-full p-3 font-semibold text-center transition-colors duration-200 ${
        activeRole === role ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex">
          {renderRoleButton(UserRole.USER, 'User')}
          {renderRoleButton(UserRole.DEALER, 'Dealer')}
          {renderRoleButton(UserRole.ADMIN, 'Admin')}
        </div>
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Digital Ration Shop</h1>
          <p className="text-center text-gray-600 mb-6">{activeRole} Login</p>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="identifier">
                {getIdentifierLabel()}
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
