const { VisaApplication, User } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if data already exists
      const existingApplications = await VisaApplication.findAll();
      if (existingApplications.length > 0) {
        console.log("✅ Visa applications already exist, skipping seed");
        return;
      }

      // Create some test users first (if they don't exist)
      const users = await User.bulkCreate(
        [
          {
            name: "김민수",
            email: "minsu.kim@email.com",
            password: "hashedpassword123", // In real app, this should be hashed
          },
          {
            name: "이영희",
            email: "younghee.lee@company.com",
            password: "hashedpassword123",
          },
          {
            name: "박철수",
            email: "chulsoo.park@email.com",
            password: "hashedpassword123",
          },
        ],
        {
          ignoreDuplicates: true,
        }
      );

      // Create visa applications
      const applications = await VisaApplication.bulkCreate([
        {
          application_number: "VN-2024-001",
          user_id: 1,
          full_name: "김민수",
          passport_number: "M12345678",
          nationality: "대한민국",
          birth_date: "1990-05-15",
          phone: "010-1234-5678",
          email: "minsu.kim@email.com",
          visa_type: "E-visa",
          arrival_date: "2024-02-15",
          departure_date: "2024-02-25",
          purpose: "관광",
          status: "pending",
        },
        {
          application_number: "VN-2024-002",
          user_id: 2,
          full_name: "이영희",
          passport_number: "M87654321",
          nationality: "대한민국",
          birth_date: "1985-12-10",
          phone: "010-9876-5432",
          email: "younghee.lee@company.com",
          visa_type: "Business Visa",
          arrival_date: "2024-02-20",
          departure_date: "2024-03-20",
          purpose: "비즈니스",
          status: "processing",
        },
        {
          application_number: "VN-2024-003",
          user_id: 3,
          full_name: "박철수",
          passport_number: "M11111111",
          nationality: "대한민국",
          birth_date: "1988-08-22",
          phone: "010-5555-1234",
          email: "chulsoo.park@email.com",
          visa_type: "노동허가서",
          arrival_date: "2024-03-01",
          departure_date: "2025-03-01",
          purpose: "취업",
          status: "document_review",
        },
        {
          application_number: "VN-2024-004",
          full_name: "최지민",
          passport_number: "M22222222",
          nationality: "대한민국",
          birth_date: "1992-03-18",
          phone: "010-7777-8888",
          email: "jimin.choi@email.com",
          visa_type: "E-visa",
          arrival_date: "2024-02-10",
          departure_date: "2024-02-20",
          purpose: "관광",
          status: "approved",
        },
        {
          application_number: "VN-2024-005",
          full_name: "정수현",
          passport_number: "M33333333",
          nationality: "대한민국",
          birth_date: "1987-11-05",
          phone: "010-3333-4444",
          email: "suhyun.jung@email.com",
          visa_type: "Business Visa",
          arrival_date: "2024-01-25",
          departure_date: "2024-02-05",
          purpose: "회의",
          status: "rejected",
        },
      ]);

      console.log("✅ Created visa applications successfully");
      console.log(`📊 Created ${applications.length} visa applications`);
    } catch (error) {
      console.error("❌ Failed to create visa applications:", error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("visa_applications", null, {});
    await queryInterface.bulkDelete("users", null, {});
  },
};
