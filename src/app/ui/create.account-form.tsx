"use client";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Dispatch, SetStateAction, useActionState, useState } from "react";
import { signup } from "../actions/auth";

interface CreateAccountFormProps {
  readonly setIsLogin: Dispatch<SetStateAction<boolean>>;
}

export function CreateAccountForm({ setIsLogin }: CreateAccountFormProps) {
  const [state, action, pending] = useActionState(signup, undefined)
  const [focusFname, setFocusFname] = useState(false);
  const [focusLname, setFocusLname] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.name === "fname") {
      setFocusFname(true);
    } else if (event.target.name === "lname") {
      setFocusLname(true);
    } else if (event.target.name === "email") {
      setFocusEmail(true);
    } else if (event.target.name === "password") {
      setFocusPassword(true);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.name === "fname") {
      setFocusFname(false);
    } else if (event.target.name === "lname") {
      setFocusLname(false);
    } else if (event.target.name === "email") {
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
      <h2 className="text-xl font-bold text-center text-gray-800">Create Account</h2>

      {/* Fisrt Name Input */}
      <div className={`relative flex items-center border border-gray-300 gap-2 bg-white rounded-md ${focusFname ? "ring-2 ring-blue-500" : ""}`}>
        <div className="flex items-center justify-center pl-4">
          <FaUser className="text-gray-400" />
        </div>
        <input
          type="text"
          name="fname"
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full py-3 pr-2 border-none rounded-md text-gray-800 focus:outline-none bg-white placeholder-gray-500"
          placeholder="First Name"
        />
      </div>
      {state?.errors?.fname && <p className="text-red-500 text-sm mt-2">{state.errors.fname}</p>}

      {/* Name Input */}
      <div className={`relative flex items-center border border-gray-300 gap-2 bg-white rounded-md ${focusLname ? "ring-2 ring-blue-500" : ""}`}>
        <div className="flex items-center justify-center pl-4">
          <FaUser className="text-gray-400" />
        </div>
        <input
          type="text"
          name="lname"
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full py-3 pr-2 border-none rounded-md text-gray-800 focus:outline-none bg-white placeholder-gray-500"
          placeholder="Last Name"
        />
      </div>
      {state?.errors?.lname && <p className="text-red-500 text-sm mt-2">{state.errors.lname}</p>}

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
            {state.errors.password.map((error: string) => (
              <li key={error} className="text-red-500 text-sm mt-2">- {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <button disabled={pending} type="submit" className="w-full py-3 bg-yellow-500 text-white rounded-md font-semibold hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Create Account</button>

      {/* Toggle to Login */}
      <p className="text-center text-sm text-gray-800">
        <span>Already have an account?</span>
        <button
            type="button"
            onClick={(e) => {
              handleClearFields(e);
              setIsLogin(true);
            }}
            className="text-blue-500 hover:underline ml-1"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}