
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Background from "@/components/Background";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Background>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-card p-8 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-6">The page you're looking for doesn't exist</p>
          <Button 
            className="glass-button"
            onClick={() => navigate("/")}
          >
            Return to Home
          </Button>
        </div>
      </div>
    </Background>
  );
};

export default NotFound;
