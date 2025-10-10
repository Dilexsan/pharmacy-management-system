import React from 'react';

interface ActionBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setFilter: (filter: string) => void;
  onAddNew: () => void; // Add this prop to handle the click event
}

const ActionBar = ({ searchTerm, setSearchTerm, setFilter, onAddNew }: ActionBarProps) => {
  const filterButtonStyles = "px-4 py-2 rounded-lg border transition-colors duration-200 hover:bg-gray-100";

  return (
    <div className="flex items-center gap-4 my-6">
      {/* Search Bar */}
      <div className="flex-grow flex items-center bg-gray-100 rounded-lg px-4">
        <span className="text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Search by Item Name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent p-2 text-gray-700 focus:outline-none"
        />
      </div>
      
      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <button onClick={() => setFilter('all')} className={`${filterButtonStyles} border-gray-300`}>All</button>
        <button onClick={() => setFilter('lowStock')} className={`${filterButtonStyles} border-red-400 text-red-600`}>Low Stock</button>
        <button onClick={() => setFilter('expiringSoon')} className={`${filterButtonStyles} border-yellow-500 text-yellow-700`}>Expiring Soon</button>
        <button onClick={() => setFilter('expired')} className={`${filterButtonStyles} border-orange-500 text-orange-700`}>Expired</button>
      </div>

      {/* Add New Item Button - updated with onClick */}
      <button 
        onClick={onAddNew} // Use the passed-in function here
        className="bg-blue-500 text-white font-bold px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 whitespace-nowrap"
      >
        + Add New Item
      </button>
    </div>
  );
};

export default ActionBar;

