#!/usr/bin/env node

/**
 * 알림 시스템 간단 테스트 스크립트
 */

const path = require('path');
const models = require('../models');
const {
  createApplicationStatusNotification,
  createNewApplicationNotification,
  createSystemNotification
} = require('../utils/notificationHelpers');

async function quickTest() {
  console.log('🧪 알림 시스템 빠른 테스트 시작...\n');

  try {
    // 데이터베이스 연결 테스트
    await models.sequelize.authenticate();
    console.log('✅ 데이터베이스 연결 성공');

    // 테이블 존재 확인
    const tables = await models.sequelize.getQueryInterface().showAllTables();
    const hasNotificationTable = tables.includes('notifications');
    console.log('📊 알림 테이블 존재:', hasNotificationTable ? '✅' : '❌');

    if (!hasNotificationTable) {
      console.log('❌ 알림 테이블이 없습니다. 데이터베이스 마이그레이션을 실행해주세요.');
      return;
    }

    const testEmail = 'admin@example.com';

    // 1. 시스템 알림 생성 테스트
    console.log('\n1️⃣ 시스템 알림 생성 테스트');
    const systemNotification = await createSystemNotification(
      '알림 시스템 테스트',
      '알림 시스템이 정상적으로 작동하고 있습니다.',
      testEmail,
      'normal',
      '/dashboard'
    );
    console.log('✅ 시스템 알림 생성됨:', systemNotification.id);

    // 2. 최근 알림 조회
    console.log('\n2️⃣ 최근 알림 조회');
    const recentNotifications = await models.Notification.findAll({
      where: { recipient: testEmail },
      order: [['createdAt', 'DESC']],
      limit: 3
    });

    console.log(`📋 ${testEmail}의 최근 알림 ${recentNotifications.length}개:`);
    recentNotifications.forEach((n, i) => {
      console.log(`  ${i+1}. [${n.type}] ${n.title}`);
      console.log(`     → ${n.message}`);
      console.log(`     → 상태: ${n.status}, 우선순위: ${n.priority}`);
      console.log(`     → 생성일: ${n.createdAt}`);
      if (n.targetUrl) {
        console.log(`     → 링크: ${n.targetUrl}`);
      }
      console.log('');
    });

    // 3. 통계 조회
    console.log('3️⃣ 알림 통계');
    const totalCount = await models.Notification.count();
    const unreadCount = await models.Notification.count({ 
      where: { status: 'unread' }
    });
    const userUnreadCount = await models.Notification.count({ 
      where: { 
        recipient: testEmail, 
        status: 'unread' 
      }
    });

    console.log(`📊 전체 통계:`);
    console.log(`   총 알림: ${totalCount}개`);
    console.log(`   읽지 않음: ${unreadCount}개`);
    console.log(`   ${testEmail} 읽지 않음: ${userUnreadCount}개`);

    console.log('\n🎉 알림 시스템 테스트 완료!');

  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
    console.error('스택 트레이스:', error.stack);
  }
}

// 스크립트 실행
if (require.main === module) {
  quickTest()
    .then(() => {
      console.log('\n✅ 테스트 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 테스트 오류:', error);
      process.exit(1);
    });
}

module.exports = { quickTest };
