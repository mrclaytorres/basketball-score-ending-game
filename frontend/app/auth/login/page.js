"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password
    });
    if (result.ok) {
      router.push('/');
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center sm:w-1/2">
        <div className="bg-gray-800 p-10 rounded-lg shadow-md sm:w-1/2 max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300 mb-4"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <div className="text-center mt-4">
        Don't have an account?
        <a href="/auth/register" className="m-4 hover:underline">
          Register
        </a>
      </div>
    </div>
  );
}
