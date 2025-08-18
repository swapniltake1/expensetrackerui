import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-primary rounded-full glow-primary">
            <DollarSign className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          onClick={() => window.location.href = '/'}
          className="btn-gradient-primary"
        >
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
