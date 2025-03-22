
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import Background from '@/components/Background';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <Background>
      <div className="container max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-md text-center mb-12 animate-slide-in-up">
            <h1 className="text-4xl font-bold mb-4">Sapiens NFT</h1>
            <p className="text-lg text-muted-foreground">The future of digital ownership and referral rewards</p>
          </div>
          <div className="w-full max-w-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <AuthForm />
          </div>
        </div>
      </div>
    </Background>
  );
};

export default Index;
