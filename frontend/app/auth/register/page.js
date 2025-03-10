"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', form);
      router.push('/auth/login');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center sm:w-1/2">
        <div className="bg-gray-800 p-10 rounded-lg shadow-md sm:w-1/2 max-w-md">
          <h2 className='text-center p-10 text-xl'>Create an Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" name="name" placeholder="Name" onChange={handleChange} required />
            <input className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <div className='text-center mt-10'>
              <button type="submit" className=''>Register</button>
            </div>
          </form>
        </div>
      </div>
      <div className="text-center mt-4">
        Already have an account?
        <a href="/auth/login" className="m-4 hover:underline">
          Login
        </a>
      </div>
    </div>
  );
}
