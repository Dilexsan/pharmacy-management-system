import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import inventoryRoutes from './routes/inventoryRoutes.js';

// Load environment variables from the .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// === Middleware ===
// Enable Cross-Origin Resource Sharing (CORS) to allow requests from your frontend
app.use(cors());
// Enable the Express app to parse incoming JSON request bodies
app.use(express.json());

// === API Routes ===
// Mount the inventory routes at the /api/inventory endpoint
app.use('/api/inventory', inventoryRoutes);

// A simple catch-all route to handle requests to non-existent paths (404 Not Found)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server and listen for incoming requests on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});