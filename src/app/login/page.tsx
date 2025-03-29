import { LoginForm } from '../ui/login-form';

export default function LoginPage() {
  return (
    <main className="min-h-screen py-16 bg-gray-50">
      <div className="mx-auto flex py-16 max-w-[400px] flex-col">
        
        {/* Background Image Section */}
        <div className="w-full h-40 md:h-60 bg-[url(./heroImage.jpg)] bg-cover bg-center rounded-t-lg"></div>

        {/* Direct rendering of LoginForm */}
        <LoginForm />
      </div>
    </main>
  );
}