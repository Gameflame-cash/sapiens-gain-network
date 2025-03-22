
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, ArrowLeft } from 'lucide-react';

interface AdminAuthProps {
  onAuthenticate: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthenticate }) => {
  const [adminPassword, setAdminPassword] = useState('');
  const navigate = useNavigate();

  const handleAdminAuth = () => {
    // Simple admin password for demo
    if (adminPassword === 'admin12345') {
      onAuthenticate();
      toast.success('Admin access granted');
    } else {
      toast.error('Invalid admin password');
    }
  };

  return (
    <Card className="w-full glass-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5 text-primary" /> Admin Access
        </CardTitle>
        <CardDescription>Enter admin password to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input 
          type="password" 
          placeholder="Admin Password" 
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          className="glass-input"
        />
        <Button onClick={handleAdminAuth} className="w-full glass-button">
          Authenticate
        </Button>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminAuth;
