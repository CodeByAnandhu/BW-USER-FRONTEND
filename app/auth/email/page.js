"use client"
import { useState } from 'react';
import { auth } from '../../lib/api';  
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');  
  const [loading, setLoading] = useState(false);  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if(!email || !email.trim()) {
      toast.error('Please enter your email');
      setLoading(false);
      return;
    }
    try {
      const response = await auth.resetPasswordRequest(email);
      setMessage(response.data.message);  
      toast.success('Password reset email sent');
      router.push('/auth/otp');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      setMessage(error.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-poppins flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}  
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        {message && (
          <div className="mt-4 text-center text-sm text-gray-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
