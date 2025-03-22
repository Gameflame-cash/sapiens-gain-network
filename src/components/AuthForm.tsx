
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type User = {
  id: number;
  username: string;
  balance: number;
  referrer: string | null;
  created_at: string;
};

const AuthForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [referrer, setReferrer] = useState('');
  const navigate = useNavigate();

  // Mock user database (would connect to backend in production)
  const mockRegister = async (username: string, password: string, referrer: string) => {
    const users = JSON.parse(localStorage.getItem('sapiens_users') || '[]');
    
    // Check if user already exists
    if (users.some((user: User) => user.username === username)) {
      return { success: false, message: 'Username already exists' };
    }
    
    const newUser = {
      id: Date.now(),
      username,
      password, // In a real app, this would be hashed
      balance: 0,
      referrer: referrer || null,
      created_at: new Date().toISOString(),
      referrals: [],
      lastStakingReward: null,
      depositAmount: 0
    };
    
    users.push(newUser);
    localStorage.setItem('sapiens_users', JSON.stringify(users));
    
    // If referrer exists, add bonus to referrer
    if (referrer) {
      const referrerUser = users.find((user: any) => user.username === referrer);
      if (referrerUser) {
        referrerUser.referrals = [...(referrerUser.referrals || []), username];
        referrerUser.balance += 10; // $10 referral bonus
        localStorage.setItem('sapiens_users', JSON.stringify(users));
      }
    }
    
    return { success: true, user: newUser };
  };
  
  const mockLogin = async (username: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('sapiens_users') || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);
    
    if (user) {
      return { success: true, user };
    } else {
      return { success: false, message: 'Invalid credentials' };
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      const result = await mockRegister(username, password, referrer);
      
      if (result.success) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred during registration');
      console.error(error);
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      const result = await mockLogin(username, password);
      
      if (result.success) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred during login');
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-card animate-in">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" className="text-lg">Login</TabsTrigger>
          <TabsTrigger value="register" className="text-lg">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="text" 
                  placeholder="Username" 
                  className="glass-input text-lg h-12"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="Password" 
                  className="glass-input text-lg h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full glass-button text-lg h-12">
                Login
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        <TabsContent value="register">
          <form onSubmit={handleRegister}>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Create Account</CardTitle>
              <CardDescription className="text-center">Enter your details to create a new account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="text" 
                  placeholder="Username" 
                  className="glass-input text-lg h-12"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="Password" 
                  className="glass-input text-lg h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input 
                  type="text" 
                  placeholder="Referrer (optional)" 
                  className="glass-input text-lg h-12"
                  value={referrer}
                  onChange={(e) => setReferrer(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full glass-button text-lg h-12">
                Register
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
