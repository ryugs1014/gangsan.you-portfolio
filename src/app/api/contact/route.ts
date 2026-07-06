// ✅ 파일 위치: app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // 1. 텍스트 필드 추출 (카테고리 제거)
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    // 2. 환경 변수 확인
    if (!process.env.GMAIL_APP_PASSWORD) {
      throw new Error('GMAIL_APP_PASSWORD 환경 변수가 설정되지 않았습니다.');
    }

    // 3. Nodemailer 설정 (ryugs1014 계정 사용)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ryugs1014@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // 4. 메일 옵션 설정
    const mailOptions: any = {
      from: '"포트폴리오 웹사이트" <ryugs1014@gmail.com>',
      to: 'ryugs1014@gmail.com', // 받는 사람도 나
      replyTo: email, // 답장하기를 누르면 문의를 남긴 사람의 이메일로 가도록 설정
      subject: `[포트폴리오 문의] ${company} - ${name}님의 문의입니다.`,
      text: `
포트폴리오 웹사이트에서 새로운 문의가 접수되었습니다.

이름: ${name}
기업명: ${company}
연락처: ${phone}
이메일: ${email}

문의 내용:
${message}
      `,
    };

    // 5. 메일 전송
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
