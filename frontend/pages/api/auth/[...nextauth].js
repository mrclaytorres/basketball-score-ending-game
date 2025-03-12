import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return { id: user._id.toString(), name: user.name, email: user.email };
        }
        throw new Error('Invalid email or password');
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
  },
  // Modify your NextAuth options to include a callbacks object
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;  // Store user ID in the token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;  // Attach user ID to session object
      }
      return session;
    }
  }
};

export default NextAuth(authOptions);
