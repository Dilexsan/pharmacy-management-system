export interface InventoryItemType {
  id: number;
  item_id: string;
  name: string;
  item_count: number;
  expiry_date: string;
}

export interface User {
  id: number;
  email: string;
  initials: string;
  token: string;
}