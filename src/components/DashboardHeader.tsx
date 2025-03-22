
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  username: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="w-full py-6 px-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-medium">Welcome, <span className="text-primary">{username}</span></h1>
          <p className="text-muted-foreground">Sapiens NFT Dashboard</p>
        </div>
      </div>
      <Button 
        variant="outline" 
        className="flex items-center gap-2 border border-gray-200 shadow-sm hover:shadow-md transition-all" 
        onClick={handleLogout}
      >
        <LogOut size={16} />
        <span>Logout</span>
      </Button>
    </header>
  );
};

export default DashboardHeader;
