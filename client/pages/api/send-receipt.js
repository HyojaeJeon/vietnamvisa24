
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, applicationId, applicantName, pdfData, fileName } = req.body;

  if (!email || !applicationId || !pdfData) {
    return res.status(400).json({ message: '필수 정보가 누락되었습니다.' });
  }

  try {
    // nodemailer 설정 - 환경변수에서 SMTP 설정을 가져옴
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // PDF 데이터를 Buffer로 변환
    const pdfBuffer = Buffer.from(pdfData, 'base64');

    // 이메일 옵션
    const mailOptions = {
      from: `"베트남 비자 24" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `[베트남 비자 24] 비자 신청 접수증 - ${applicationId}`,
      html: `
        <div style="font-family: 'Noto Sans KR', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #1e40af; margin: 0; font-size: 28px;">베트남 비자 24</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Vietnam Visa 24</p>
          </div>

          <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
            <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 22px;">신청 접수 완료</h2>
            <p style="margin: 0; font-size: 16px; color: #374151;">
              안녕하세요 <strong>${applicantName || '고객'}</strong>님,<br>
              베트남 비자 신청이 성공적으로 접수되었습니다.
            </p>
          </div>

          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">신청 정보</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500; width: 120px;">신청번호:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: bold;">${applicationId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">신청자:</td>
                <td style="padding: 8px 0; color: #111827;">${applicantName || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">이메일:</td>
                <td style="padding: 8px 0; color: #111827;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">접수일:</td>
                <td style="padding: 8px 0; color: #111827;">${new Date().toLocaleDateString('ko-KR')}</td>
              </tr>
            </table>
          </div>

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">📋 중요 안내사항</h3>
            <ul style="margin: 0; padding-left: 20px; color: #78350f;">
              <li style="margin-bottom: 8px;">첨부된 접수증을 안전한 곳에 보관해주세요.</li>
              <li style="margin-bottom: 8px;">처리 상황은 이메일과 SMS로 안내드립니다.</li>
              <li style="margin-bottom: 8px;">추가 서류 요청 시 즉시 제출해주세요.</li>
              <li>문의사항은 신청번호와 함께 연락주시기 바랍니다.</li>
            </ul>
          </div>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">고객 지원</h3>
            <div style="display: flex; justify-content: space-around; text-align: center;">
              <div>
                <p style="margin: 0; color: #2563eb; font-weight: bold;">전화 문의</p>
                <p style="margin: 5px 0; font-size: 18px; font-weight: bold;">1588-1234</p>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">평일 09:00-18:00</p>
              </div>
              <div>
                <p style="margin: 0; color: #059669; font-weight: bold;">카카오톡</p>
                <p style="margin: 5px 0; font-weight: bold;">@vietnamvisa24</p>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">24시간 상담</p>
              </div>
            </div>
          </div>

          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              본 메일은 자동 발송되었습니다. 회신하지 마시기 바랍니다.<br>
              문의사항은 위 고객센터로 연락해주세요.
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: fileName,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    // 이메일 발송
    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: '접수증이 성공적으로 발송되었습니다.',
      email: email,
      applicationId: applicationId 
    });

  } catch (error) {
    console.error('이메일 발송 오류:', error);
    res.status(500).json({ 
      message: '이메일 발송 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
}
