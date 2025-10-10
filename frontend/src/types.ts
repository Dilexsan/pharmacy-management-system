export interface InventoryItemType {
  id: number; // Changed to number to match SERIAL PRIMARY KEY from DB
  item_id: string;
  name: string;
  item_count: number;
  expiry_date: string;
}
