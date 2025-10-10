import React from 'react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Pharmacy StockMaster™</h1>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">A.S.</div>
          <span className="text-gray-700">Admin User</span>
          <span className="text-gray-500 text-xs">▼</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
