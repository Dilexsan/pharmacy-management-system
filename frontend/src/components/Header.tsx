import React from 'react';
import { type User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Pharmacy StockMaster™</h1>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
            {user.initials}
          </div>
          <span className="text-gray-700">{user.email}</span>
          <button onClick={onLogout} className="text-blue-600 hover:underline">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;