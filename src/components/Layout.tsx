import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, User, History, Star, LogOut, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('canteen_app_v1-cart') || '[]');
      const total = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(total);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('canteen_app_v1-current-user');
    navigate('/');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Student', icon: User },
    { to: '/menu/vegetarian', label: 'Veg Menu', icon: UtensilsCrossed },
    { to: '/menu/non-vegetarian', label: 'Non-Veg', icon: UtensilsCrossed },
    { to: '/menu/juices', label: 'Juices', icon: UtensilsCrossed },
    { to: '/menu/desserts', label: 'Desserts', icon: UtensilsCrossed },
    { to: '/history', label: 'History', icon: History },
    { to: '/ratings', label: 'Ratings', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold">College Canteen</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {cartCount > 0 && (
                <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container px-4">
          <div className="flex overflow-x-auto scrollbar-hide gap-1 py-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent whitespace-nowrap"
                activeClassName="bg-primary text-primary-foreground hover:bg-primary"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
