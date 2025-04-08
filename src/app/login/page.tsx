"use client";
import { CreateAccountForm } from '../ui/create.account-form';
import { LoginForm } from '../ui/login-form';
import { useState } from 'react';

export default function LoginPage() {
  // State to track whether to display the login or create account form
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="min-h-screen py-16 bg-gray-50">
      <div className="mx-auto flex py-16 max-w-[400px] flex-col">
        
        {/* Background Image Section */}
        <div className="w-full h-40 md:h-60 bg-[url(./heroImage.jpg)] bg-cover bg-center rounded-t-lg"></div>

        {/* Conditionally render LoginForm or CreateAccountForm */}
        {isLogin ? (
          <LoginForm setIsLogin={setIsLogin} />
        ) : (
          <CreateAccountForm setIsLogin={setIsLogin} />
        )}
      </div>
    </main>
  );
}