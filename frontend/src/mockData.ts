import { type InventoryItemType } from './types';

// Note: The current date for this logic is Thursday, October 9, 2025.

export const initialItems: InventoryItemType[] = [
  {
    id: 'PNDL-001',
    name: 'Panadol 500mg',
    itemCount: 150,
    expiryDate: '2027-12-12',
  },
  {
    id: 'AMX-250',
    name: 'Amoxicillin 250mg',
    itemCount: 45, // Low Stock
    expiryDate: '2026-10-25',
  },
  {
    id: 'ASPR-075',
    name: 'Aspirin 75mg',
    itemCount: 85,
    expiryDate: '2025-11-15', // Expiring Soon (within 90 days)
  },
  {
    id: 'LSTN-010',
    name: 'Losartan 50mg',
    itemCount: 55,
    expiryDate: '2025-08-15', // Expired
  },
  {
    id: 'VITC-500',
    name: 'Vitamin C 500mg',
    itemCount: 230,
    expiryDate: '2028-03-01',
  },
  {
    id: 'IBUP-200',
    name: 'Ibuprofen 200mg',
    itemCount: 30, // Low Stock and Expired
    expiryDate: '2025-01-01',
  },
];