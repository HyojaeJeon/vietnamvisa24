const fs = require('fs');
const path = require('path');
const { connectDB } = require('../database');

async function runSeeders() {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected for seeding');

    // Import Sequelize and models
    const { sequelize } = require('../models');
    const { VisaApplication, User } = require('../models');

    console.log('🔄 Creating test users...');
    
    // Create test users
    const users = await User.bulkCreate([
      {
        email: 'minsu.kim@email.com',
        password: '$2b$10$hash1', // dummy hash
        name: '김민수',
        phone: '010-1234-5678'
      },
      {
        email: 'younghee.lee@company.com',
        password: '$2b$10$hash2', // dummy hash
        name: '이영희',
        phone: '010-9876-5432'
      },
      {
        email: 'chulsoo.park@email.com',
        password: '$2b$10$hash3', // dummy hash
        name: '박철수',
        phone: '010-5555-1234'
      },
      {
        email: 'jimin.choi@email.com',
        password: '$2b$10$hash4', // dummy hash
        name: '최지민',
        phone: '010-7777-8888'
      }
    ], {
      ignoreDuplicates: true
    });

    console.log('✅ Created test users');

    console.log('🔄 Creating test visa applications...');
    
    // Create test visa applications
    await VisaApplication.bulkCreate([
      {
        user_id: 1,
        application_number: 'VN-2024-001',
        visa_type: 'E-visa',
        full_name: '김민수',
        passport_number: 'M12345678',
        nationality: '대한민국',
        birth_date: '1990-01-15',
        phone: '010-1234-5678',
        email: 'minsu.kim@email.com',
        arrival_date: '2024-02-15',
        departure_date: '2024-02-25',
        purpose: '관광',
        status: 'pending'
      },
      {
        user_id: 2,
        application_number: 'VN-2024-002',
        visa_type: 'Business Visa',
        full_name: '이영희',
        passport_number: 'M87654321',
        nationality: '대한민국',
        birth_date: '1985-05-20',
        phone: '010-9876-5432',
        email: 'younghee.lee@company.com',
        arrival_date: '2024-02-20',
        departure_date: '2024-03-20',
        purpose: '사업',
        status: 'processing'
      },
      {
        user_id: 3,
        application_number: 'VN-2024-003',
        visa_type: '노동허가서',
        full_name: '박철수',
        passport_number: 'M11111111',
        nationality: '대한민국',
        birth_date: '1988-11-30',
        phone: '010-5555-1234',
        email: 'chulsoo.park@email.com',
        arrival_date: '2024-03-01',
        departure_date: '2025-03-01',
        purpose: '취업',
        status: 'document_review'
      },
      {
        user_id: 4,
        application_number: 'VN-2024-004',
        visa_type: 'E-visa',
        full_name: '최지민',
        passport_number: 'M22222222',
        nationality: '대한민국',
        birth_date: '1992-08-10',
        phone: '010-7777-8888',
        email: 'jimin.choi@email.com',
        arrival_date: '2024-02-10',
        departure_date: '2024-02-20',
        purpose: '관광',
        status: 'approved'
      }
    ], {
      ignoreDuplicates: true
    });

    console.log('✅ Created test visa applications');
    console.log('🎉 Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeeders();
