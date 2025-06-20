"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 사용자 데이터 생성
    const users = await queryInterface.bulkInsert(
      "users",
      [
        {
          email: "minsu.kim@email.com",
          password: "$2b$10$hash1", // dummy hash
          name: "김민수",
          phone: "010-1234-5678",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          email: "younghee.lee@company.com",
          password: "$2b$10$hash2", // dummy hash
          name: "이영희",
          phone: "010-9876-5432",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          email: "chulsoo.park@email.com",
          password: "$2b$10$hash3", // dummy hash
          name: "박철수",
          phone: "010-5555-1234",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          email: "jimin.choi@email.com",
          password: "$2b$10$hash4", // dummy hash
          name: "최지민",
          phone: "010-7777-8888",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {
        returning: ["id"],
      },
    );

    // 비자 신청 데이터 생성
    await queryInterface.bulkInsert("visa_applications", [
      {
        user_id: 1,
        application_number: "VN-2024-001",
        visa_type: "E-visa",
        full_name: "김민수",
        passport_number: "M12345678",
        nationality: "대한민국",
        birth_date: "1990-01-15",
        phone: "010-1234-5678",
        email: "minsu.kim@email.com",
        arrival_date: "2024-02-15",
        departure_date: "2024-02-25",
        purpose: "관광",
        status: "PENDING",
        created_at: new Date("2024-01-15T09:30:00Z"),
        updated_at: new Date("2024-01-16T14:20:00Z"),
      },
      {
        user_id: 2,
        application_number: "VN-2024-002",
        visa_type: "Business Visa",
        full_name: "이영희",
        passport_number: "M87654321",
        nationality: "대한민국",
        birth_date: "1985-05-20",
        phone: "010-9876-5432",
        email: "younghee.lee@company.com",
        arrival_date: "2024-02-20",
        departure_date: "2024-03-20",
        purpose: "사업",
        status: "PROCESSING",
        created_at: new Date("2024-01-14T16:45:00Z"),
        updated_at: new Date("2024-01-16T10:15:00Z"),
      },
      {
        user_id: 3,
        application_number: "VN-2024-003",
        visa_type: "노동허가서",
        full_name: "박철수",
        passport_number: "M11111111",
        nationality: "대한민국",
        birth_date: "1988-11-30",
        phone: "010-5555-1234",
        email: "chulsoo.park@email.com",
        arrival_date: "2024-03-01",
        departure_date: "2025-03-01",
        purpose: "취업",
        status: "DOCUMENT_REVIEW",
        created_at: new Date("2024-01-10T11:20:00Z"),
        updated_at: new Date("2024-01-16T16:30:00Z"),
      },
      {
        user_id: 4,
        application_number: "VN-2024-004",
        visa_type: "E-visa",
        full_name: "최지민",
        passport_number: "M22222222",
        nationality: "대한민국",
        birth_date: "1992-08-10",
        phone: "010-7777-8888",
        email: "jimin.choi@email.com",
        arrival_date: "2024-02-10",
        departure_date: "2024-02-20",
        purpose: "관광",
        status: "APPROVED",
        created_at: new Date("2024-01-12T08:15:00Z"),
        updated_at: new Date("2024-01-16T12:45:00Z"),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("visa_applications", null, {});
    await queryInterface.bulkDelete("users", null, {});
  },
};
