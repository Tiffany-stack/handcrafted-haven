"use client";
import { Metadata } from "next";
import { FaEnvelope, FaLock } from "react-icons/fa"; // Import icons
import { useState } from "react";
{/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
import styles from './home.module.css';
{/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
import { truncate } from "fs/promises";

export const metadata: Metadata = {
  title: 'Login',
};

export function LoginForm() {
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if(event.target.type == "email") {
      setFocusEmail(true);
    } else if(event.target.type == "password") {
      setFocusPassword(true);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    console.log(event.target.autocomplete)
    if(event.target.type == "email") {
      setFocusEmail(false);
    } else if(event.target.type == "password") {
      setFocusPassword(false);
    }
  };

  return (
    <form className="bg-white rounded-b-lg shadow-lg p-6 space-y-6">

      {/* Login Title */}
      <h2 className="text-xl font-bold text-center text-gray-800">Login</h2>

      {/* Email Input */}
      <div className={`relative flex items-center border border-gray-300 gap-2 bg-white rounded-md ${focusEmail ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="flex items-center justify-center pl-4">
          <FaEnvelope className="text-gray-400" />
        </div>
        <input
          type="email"
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full py-3 pr-2  border-none rounded-md text-gray-800 focus:outline-none bg-white placeholder-gray-500"
          placeholder="Email address"
        />
      </div>

      {/* Password Input */}
      <div className={`relative flex items-center border border-gray-300 gap-2 bg-white rounded-md ${focusPassword ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="flex items-center justify-center pl-4">
          <FaLock className="text-gray-400" />
        </div>
        <input
          type="password"
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full py-3 pr-2 border-none rounded-md text-gray-800 focus:outline-none bg-white placeholder-gray-500"
          placeholder="Password"
        />
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <input type="checkbox" id="remember" className="h-4 w-4" />
          <label htmlFor="remember" className="text-sm text-black ml-2">Remember me</label>
        </div>
        <a href="#!" className="text-sm text-blue-500 hover:underline">Forgot password?</a>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full py-3 bg-yellow-500 text-white rounded-md font-semibold hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Sign in
      </button>

      {/* Create Account Button */}
      <p className="text-center text-sm text-gray-800">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Don't have an account? <a href="#!" className="text-blue-500 hover:underline">Create an account</a>
      </p>

    </form>
  );
}