
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('./database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to get user from token
const getUserFromToken = async (token) => {
  if (!token) return null;
  
  try {
    const cleanToken = token.replace('Bearer ', '');
    const decoded = jwt.verify(cleanToken, JWT_SECRET);
    const db = getDB();
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [decoded.userId]);
    return rows[0] || null;
  } catch (error) {
    return null;
  }
};

const { getDB } = require('./database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper function to get user from token
const getUserFromToken = async (token) => {
  if (!token) return null;
  
  try {
    const cleanToken = token.replace('Bearer ', '');
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET || 'your-secret-key');
    
    const db = getDB();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [decoded.userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  } catch (error) {
    return null;
  }
};

const resolvers = {
  Query: {
    me: async (_, __, { token }) => {
      return await getUserFromToken(token);
    },

    getVisaApplications: async (_, __, { token }) => {
      const user = await getUserFromToken(token);
      if (!user) throw new Error('Authentication required');

      const db = getDB();
      return new Promise((resolve, reject) => {
        db.all(
          'SELECT * FROM visa_applications WHERE user_id = ? ORDER BY created_at DESC',
          [user.id],
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });
    },

    getVisaApplication: async (_, { id }, { token }) => {
      const user = await getUserFromToken(token);
      if (!user) throw new Error('Authentication required');

      const db = getDB();
      return new Promise((resolve, reject) => {
        db.get(
          'SELECT * FROM visa_applications WHERE id = ? AND user_id = ?',
          [id, user.id],
          (err, row) => {
            if (err) reject(err);
            else resolve(row || null);
          }
        );
      });
    },

    getVisaTypes: () => {
      return [
        'Tourism Visa (1 month)',
        'Tourism Visa (3 months)',
        'Business Visa (1 month)',
        'Business Visa (3 months)',
        'Transit Visa'
      ];
    }
  },

  Mutation: {
    register: async (_, { input }) => {
      const { email, password, name, phone } = input;
      
      const db = getDB();
      
      // Check if user already exists
      const existingUser = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      return new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO users (email, password, name, phone) VALUES (?, ?, ?, ?)',
          [email, hashedPassword, name, phone],
          function(err) {
            if (err) {
              reject(err);
            } else {
              const token = jwt.sign(
                { userId: this.lastID }, 
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '7d' }
              );
              resolve({
                token,
                user: {
                  id: this.lastID,
                  email,
                  name,
                  phone
                }
              });
            }
          }
        );
      });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const [result] = await db.execute(
        'INSERT INTO users (email, password, name, phone) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, name, phone]
      );

      // Get created user
      const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
      const user = users[0];

      // Generate token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      return { token, user };
    },

    login: async (_, { input }) => {
      const { email, password } = input;
      
      const db = getDB();
      const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      const user = users[0];

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      return { token, user };
    },

    submitVisaApplication: async (_, { input }, { token }) => {
      const user = await getUserFromToken(token);
      
      const db = getDB();
      const [result] = await db.execute(`
        INSERT INTO visa_applications 
        (user_id, visa_type, full_name, passport_number, nationality, birth_date, 
         phone, email, arrival_date, departure_date, purpose) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        user?.id || null,
        input.visa_type,
        input.full_name,
        input.passport_number,
        input.nationality,
        input.birth_date,
        input.phone,
        input.email,
        input.arrival_date,
        input.departure_date,
        input.purpose
      ]);

      const [applications] = await db.execute(
        'SELECT * FROM visa_applications WHERE id = ?',
        [result.insertId]
      );

      return applications[0];
    },

    updateVisaApplicationStatus: async (_, { id, status }, { token }) => {
      const user = await getUserFromToken(token);
      if (!user) throw new Error('Authentication required');

      const db = getDB();
      await db.execute(
        'UPDATE visa_applications SET status = ? WHERE id = ? AND user_id = ?',
        [status, id, user.id]
      );

      const [applications] = await db.execute(
        'SELECT * FROM visa_applications WHERE id = ?',
        [id]
      );

      return applications[0];
    }
  }
};

module.exports = resolvers;
