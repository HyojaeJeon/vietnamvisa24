const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { models } = require('../../../database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

// Helper function to get admin from token
const getAdminFromToken = async (token) => {
  if (!token) return null;

  try {
    const cleanToken = token.replace('Bearer ', '');
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET || 'your-secret-key');

    const db = getDB();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM admins WHERE id = ? AND is_active = 1', [decoded.adminId], (err, row) => {
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

    adminMe: async (_, __, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error('Authentication required');
      return admin;
    },

    getAllAdmins: async (_, __, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin || (admin.role !== 'SUPER_ADMIN' && admin.role !== 'MANAGER')) {
        throw new Error('Permission denied');
      }

      const db = getDB();
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM admins ORDER BY created_at DESC', (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
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
    },

    // Documents
    getDocuments: () => [
      {
        id: 1,
        application_id: 'VN-2024-001',
        customer_name: '김민수',
        document_type: 'passport',
        document_name: 'passport_copy.pdf',
        file_size: '2.3 MB',
        status: 'approved',
        uploaded_at: '2024-01-15T09:30:00Z',
        reviewed_at: '2024-01-15T14:20:00Z',
        reviewer: '김담당',
        notes: '여권 사본 확인 완료'
      },
      {
        id: 2,
        application_id: 'VN-2024-001',
        customer_name: '김민수',
        document_type: 'photo',
        document_name: 'passport_photo.jpg',
        file_size: '1.1 MB',
        status: 'approved',
        uploaded_at: '2024-01-15T09:32:00Z',
        reviewed_at: '2024-01-15T14:22:00Z',
        reviewer: '김담당',
        notes: '증명사진 규격 적합'
      }
    ],

    getDocumentsByApplication: (parent, { applicationId }) => [
      {
        id: 1,
        application_id: applicationId,
        customer_name: '김민수',
        document_type: 'passport',
        document_name: 'passport_copy.pdf',
        file_size: '2.3 MB',
        status: 'approved',
        uploaded_at: '2024-01-15T09:30:00Z',
        reviewed_at: '2024-01-15T14:20:00Z',
        reviewer: '김담당',
        notes: '여권 사본 확인 완료'
      }
    ],

    // Notifications
    getNotifications: () => [
      {
        id: 1,
        type: 'application_update',
        title: '신규 E-visa 신청',
        message: '김민수님의 E-visa 신청이 접수되었습니다.',
        recipient: '전체 관리자',
        status: 'unread',
        priority: 'normal',
        created_at: '2024-01-16T14:30:00Z',
        related_id: 'VN-2024-001'
      },
      {
        id: 2,
        type: 'status_change',
        title: '신청 상태 변경 알림',
        message: '이영희님의 비즈니스 비자 신청이 승인되었습니다.',
        recipient: '김담당',
        status: 'read',
        priority: 'high',
        created_at: '2024-01-16T13:15:00Z',
        related_id: 'VN-2024-002'
      }
    ],

    getUnreadNotifications: () => [
      {
        id: 1,
        type: 'application_update',
        title: '신규 E-visa 신청',
        message: '김민수님의 E-visa 신청이 접수되었습니다.',
        recipient: '전체 관리자',
        status: 'unread',
        priority: 'normal',
        created_at: '2024-01-16T14:30:00Z',
        related_id: 'VN-2024-001'
      }
    ],

    // Mock data queries
    dashboardStats: () => ({
      totalApplications: 1234,
      newApplicationsToday: 23,
      completedToday: 18,
      pendingReview: 45
    }),
  },

  Mutation: {
    register: async (_, { input }) => {
      const { email, password, name, phone } = input;

      // Check if user already exists
      const existingUser = await models.User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await models.User.create({
        email,
        password: hashedPassword,
        name,
        phone
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          created_at: user.created_at
        }
      };
    },

    login: async (_, { input }) => {
      const { email, password } = input;

      // Find user
      const user = await models.User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          created_at: user.created_at
        }
      };
    },

    adminLogin: async (_, { input }) => {
      const { email, password } = input;

      // Find admin
      const admin = await models.Admin.findOne({ 
        where: { email, is_active: true } 
      });

      if (!admin) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { adminId: admin.id, email: admin.email, role: admin.role },
        process.env.JWT_SECRET || 'admin-secret-key',
        { expiresIn: '8h' }
      );

      return {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          created_at: admin.created_at,
          is_active: admin.is_active
        }
      };
    },

    createAdmin: async (_, { input }, { adminToken }) => {
      // Check if user is authenticated and has proper permissions
      const admin = await getAdminFromToken(adminToken);
      if (!admin || (admin.role !== 'SUPER_ADMIN' && admin.role !== 'MANAGER')) {
        throw new Error('Permission denied');
      }

      const { email, password, name, role } = input;

      const db = getDB();

      // Check if admin already exists
      const existingAdmin = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM admins WHERE email = ?', [email], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (existingAdmin) {
        throw new Error('Admin with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create admin
      return new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO admins (email, password, name, role) VALUES (?, ?, ?, ?)',
          [email, hashedPassword, name, role],
          function(err) {
            if (err) {
              reject(err);
            } else {
              db.get(
                'SELECT * FROM admins WHERE id = ?',
                [this.lastID],
                (err, row) => {
                  if (err) reject(err);
                  else resolve(row);
                }
              );
            }
          }
        );
      });
    },

    updateAdminRole: async (_, { id, role }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin || admin.role !== 'SUPER_ADMIN') {
        throw new Error('Permission denied');
      }

      const db = getDB();
      return new Promise((resolve, reject) => {
        db.run(
          'UPDATE admins SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [role, id],
          function(err) {
            if (err) {
              reject(err);
            } else {
              db.get(
                'SELECT * FROM admins WHERE id = ?',
                [id],
                (err, row) => {
                  if (err) reject(err);
                  else resolve(row);
                }
              );
            }
          }
        );
      });
    },

    deactivateAdmin: async (_, { id }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin || admin.role !== 'SUPER_ADMIN') {
        throw new Error('Permission denied');
      }

      const db = getDB();
      return new Promise((resolve, reject) => {
        db.run(
          'UPDATE admins SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [id],
          function(err) {
            if (err) {
              reject(err);
            } else {
              db.get(
                'SELECT * FROM admins WHERE id = ?',
                [id],
                (err, row) => {
                  if (err) reject(err);
                  else resolve(row);
                }
              );
            }
          }
        );
      });
    },

    submitVisaApplication: async (_, { input }, { token }) => {
      const user = await getUserFromToken(token);

      const db = getDB();
      return new Promise((resolve, reject) => {
        db.run(`
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
        ], function(err) {
          if (err) {
            reject(err);
          } else {
            db.get(
              'SELECT * FROM visa_applications WHERE id = ?',
              [this.lastID],
              (err, row) => {
                if (err) reject(err);
                else resolve(row);
              }
            );
          }
        });
      });
    },

    updateVisaApplicationStatus: async (parent, { id, status }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id,
            status,
            updated_at: new Date().toISOString()
          });
        }, 500);
      });
    },

    // Document mutations
    updateDocumentStatus: async (parent, { id, status, notes }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id,
            application_id: 'VN-2024-001',
            customer_name: '김민수',
            document_type: 'passport',
            document_name: 'passport_copy.pdf',
            file_size: '2.3 MB',
            status,
            uploaded_at: '2024-01-15T09:30:00Z',
            reviewed_at: new Date().toISOString(),
            reviewer: '김담당',
            notes: notes || '상태 업데이트'
          });
        }, 500);
      });
    },

    deleteDocument: async (parent, { id }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 500);
      });
    },

    // Notification mutations
    markNotificationAsRead: async (parent, { id }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id,
            type: 'application_update',
            title: '신규 E-visa 신청',
            message: '김민수님의 E-visa 신청이 접수되었습니다.',
            recipient: '전체 관리자',
            status: 'read',
            priority: 'normal',
            created_at: '2024-01-16T14:30:00Z',
            related_id: 'VN-2024-001'
          });
        }, 500);
      });
    },

    markAllNotificationsAsRead: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 500);
      });
    },

    createNotification: async (parent, { input }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now(),
            ...input,
            status: 'unread',
            created_at: new Date().toISOString()
          });
        }, 500);
      });
    }
  }
};

module.exports = resolvers;