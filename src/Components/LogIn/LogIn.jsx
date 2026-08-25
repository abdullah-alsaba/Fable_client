"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import logInImg from "@/assets/logInImage.png";
import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const LogIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#eae2d5] p-4 sm:p-6 md:p-8">
      <div className="flex w-full max-w-225 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:min-h-145 md:flex-row">
        {/* Desktop Left Image Section */}
        <section className="relative hidden w-full overflow-hidden select-none md:block md:w-1/2">
          <Image
            src={logInImg}
            alt="A book on a wooden table"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 450px"
            className="object-cover object-center"
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/15 to-transparent" />

          <div className="absolute left-8 top-7 z-10">
            <span className="font-playfair text-[20px] font-bold tracking-tight text-[#090e14]">
              Fable
            </span>
          </div>
        </section>

        {/* Right Form Section (Mobile & Desktop) */}
        <section className="flex w-full flex-col justify-center bg-white px-6 py-8 sm:px-10 sm:py-10 md:w-1/2 md:px-10 lg:px-12">
          <div className="mx-auto w-full max-w-[320px]">
            {/* Mobile Logo */}
            <div className="mb-4 text-center md:hidden">
              <span className="font-playfair text-2xl font-bold tracking-tight text-[#090e14]">
                Fable
              </span>
            </div>

            <div className="mb-6">
              <h1 className="font-playfair text-2xl font-bold leading-tight tracking-tight text-[#090e14] sm:text-[30px] md:text-[32px]">
                Welcome Back
              </h1>

              <p className="mt-1.5 text-xs text-[#5b5b5b]">
                Sign in to continue your reading journey.
              </p>
            </div>

            <Form className="flex w-full flex-col gap-4">
              <TextField
                isRequired
                name="email"
                type="email"
                validate={(value) => {
                  if (!value) return "Email is required";
                  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                    return "Please enter a valid email address";
                  }
                  return null;
                }}
              >
                <Label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#171717]">
                  Email <span className="text-red-500">*</span>
                </Label>

                <Input
                  placeholder="reader@fable.com"
                  className="h-10 w-full rounded-lg bg-[#e8e7e5] px-3.5 text-xs text-[#090e14] placeholder:text-[#999999] focus:bg-white focus:outline-none transition-all"
                />

                <FieldError className="mt-1 text-[11px] font-medium text-red-500" />
              </TextField>

              <TextField
                isRequired
                minLength={8}
                name="password"
                type={showPassword ? "text" : "password"}
                validate={(value) => {
                  if (!value) return "Password is required";
                  if (value.length < 8) {
                    return "Password must be at least 8 characters";
                  }
                  return null;
                }}
              >
                <div className="mb-1 flex items-center justify-between">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-[#171717]">
                    Password <span className="text-red-500">*</span>
                  </Label>

                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-semibold text-[#a2753b] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    placeholder="••••••••"
                    className="h-10 w-full rounded-lg bg-[#e8e7e5] pl-3.5 pr-10 text-xs text-[#090e14] placeholder:text-[#999999] focus:bg-white focus:outline-none transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#111111] transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>

                <FieldError className="mt-1 text-[11px] font-medium text-red-500" />
              </TextField>

              <Button
                type="submit"
                className="mt-1 flex h-10 w-full cursor-pointer items-center justify-center rounded-lg bg-[#050d16] text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#182230] active:scale-[0.99]"
              >
                LOGIN
              </Button>
            </Form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#e2e2e0]" />

              <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-wider text-[#777777]">
                Or Continue With
              </span>

              <div className="h-px flex-1 bg-[#e2e2e0]" />
            </div>

            <button
              type="button"
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-[#dedede] bg-white text-xs font-medium text-[#222222] shadow-2xs transition-all hover:bg-[#fcfbf9] active:scale-[0.99]"
            >
              <GoogleIcon />
              <span>Google</span>
            </button>

            <p className="mt-6 text-center text-xs text-[#555555]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#090e14] underline underline-offset-2 hover:text-[#a2753b]"
              >
                Create Account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LogIn;
