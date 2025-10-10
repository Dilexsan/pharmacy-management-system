import React, { useState } from 'react';
import { type InventoryItemType } from '../types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<InventoryItemType, 'id'>) => void;
}

const AddItemModal = ({ isOpen, onClose, onAddItem }: AddItemModalProps) => {
  const [newItem, setNewItem] = useState({
    item_id: '',
    name: '',
    item_count: '',
    expiry_date: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { item_id, name, item_count, expiry_date } = newItem;

    // Basic validation
    if (!item_id || !name || !item_count || !expiry_date) {
      setError('All fields are required.');
      return;
    }

    onAddItem({
      item_id,
      name,
      item_count: parseInt(item_count, 10), // Convert count to number
      expiry_date,
    });
    
    // Clear form and close modal on successful submission
    setNewItem({ item_id: '', name: '', item_count: '', expiry_date: '' });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    // Modal Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Inventory Item</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="space-y-4">
            <input
              type="text"
              name="item_id"
              value={newItem.item_id}
              onChange={handleChange}
              placeholder="Item ID (e.g., PNDL-001)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="name"
              value={newItem.name}
              onChange={handleChange}
              placeholder="Item Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="item_count"
              value={newItem.item_count}
              onChange={handleChange}
              placeholder="Item Count"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              name="expiry_date"
              value={newItem.expiry_date}
              onChange={handleChange}
              placeholder="Expiry Date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
            >
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;

