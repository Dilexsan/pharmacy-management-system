import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import inventoryRoutes from './routes/inventoryRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});