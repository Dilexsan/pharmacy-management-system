import React from 'react';
import { type InventoryItemType } from '../types';
import InventoryItem from './InventoryItem';

interface InventoryTableProps {
  items: InventoryItemType[];
  onEdit: (item: InventoryItemType) => void;
  onDelete: (id: number) => void;
}

const InventoryTable = ({ items, onEdit, onDelete }: InventoryTableProps) => {
  return (
    <div className="flex-grow overflow-y-auto">
      <table className="w-full border-collapse text-left">
        <thead className="sticky top-0 bg-white">
          <tr>
            <th className="p-4 text-sm font-semibold text-gray-500 uppercase border-b">Item ID</th>
            <th className="p-4 text-sm font-semibold text-gray-500 uppercase border-b">Item Name</th>
            <th className="p-4 text-sm font-semibold text-gray-500 uppercase border-b">Item Count</th>
            <th className="p-4 text-sm font-semibold text-gray-500 uppercase border-b">Expiry Date</th>
            <th className="p-4 text-sm font-semibold text-gray-500 uppercase border-b">Status</th>
            <th className="p-4 text-sm font-semibold text-gray-500 uppercase border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <InventoryItem 
              key={item.id} 
              item={item} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;