import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ActionBar from './components/ActionBar';
import InventoryTable from './components/InventoryTable';
import AddItemModal from './components/AddItemModal';
import { type InventoryItemType } from './types';

// The base URL for your backend API
const API_URL = 'http://localhost:5000/api/inventory';

function App() {
  const [items, setItems] = useState<InventoryItemType[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItemType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to fetch all inventory items from the backend
  const fetchInventory = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  };

  // Fetch initial data when the component mounts
  useEffect(() => {
    fetchInventory();
  }, []);

  // Effect for filtering logic
  useEffect(() => {
    let result = items;
    if (searchTerm) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (activeFilter !== 'all') {
      const today = new Date(); // Use current date for accurate filtering
      const ninetyDaysFromNow = new Date();
      ninetyDaysFromNow.setDate(today.getDate() + 90);
      result = result.filter(item => {
        const expiryDate = new Date(item.expiry_date);
        if (activeFilter === 'lowStock') return item.item_count < 50;
        if (activeFilter === 'expiringSoon') return expiryDate >= today && expiryDate <= ninetyDaysFromNow;
        if (activeFilter === 'expired') return expiryDate < today;
        return true;
      });
    }
    setFilteredItems(result);
  }, [searchTerm, activeFilter, items]);

  // Function to handle adding a new item via API call
  const handleAddItem = async (newItemData: Omit<InventoryItemType, 'id'>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to add item'}`);
        return;
      }

      const addedItem = await response.json();
      // Add the new item to the state to re-render the list immediately
      setItems(prevItems => [...prevItems, addedItem]);
      setIsModalOpen(false); // Close modal on success

    } catch (error) {
      console.error('Failed to add new item:', error);
      alert('An error occurred while adding the item.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <Header />
      <main className="flex-grow p-8 flex flex-col">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col flex-grow">
          <h2 className="text-2xl font-bold text-gray-800">Inventory Overview</h2>
          <ActionBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setFilter={setActiveFilter}
            onAddNew={() => setIsModalOpen(true)}
          />
          <InventoryTable items={filteredItems} />
        </div>
      </main>
      <AddItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddItem={handleAddItem}
      />
    </div>
  );
}

export default App;

