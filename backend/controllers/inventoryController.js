import db from '../config/db.js';

// @desc    Get all inventory items
// @route   GET /api/inventory
const getInventory = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM inventory ORDER BY id ASC');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while fetching inventory' });
  }
};

// @desc    Create a new inventory item
// @route   POST /api/inventory
const createInventoryItem = async (req, res) => {
  try {
    const { item_id, name, item_count, expiry_date } = req.body;
    // Perform server-side validation
    if (!item_id || !name || !item_count || !expiry_date) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
    const newQuery = `
      INSERT INTO inventory (item_id, name, item_count, expiry_date)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [item_id, name, item_count, expiry_date];
    const { rows } = await db.query(newQuery, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    // Handle specific database error for unique constraint violation (e.g., duplicate item_id)
    if (err.code === '23505') {
      return res.status(409).json({ error: `Item with ID '${item_id}' already exists.` });
    }
    res.status(500).json({ error: 'Server error while creating item' });
  }
};

// @desc    Update an existing inventory item
// @route   PUT /api/inventory/:id
const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { item_id, name, item_count, expiry_date } = req.body;
    const updateQuery = `
      UPDATE inventory SET item_id = $1, name = $2, item_count = $3, expiry_date = $4
      WHERE id = $5 RETURNING *;
    `;
    const values = [item_id, name, item_count, expiry_date, id];
    const { rows } = await db.query(updateQuery, values);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while updating item' });
  }
};

// @desc    Delete an inventory item
// @route   DELETE /api/inventory/:id
const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteQuery = 'DELETE FROM inventory WHERE id = $1 RETURNING *;';
    const { rows } = await db.query(deleteQuery, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while deleting item' });
  }
};

export { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem };