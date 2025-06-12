"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // E-VISA 가격표 테이블 생성
    await queryInterface.createTable("e_visa_prices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: "E-VISA 타입 (single, multiple)",
      },
      processingTime: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: "처리 시간 (normal, urgent, super_urgent)",
      },
      sellingPriceUSD: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: "USD 판매가",
      },
      marginUSD: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: "USD 마진",
      },
      sellingPriceVND: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        comment: "VND 판매가",
      },
      marginVND: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        comment: "VND 마진",
      },
      sellingPriceKRW: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        comment: "KRW 판매가",
      },
      marginKRW: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        comment: "KRW 마진",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: "활성 상태",
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Visa Run 가격표 테이블 생성
    await queryInterface.createTable("visa_run_prices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      visaType: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: "비자 타입",
      },
      peopleCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "인원수",
      },
      sellingPriceUSD: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: "USD 판매가",
      },
      marginUSD: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: "USD 마진",
      },
      sellingPriceVND: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        comment: "VND 판매가",
      },
      marginVND: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        comment: "VND 마진",
      },
      sellingPriceKRW: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        comment: "KRW 판매가",
      },
      marginKRW: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        comment: "KRW 마진",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: "활성 상태",
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Fast Track 가격표 테이블 생성
    await queryInterface.createTable("fast_track_prices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      serviceType: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: "서비스 타입 (arrival, departure)",
      },
      airport: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: "공항 (SGN, HAN, DAD)",
      },
      sellingPriceUSD: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: "USD 판매가",
      },
      marginUSD: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: "USD 마진",
      },
      sellingPriceVND: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        comment: "VND 판매가",
      },
      marginVND: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        comment: "VND 마진",
      },
      sellingPriceKRW: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        comment: "KRW 판매가",
      },
      marginKRW: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        comment: "KRW 마진",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: "활성 상태",
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 인덱스 생성
    // E-VISA 가격표 인덱스
    await queryInterface.addIndex("e_visa_prices", ["type", "processingTime"], {
      unique: true,
      name: "e_visa_prices_type_processing_time_unique",
    });
    await queryInterface.addIndex("e_visa_prices", ["isActive"]);
    await queryInterface.addIndex("e_visa_prices", ["createdBy"]);
    await queryInterface.addIndex("e_visa_prices", ["updatedBy"]);

    // Visa Run 가격표 인덱스
    await queryInterface.addIndex("visa_run_prices", ["visaType", "peopleCount"], {
      unique: true,
      name: "visa_run_prices_visa_type_people_count_unique",
    });
    await queryInterface.addIndex("visa_run_prices", ["isActive"]);
    await queryInterface.addIndex("visa_run_prices", ["createdBy"]);
    await queryInterface.addIndex("visa_run_prices", ["updatedBy"]);

    // Fast Track 가격표 인덱스
    await queryInterface.addIndex("fast_track_prices", ["serviceType", "airport"], {
      unique: true,
      name: "fast_track_prices_service_type_airport_unique",
    });
    await queryInterface.addIndex("fast_track_prices", ["isActive"]);
    await queryInterface.addIndex("fast_track_prices", ["createdBy"]);
    await queryInterface.addIndex("fast_track_prices", ["updatedBy"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("fast_track_prices");
    await queryInterface.dropTable("visa_run_prices");
    await queryInterface.dropTable("e_visa_prices");
  },
};
