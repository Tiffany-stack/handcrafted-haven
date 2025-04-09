"use client";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Dispatch, SetStateAction, useActionState, useState } from "react";
import { login } from "../actions/auth";


interface LoginFormProps {
  readonly setIsLogin: Dispatch<SetStateAction<boolean>>;
}

export function LoginForm({ setIsLogin }: LoginFormProps) {
  const [state, action, pending] = useActionState(login, undefined)
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.name === "email") {
      setFocusEmail(true);
    } else if (event.target.name === "password") {
      setFocusPassword(true);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.name === "email") {
      setFocusEmail(false);
    } else if (event.target.name === "password") {
      setFocusPassword(false);
    }
  };

  const handleClearFields = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Access the form and reset it
    const form = e.currentTarget.form;  // Get the form that contains the button
    form?.reset();  // Reset the form fields
  };

  return (
    <form action={action} className="bg-white rounded-b-lg shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-center text-gray-800">Login</h2>
      
      {/* Email Input */}
      <div className={`relative flex items-center border border-gray-300 gap-2 bg-white rounded-md ${focusEmail ? "ring-2 ring-blue-500" : ""}`}>
        <div className="flex items-center justify-center pl-4">
          <FaEnvelope className="text-gray-400" />
        </div>
        <input
          type="email"
          name="email"
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full py-3 pr-2 border-none rounded-md text-gray-800 focus:outline-none bg-white placeholder-gray-500"
          placeholder="Email address"
        />
      </div>
      {state?.errors?.email && <p className="text-red-500 text-sm mt-2">{state.errors.email}</p>}

      {/* Password Input */}
      <div className={`relative flex items-center border border-gray-300 gap-2 bg-white rounded-md ${focusPassword ? "ring-2 ring-blue-500" : ""}`}>
        <div className="flex items-center justify-center pl-4">
          <FaLock className="text-gray-400" />
        </div>
        <input
          type="password"
          name="password"
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full py-3 pr-2 border-none rounded-md text-gray-800 focus:outline-none bg-white placeholder-gray-500"
          placeholder="Password"
        />
      </div>
      {state?.errors?.password && (
        <div>
          <p className="text-red-500 text-sm mt-2 font-semibold">Password must:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error} className="text-red-500 text-sm mt-2">- {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Remember Me & Forgot Password */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <input type="checkbox" id="remember" className="h-4 w-4" />
          <label htmlFor="remember" className="text-sm text-black ml-2">Remember me</label>
        </div>
        {/* <a href="/" className="text-sm text-blue-500 hover:underline">Forgot password?</a> */}
      </div>

      {/* Submit Button */}
      <button disabled={ pending } type="submit" className="w-full py-3 bg-yellow-500 text-white rounded-md font-semibold hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Sign in</button>
      {/* Toggle to Create Account */}
      <p className="text-center text-sm text-gray-800">
        <span>Don&apos;t have an account?</span>
          <button
            type="button"
            onClick={(e) => {
              handleClearFields(e); // Clear the fields
              setIsLogin(false);   // Set the state
            }}
            className="text-blue-500 hover:underline ml-1"
          >
            Create an account
          </button>
      </p>
    </form>
  );
}