"use client"
import { useState } from 'react';
import { auth } from '../../lib/api';  
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const OTPInput = ({ length }) => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');   

  const router = useRouter();

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setOtp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email || !email.trim()) {
      toast.error('Please enter your email and OTP');
      return;
    }
    if(!otp || !otp.trim()) {
      toast.error('Please enter your OTP');
      return;
    }
      try {
      

        const response = await auth.verifyOtp({ email, otp });
        toast.success(response.data.message);
        router.push(`/auth/newpassword?email=${encodeURIComponent(email)}`); 
      } catch (error) {
        toast.error(error.response?.data?.error || 'Verification failed');
      }
    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-poppins">
      <h1 className="text-2xl font-semibold mb-8 text-gray-800">Enter Email and Verification Code</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <input
          type="text"
          className="w-full px-4 py-3 text-lg font-medium text-gray-700 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors mb-6"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          
        />
        <input
          type="tel"
          placeholder='Enter OTP'
          className="w-full px-4 py-3 text-lg font-medium text-gray-700 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors mb-6"
          value={otp}
          onChange={handleChange}
          maxLength={length}
        
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Verify
        </button>
      </form>
      <p className="mt-6 text-sm text-gray-600">
        Didn't receive the code? <a href="#" className="text-blue-500 hover:underline">Resend</a>
      </p>
    </div>
  );
};

export default OTPInput;
