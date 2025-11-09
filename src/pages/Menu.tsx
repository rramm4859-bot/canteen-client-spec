import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getFromStorage, KEYS } from '@/lib/storage';
import { MenuItem } from '@/types/canteen';
import MenuCard from '@/components/MenuCard';
import Layout from '@/components/Layout';
import { UtensilsCrossed } from 'lucide-react';

const Menu = () => {
  const { category } = useParams<{ category: string }>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categoryTitle, setCategoryTitle] = useState('');

  useEffect(() => {
    loadMenu();
  }, [category]);

  const loadMenu = () => {
    let items: MenuItem[] = [];
    let title = '';

    switch (category?.toLowerCase()) {
      case 'vegetarian':
        items = getFromStorage<MenuItem[]>(KEYS.MENU_VEG, []);
        title = 'Vegetarian Menu';
        break;
      case 'non-vegetarian':
        items = getFromStorage<MenuItem[]>(KEYS.MENU_NONVEG, []);
        title = 'Non-Vegetarian Menu';
        break;
      case 'juices':
        items = getFromStorage<MenuItem[]>(KEYS.MENU_JUICES, []);
        title = 'Juices & Drinks';
        break;
      case 'desserts':
        items = getFromStorage<MenuItem[]>(KEYS.MENU_DESSERTS, []);
        title = 'Desserts';
        break;
      default:
        title = 'Menu';
    }

    setMenuItems(items);
    setCategoryTitle(title);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{categoryTitle}</h2>
            <p className="text-muted-foreground">
              {menuItems.length} items available
            </p>
          </div>
        </div>

        {menuItems.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items found in this category</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Menu;
