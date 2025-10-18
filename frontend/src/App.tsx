import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ActionBar from './components/ActionBar';
import InventoryTable from './components/InventoryTable';
import AddItemModal from './components/AddItemModal';
import LoginPage from './pages/LoginPage';
import { type InventoryItemType, type User } from './types';

const API_URL = 'http://localhost:5000/api/inventory';

// A new component to contain the main application view after login
const Dashboard = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
  const [items, setItems] = useState<InventoryItemType[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItemType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchInventory = async () => {
    try {
      // *** THE FIX IS HERE ***
      // We add the 'headers' object with the Authorization token
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.status === 401) {
        onLogout();
        return;
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchInventory();
    }
  }, [user]);

  useEffect(() => {
    let result = items;
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
      // *** THE FIX IS ALSO HERE ***
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` // Add the token here as well
        },
        body: JSON.stringify(newItemData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add item');
      }
      fetchInventory();
      setIsModalOpen(false);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-grow p-8 flex flex-col">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col flex-grow">
          <h2 className="text-2xl font-bold text-gray-800">Inventory Overview</h2>
          <ActionBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setFilter={setActiveFilter}
            onAddNew={() => setIsModalOpen(true)}
          />
          <InventoryTable 
            items={filteredItems}
            onEdit={(item) => console.log('Edit item:', item)}
            onDelete={(item) => console.log('Delete item:', item)}
          />
        </div>
      </main>
      <AddItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddItem={handleAddItem}
      />
    </div>
  );
};

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    user ? <Dashboard user={user} onLogout={handleLogout} /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
  );
}

export default App;

