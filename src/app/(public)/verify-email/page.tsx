'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  MailCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  RefreshCw,
  Clock,
} from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const redirectUrl = searchParams.get('redirect') || '';

  const [email, setEmail] = useState(emailParam);
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
  }, [emailParam]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '');

    // If pasted full 6 digits
    if (cleanVal.length >= 6) {
      const codeArr = cleanVal.slice(0, 6).split('');
      setDigits(codeArr);
      if (inputRefs.current[5]) inputRefs.current[5].focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleanVal.slice(-1);
    setDigits(newDigits);

    // Auto-advance to next input
    if (cleanVal && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = digits.join('');

    if (code.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    if (!email) {
      setErrorMessage('Email address is missing. Please re-enter your email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setResendStatus(null);

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Verification failed');
      }

      setIsSuccess(true);
      // Wait 1.5s then redirect to requested listing or dashboard
      setTimeout(() => {
        router.push(redirectUrl || '/dashboard');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please check your code and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !email) return;
    setResendStatus(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to resend code');

      setResendStatus(json.message || 'A new verification code has been dispatched to your email.');
      setResendCooldown(60); // 60 seconds cooldown
      setDigits(['', '', '', '', '', '']);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend verification code');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 shadow-sm mx-auto">
          <MailCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verify your email</h1>
        <p className="text-sm text-slate-600 max-w-sm mx-auto">
          We&apos;ve sent a 6-digit verification code to your email address:
          <span className="block font-bold text-slate-900 mt-1">{email || 'your registered email'}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200/80 sm:px-10">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Email Verified!</h2>
              <p className="text-sm text-slate-600">
                Your Rentals Kenya account has been verified. Redirecting you now...
              </p>
              <div className="pt-2">
                <Loader2 className="w-6 h-6 animate-spin text-sky-600 mx-auto" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {resendStatus && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>{resendStatus}</span>
                </div>
              )}

              {/* Email field if not provided in URL */}
              {!emailParam && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              )}

              {/* 6-Digit Segmented Code Input */}
              <div>
                <label className="block text-center text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Enter 6-Digit Code
                </label>
                <div className="flex justify-center items-center gap-2 sm:gap-3" onPaste={handlePaste}>
                  {digits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center text-2xl font-black text-slate-900 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 transition-all bg-slate-50/50"
                    />
                  ))}
                </div>
                <p className="text-center text-[11px] text-slate-500 mt-2 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Code expires in 10 minutes</span>
                </p>
              </div>

              {/* Verify Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || digits.join('').length !== 6}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white bg-sky-600 hover:bg-sky-500 font-bold text-sm shadow-md shadow-sky-600/20 active:scale-[0.99] disabled:opacity-60 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Email</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Resend Code Section */}
              <div className="pt-2 border-t border-slate-100 text-center space-y-2">
                <p className="text-xs text-slate-500">Didn&apos;t receive the code?</p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 disabled:text-slate-400 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
                  <span>
                    {resendCooldown > 0
                      ? `Resend Code in ${resendCooldown}s`
                      : 'Resend Code'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
