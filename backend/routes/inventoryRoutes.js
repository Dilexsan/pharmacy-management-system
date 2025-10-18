import express from 'express';
import { 
  getInventory, 
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem 
} from '../controllers/inventoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getInventory)
  .post(protect, createInventoryItem);

router.route('/:id')
  .put(protect, updateInventoryItem)
  .delete(protect, deleteInventoryItem);

export default router;