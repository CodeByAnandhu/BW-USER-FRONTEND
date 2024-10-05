'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/app/lib/api';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!email || !email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    if(!password || !password.trim() ) {
      toast.error('Please enter your password');
      return;
    }
  
    try {
      const response = await auth.login({ email, password });
      localStorage.setItem('token', response.data.token); 
      document.cookie = `token=${response.data.token}; path=/`;
      toast.success('Login successful');
      router.push('/dashboard');
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || 'An error occurred');
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="text-center space-y-2">
          <div>
            <Link href="/auth/register" className="text-indigo-600 hover:text-indigo-500">
              Don't have an account? Register
            </Link>
          </div>
          <div>
            <Link href="/auth/email" className="text-indigo-600 hover:text-indigo-500">
              Forgot your password? Reset it here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}