// src/lib/email.js
// 이메일 전송 유틸리티
import nodemailer from 'nodemailer'

// 사용자 이메일 도메인에 따라 적절한 transporter 선택
function getTransporter(recipientEmail) {
  const domain = recipientEmail.split('@')[1]?.toLowerCase()
  
  if (domain === 'naver.com') {
    // Naver 메일로 발송
    return nodemailer.createTransport({
      host: 'smtp.naver.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.NAVER_USER,
        pass: process.env.NAVER_PASS
      }
    })
  } else {
    // Gmail 또는 기타 메일로 발송 (Gmail 사용)
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    })
  }
}

// 발신자 이메일 선택
function getSenderEmail(recipientEmail) {
  const domain = recipientEmail.split('@')[1]?.toLowerCase()
  
  if (domain === 'naver.com') {
    return `${process.env.NAVER_USER}@naver.com`
  } else {
    return process.env.GMAIL_USER
  }
}

// 인증 이메일 전송
export async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/verify?token=${token}`
  
  const transporter = getTransporter(email)
  const senderEmail = getSenderEmail(email)
  
  const mailOptions = {
    from: senderEmail,
    to: email,
    subject: 'MusicShare 이메일 인증',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">MusicShare 회원가입을 환영합니다!</h2>
        <p>아래 버튼을 클릭하여 이메일 인증을 완료해주세요.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            이메일 인증하기
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          이 링크는 24시간 동안 유효합니다.<br>
          만약 회원가입을 하지 않으셨다면 이 메일을 무시하셔도 됩니다.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          링크가 작동하지 않는 경우 아래 URL을 복사하여 브라우저에 붙여넣으세요:<br>
          ${verificationUrl}
        </p>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}

// 비밀번호 재설정 이메일 전송
export async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`
  
  const transporter = getTransporter(email)
  const senderEmail = getSenderEmail(email)
  
  const mailOptions = {
    from: senderEmail,
    to: email,
    subject: 'MusicShare 비밀번호 재설정',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">비밀번호 재설정 요청</h2>
        <p>비밀번호를 재설정하려면 아래 버튼을 클릭해주세요.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #ef4444; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            비밀번호 재설정하기
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          이 링크는 1시간 동안 유효합니다.<br>
          만약 비밀번호 재설정을 요청하지 않으셨다면 이 메일을 무시하셔도 됩니다.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          링크가 작동하지 않는 경우 아래 URL을 복사하여 브라우저에 붙여넣으세요:<br>
          ${resetUrl}
        </p>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Password reset email send error:', error)
    return { success: false, error: error.message }
  }
}

// 인증 토큰 생성
export function generateVerificationToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
