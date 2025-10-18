import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the request has an 'Authorization' header that starts with 'Bearer'
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // 2. Extract the token from the header (e.g., "Bearer eyJhbGci...")
      token = authHeader.split(' ')[1];

      // 3. Verify the token using the secret key from your .env file
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Use the user ID from the decoded token to find the user in the database
      const { rows } = await db.query('SELECT id, email, initials FROM users WHERE id = $1', [decoded.id]);
      
      if (rows.length > 0) {
        // 5. If the user exists, attach their info to the request object
        req.user = rows[0];
        // 6. Call 'next()' to pass control to the actual route handler (e.g., getInventory)
        next();
      } else {
        // If no user is found for that token ID, deny access
        res.status(401).json({ error: 'Not authorized, user not found' });
      }
    } catch (error) {
      // This will catch errors if the token is malformed or expired
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  // If no token is provided in the header, deny access
  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};

export { protect };

