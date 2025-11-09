import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getFromStorage, saveToStorage, KEYS, initializeDefaultData } from '@/lib/storage';
import { College } from '@/types/canteen';
import { UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';
import heroImage from '@/assets/canteen-hero.jpg';

const Login = () => {
  const [collegeName, setCollegeName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Initialize default data on component mount
  useState(() => {
    initializeDefaultData();
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const colleges = getFromStorage<College[]>(KEYS.COLLEGES, []);
    const college = colleges.find(
      (c) => c.collegeName.toLowerCase() === collegeName.toLowerCase() && c.password === password
    );

    if (college) {
      saveToStorage(KEYS.CURRENT_USER, college.collegeName);
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid college name or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Hero Section */}
      <div className="lg:w-1/2 relative overflow-hidden">
        <img 
          src={heroImage} 
          alt="College Canteen" 
          className="w-full h-64 lg:h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/40 flex items-end lg:items-center p-8 lg:p-12">
          <div className="text-primary-foreground">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">College Canteen</h1>
            <p className="text-lg lg:text-xl opacity-95">
              Delicious meals, easy ordering, and happy students
            </p>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <UtensilsCrossed className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your college credentials to access the canteen system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="collegeName">College Name</Label>
                <Input
                  id="collegeName"
                  type="text"
                  placeholder="XYZ College"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Demo credentials: XYZ College / demo
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
