import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MenuItem, CartItem } from '@/types/canteen';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import paneerWrap from '@/assets/paneer-wrap.jpg';
import vegBiryani from '@/assets/veg-biryani.jpg';
import chickenBurger from '@/assets/chicken-burger.jpg';
import mangoJuice from '@/assets/mango-juice.jpg';
import chocolateBrownie from '@/assets/chocolate-brownie.jpg';

interface MenuCardProps {
  item: MenuItem;
}

const imageMap: Record<string, string> = {
  'paneer-wrap': paneerWrap,
  'veg-biryani': vegBiryani,
  'chicken-burger': chickenBurger,
  'mango-juice': mangoJuice,
  'chocolate-brownie': chocolateBrownie,
};

const MenuCard = ({ item }: MenuCardProps) => {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('canteen_app_v1-cart') || '[]');
    const cartItem = cart.find((i: CartItem) => i.itemId === item.id);
    setQuantity(cartItem?.quantity || 0);
  }, [item.id]);

  const updateCart = (newQuantity: number) => {
    const cart = JSON.parse(localStorage.getItem('canteen_app_v1-cart') || '[]');
    const existingItemIndex = cart.findIndex((i: CartItem) => i.itemId === item.id);

    if (newQuantity === 0) {
      if (existingItemIndex > -1) {
        cart.splice(existingItemIndex, 1);
      }
    } else {
      const cartItem: CartItem = {
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: newQuantity,
      };

      if (existingItemIndex > -1) {
        cart[existingItemIndex] = cartItem;
      } else {
        cart.push(cartItem);
      }
    }

    localStorage.setItem('canteen_app_v1-cart', JSON.stringify(cart));
    setQuantity(newQuantity);
    window.dispatchEvent(new Event('cartUpdated'));
    
    if (newQuantity > 0) {
      toast.success(`${item.name} ${newQuantity > quantity ? 'added to' : 'updated in'} cart`);
    } else {
      toast.success(`${item.name} removed from cart`);
    }
  };

  const handleAdd = () => {
    if (!item.available) {
      toast.error('This item is currently unavailable');
      return;
    }
    updateCart(quantity + 1);
  };

  const handleRemove = () => {
    if (quantity > 0) {
      updateCart(quantity - 1);
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image ? imageMap[item.image] : paneerWrap}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {!item.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">
              Unavailable
            </Badge>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-primary-foreground">
            ₹{item.price}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{item.name}</h3>
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          )}
          {!item.available && item.unavailableNote && (
            <p className="text-xs text-warning mt-1">{item.unavailableNote}</p>
          )}
        </div>

        {item.available ? (
          quantity === 0 ? (
            <Button onClick={handleAdd} className="w-full">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          ) : (
            <div className="flex items-center justify-between bg-primary/10 rounded-lg p-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRemove}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-lg px-4">{quantity}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleAdd}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )
        ) : (
          <Button disabled className="w-full">
            Currently Unavailable
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MenuCard;
