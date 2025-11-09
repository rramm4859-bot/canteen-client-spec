import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItem, HistoryEntry, Student } from '@/types/canteen';
import { getFromStorage, saveToStorage, KEYS } from '@/lib/storage';
import { toast } from 'sonner';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import Layout from '@/components/Layout';

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
    loadCurrentStudent();
  }, []);

  const loadCart = () => {
    const cart = getFromStorage<CartItem[]>('canteen_app_v1-cart', []);
    setCartItems(cart);
  };

  const loadCurrentStudent = () => {
    const student = getFromStorage<Student | null>(KEYS.CURRENT_STUDENT, null);
    setCurrentStudent(student);
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(itemId);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.itemId === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    saveToStorage('canteen_app_v1-cart', updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (itemId: string) => {
    const updatedCart = cartItems.filter((item) => item.itemId !== itemId);
    setCartItems(updatedCart);
    saveToStorage('canteen_app_v1-cart', updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success('Item removed from cart');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = () => {
    if (!currentStudent) {
      toast.error('Please select a student first');
      navigate('/dashboard');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const order: HistoryEntry = {
      entryId: `ORD${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'order',
      studentId: currentStudent.studentId,
      studentName: currentStudent.name,
      items: cartItems,
      status: 'pending',
      total: calculateTotal(),
    };

    const history = getFromStorage<HistoryEntry[]>(KEYS.HISTORY, []);
    history.unshift(order);
    saveToStorage(KEYS.HISTORY, history);

    // Clear cart
    setCartItems([]);
    saveToStorage('canteen_app_v1-cart', []);
    window.dispatchEvent(new Event('cartUpdated'));

    toast.success('Order placed successfully!');
    navigate('/history');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <ShoppingCart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Shopping Cart</h2>
            <p className="text-muted-foreground">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
            </p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">Add some delicious items to get started!</p>
              <Button onClick={() => navigate('/menu/vegetarian')}>Browse Menu</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.itemId}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold px-3">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold">₹{item.price * item.quantity}</p>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.itemId)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <Card className="h-fit sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {currentStudent ? `For ${currentStudent.name}` : 'No student selected'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">₹{calculateTotal()}</span>
                  </div>
                </div>

                <Button onClick={handlePlaceOrder} className="w-full">
                  Place Order
                </Button>

                {!currentStudent && (
                  <p className="text-xs text-warning text-center">
                    Please select a student from the dashboard first
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
