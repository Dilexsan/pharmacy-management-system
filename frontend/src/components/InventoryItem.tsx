import React from 'react';
import { type InventoryItemType } from '../types';

interface InventoryItemProps {
  item: InventoryItemType;
  onEdit: (item: InventoryItemType) => void;
  onDelete: (id: number) => void;
}

const InventoryItem = ({ item, onEdit, onDelete }: InventoryItemProps) => {
  const getStatus = (item: InventoryItemType) => {
    const today = new Date();
    const expiryDate = new Date(item.expiry_date);
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(today.getDate() + 90);
    const isExpired = expiryDate < today;
    const isExpiringSoon = expiryDate >= today && expiryDate <= ninetyDaysFromNow;
    const isLowStock = item.item_count < 50;
    let status = { label: 'OK', icon: '✅', classes: 'bg-green-100 text-green-700' };
    let countBadge = null;

    if (isExpired) {
      status = { label: 'Expired', icon: '❌', classes: 'bg-red-100 text-red-700' };
    } else if (isExpiringSoon) {
      status = { label: 'Expiring Soon', icon: '🕒', classes: 'bg-yellow-100 text-yellow-700' };
    }
    if (isLowStock) {
      countBadge = <span className="ml-2 text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full">⚠️ Low Stock</span>;
    }
    return { status, countBadge, isExpired };
  };

  const { status, countBadge, isExpired } = getStatus(item);
  const rowClasses = isExpired ? 'bg-red-50' : 'hover:bg-gray-50';

  return (
    <tr className={`border-b border-gray-200 ${rowClasses}`}>
      <td className="p-4 text-gray-700">{item.item_id}</td>
      <td className="p-4 text-gray-900 font-medium">{item.name}</td>
      <td className="p-4 text-gray-700">
        {item.item_count}
        {countBadge}
      </td>
      <td className="p-4 text-gray-700">{new Date(item.expiry_date).toLocaleDateString()}</td>
      <td className="p-4">
        <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium ${status.classes}`}>
          {status.icon} {status.label}
        </span>
      </td>
      <td className="p-4">
        <div className="flex gap-2">
            <button onClick={() => onEdit(item)} className="text-blue-600 hover:underline">✏️ Edit</button>
            <button onClick={() => onDelete(item.id)} className="text-red-600 hover:underline">🗑️ Delete</button>
        </div>
      </td>
    </tr>
  );
};

export default InventoryItem;