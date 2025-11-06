import db from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
  static async create({ email, password, name }) {
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    const result = await db.query(
      `INSERT INTO users (email, password_hash, name) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, name, plan, created_at`,
      [email, password_hash, name]
    );
    
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT id, email, name, plan, subscription_status, created_at 
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default User;
