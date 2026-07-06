'use client';

import React, { useState } from 'react';
import s from './Section_Form.module.scss';
import Container from '@/components/layout/Container';
import { IconCheck } from '@tabler/icons-react';
import Spinner from '@/components/atoms/loading/Spinner';

interface FormDataType {
  name: string;
  company: string;
  phone: string;
  email: string;
  message: string;
  // agree: boolean;
}

interface ToastType {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function Section_Form() {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [form, setForm] = useState<FormDataType>({
    name: '',
    company: '',
    phone: '',
    email: '',
    message: '',
    // agree: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormDataType, string>>
  >({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const addToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info',
  ) => {
    const id = new Date().getTime();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      e.target instanceof HTMLInputElement && e.target.type === 'checkbox'
        ? e.target.checked
        : false;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleConfirmSubmit = () => {
    const newErrors: Partial<Record<keyof FormDataType, string>> = {};

    if (!form.name.trim()) newErrors.name = '- 이름을 입력해주세요.';
    if (!form.company.trim()) newErrors.company = '- 기업명을 입력해주세요.';
    if (!form.phone.trim()) newErrors.phone = '- 연락처를 입력해주세요.';
    if (!form.email.trim()) newErrors.email = '- 이메일을 입력해주세요.';
    if (!form.message.trim()) newErrors.message = '- 문의 내용을 입력해주세요.';
    // if (!form.agree)
    //   newErrors.agree = '- 개인정보 수집 및 이용에 동의해주세요.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      addToast('필수로 작성해야 하는 항목이 빠져있습니다.', 'error');
      return;
    }

    setShowModal(true);
  };

  const handleSubmit = async () => {
    setShowModal(false);
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, String(value)),
    );

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        addToast('문의가 성공적으로 전송되었습니다.', 'success');
        setForm({
          name: '',
          company: '',
          phone: '',
          email: '',
          message: '',
          // agree: false,
        });
      } else {
        addToast(result.error || '전송 중 오류가 발생했습니다.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('서버와의 통신 중 오류가 발생했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={s['section-wrap']}>
      <form className={s['form-wrap']} onSubmit={(e) => e.preventDefault()}>
        <Container>
          <div className={s['input-group-wrap']}>
            <div className={s['input-group']}>
              {/*<label>이름</label>*/}
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={s['text-input']}
                placeholder="NAME (담당자명)"
              />
              {errors.name && <p className={s['error-text']}>{errors.name}</p>}
            </div>

            <div className={s['input-group']}>
              {/*<label>기업명</label>*/}
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                className={s['text-input']}
                placeholder="COMAPNY (회사명)"
              />
              {errors.company && (
                <p className={s['error-text']}>{errors.company}</p>
              )}
            </div>
          </div>

          <div className={s['input-group-wrap']}>
            <div className={s['input-group']}>
              {/*<label>연락처</label>*/}
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={s['text-input']}
                placeholder="H.P (연락처)"
              />
              {errors.phone && (
                <p className={s['error-text']}>{errors.phone}</p>
              )}
            </div>

            <div className={s['input-group']}>
              {/*<label>이메일</label>*/}
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={s['text-input']}
                placeholder="EMAIL (이메일)"
              />
              {errors.email && (
                <p className={s['error-text']}>{errors.email}</p>
              )}
            </div>
          </div>

          <div className={s['input-group']}>
            {/*<label>문의 내용</label>*/}
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="MESSAGE (남기실 메시지)"
            />
            {errors.message && (
              <p className={s['error-text']}>{errors.message}</p>
            )}
          </div>
        </Container>

        {/*<div className={s['input-group']}>*/}
        {/*  <label className={s['checkbox-label']}>*/}
        {/*    <input*/}
        {/*      type="checkbox"*/}
        {/*      name="agree"*/}
        {/*      checked={form.agree}*/}
        {/*      onChange={handleChange}*/}
        {/*      className={s['custom-checkbox']}*/}
        {/*    />*/}
        {/*    <span className={s['checkmark']}>*/}
        {/*      <div className={s['svg-box']}>*/}
        {/*        <IconCheck />*/}
        {/*      </div>*/}
        {/*    </span>*/}
        {/*    <p>(필수)</p>*/}
        {/*    <div className={s['text-wrap']}>개인정보 수집 및 이용 동의</div>*/}
        {/*  </label>*/}
        {/*  {errors.agree && <p className={s['error-text']}>{errors.agree}</p>}*/}
        {/*</div>*/}

        <div className={s['button-wrap']}>
          <button
            className={s['submit-button']}
            type="button"
            onClick={handleConfirmSubmit}
            disabled={loading}
          >
            <Container>SEND →</Container>
          </button>
        </div>
      </form>

      <Container>
        <div className={s['message-wrap']}>
          <span className={s['message-title']}>언제든 편하게 연락주세요</span>
          <span className={s['message-sub']}>
            1–2일 이내에 반드시 답장을 드릴게요
          </span>
        </div>
      </Container>

      {/* 모달 */}
      {showModal && (
        <div className={s['modal-overlay']}>
          <div className={s['modal']}>
            <h3>문의 내용을 제출하시겠습니까?</h3>
            <p>제출 후에는 수정이 불가합니다.</p>
            <div className={s['modal-buttons']}>
              <button onClick={handleSubmit}>확인</button>
              <button onClick={() => setShowModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 토스트 */}
      <div className={s['toast-container']}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`${s['toast']} ${s[toast.type]}`}>
            {toast.message}
          </div>
        ))}
      </div>

      {/* 로딩 스피너 */}
      {loading && (
        <div className={s['global-loading']}>
          <Spinner size={48} floating />
        </div>
      )}
    </section>
  );
}
