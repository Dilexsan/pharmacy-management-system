import React, { useState, useEffect } from 'react';
import ActionBar from './components/ActionBar';
import InventoryTable from './components/InventoryTable';
import AddItemModal from './components/AddItemModal';
import EditItemModal from './components/EditItemModal';
import { type InventoryItemType } from './types';

const API_URL = 'http://localhost:5000/api/inventory';

function App() {
  const [items, setItems] = useState<InventoryItemType[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItemType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State for the Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItemType | null>(null);

  const fetchInventory = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    let result = items;
    // Filtering logic...
    if (searchTerm) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (activeFilter !== 'all') {
      const today = new Date();
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

  const handleAddItem = async (newItemData: Omit<InventoryItemType, 'id'>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItemData),
      });
      if (!response.ok) throw new Error('Failed to add item');
      fetchInventory(); // Refetch data to see the new item
      setIsAddModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Error adding item.');
    }
  };

  // Function to handle deleting an item
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete item');
        // Update state locally to reflect deletion immediately
        setItems(items.filter(item => item.id !== id));
      } catch (error) {
        console.error(error);
        alert('Error deleting item.');
      }
    }
  };
  
  // Function to open the edit modal
  const handleEdit = (item: InventoryItemType) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  // Function to handle updating an item
  const handleUpdate = async (updatedItem: InventoryItemType) => {
    try {
      const response = await fetch(`${API_URL}/${updatedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });
      if (!response.ok) throw new Error('Failed to update item');
      fetchInventory(); // Refetch all data to see the update
      setIsEditModalOpen(false);
      setItemToEdit(null);
    } catch (error) {
      console.error(error);
      alert('Error updating item.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Pharmacy StockMaster™</h1>
        </div>
      </header>

      <main className="flex-grow p-8 flex flex-col">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col flex-grow">
          <h2 className="text-2xl font-bold text-gray-800">Inventory Overview</h2>
          <ActionBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setFilter={setActiveFilter}
            onAddNew={() => setIsAddModalOpen(true)}
          />
          <InventoryTable 
            items={filteredItems} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </div>
      </main>

      <AddItemModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={handleAddItem}
      />
      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setItemToEdit(null);
        }}
        onUpdate={handleUpdate}
        itemToEdit={itemToEdit}
      />
    </div>
  );
}

export default App;