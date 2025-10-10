import express from 'express';
import { 
  getInventory, 
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem 
} from '../controllers/inventoryController.js';

const router = express.Router();

// Define routes for the base endpoint ('/api/inventory')
router.route('/')
  .get(getInventory)       // Handles GET requests to fetch all items
  .post(createInventoryItem); // Handles POST requests to create a new item

// Define routes for endpoints with a specific ID ('/api/inventory/:id')
router.route('/:id')
  .put(updateInventoryItem)   // Handles PUT requests to update an item
  .delete(deleteInventoryItem); // Handles DELETE requests to remove an item

export default router;