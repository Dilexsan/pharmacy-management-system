import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const registerUser = async (req, res) => {
  const { email, password, initials } = req.body;
  if (!email || !password || !initials) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }
  try {
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const newUserQuery = `
      INSERT INTO users (email, password_hash, initials) 
      VALUES ($1, $2, $3) RETURNING id, email, initials;
    `;
    const { rows } = await db.query(newUserQuery, [email, password_hash, initials]);
    const user = rows[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ id: user.id, email: user.email, initials: user.initials, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ id: user.id, email: user.email, initials: user.initials, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error during login' });
  }
};

export { registerUser, loginUser };