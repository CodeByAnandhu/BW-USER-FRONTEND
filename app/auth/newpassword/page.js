'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { auth } from '@/app/lib/api';

const NewPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!newPassword || !newPassword.trim()) {
      toast.error('Please enter your new password');
      return;
    }
    if(!confirmPassword || !confirmPassword.trim()) {
      toast.error('Please enter your confirm password');
      return;
    }
    if(newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    try {
      const response = await auth.resetPassword({ email, newPassword });
      toast.success(response.data.message);
      router.push('/auth/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Password reset failed');
    }
  };

  return (
    <div className="min-h-screen font-poppins flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Set New Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter new password"
              
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Confirm new password"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPasswordPage;
