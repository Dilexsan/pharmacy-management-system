import React, { useState, useEffect } from 'react';
import { type InventoryItemType } from '../types';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (item: InventoryItemType) => void;
  itemToEdit: InventoryItemType | null;
}

const EditItemModal = ({ isOpen, onClose, onUpdate, itemToEdit }: EditItemModalProps) => {
  const [formData, setFormData] = useState<InventoryItemType | null>(null);
  const [error, setError] = useState('');

  // When the itemToEdit prop changes, update the form's state
  useEffect(() => {
    setFormData(itemToEdit);
  }, [itemToEdit]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.item_id || !formData.name || !formData.item_count || !formData.expiry_date) {
      setError('All fields are required.');
      return;
    }
    setError('');
    onUpdate({
        ...formData,
        item_count: Number(formData.item_count)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Inventory Item</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="item_id">Item ID</label>
            <input type="text" id="item_id" value={formData.item_id} onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">Item Name</label>
            <input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="item_count">Item Count</label>
            <input type="number" id="item_count" value={formData.item_count} onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="expiry_date">Expiry Date</label>
            <input type="date" id="expiry_date" value={new Date(formData.expiry_date).toISOString().split('T')[0]} onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 border hover:bg-gray-100">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600">Update Item</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;