import React from 'react';
import { useSupabaseAuth } from '../providers/SupabaseProvider';
import LoginButton from './LoginButton';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user } = useSupabaseAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-semibold mb-4">Welcome to AI Agent System</h2>
        <p className="text-gray-600 mb-8">Please sign in to continue</p>
        <LoginButton />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;