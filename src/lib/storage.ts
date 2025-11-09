import { Student, MenuItem, HistoryEntry, Rating, College, InventoryItem } from '@/types/canteen';

const STORAGE_PREFIX = 'canteen_app_v1';

// Storage keys
export const KEYS = {
  STUDENTS: `${STORAGE_PREFIX}-students`,
  COLLEGES: `${STORAGE_PREFIX}-colleges`,
  MENU_VEG: `${STORAGE_PREFIX}-menu-veg`,
  MENU_NONVEG: `${STORAGE_PREFIX}-menu-nonveg`,
  MENU_JUICES: `${STORAGE_PREFIX}-menu-juices`,
  MENU_DESSERTS: `${STORAGE_PREFIX}-menu-desserts`,
  HISTORY: `${STORAGE_PREFIX}-history`,
  RATINGS: `${STORAGE_PREFIX}-ratings`,
  INVENTORY: `${STORAGE_PREFIX}-inventory`,
  CURRENT_USER: `${STORAGE_PREFIX}-current-user`,
  CURRENT_STUDENT: `${STORAGE_PREFIX}-current-student`,
};

// Generic storage functions
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Initialize default data
export const initializeDefaultData = () => {
  // Initialize students if empty
  const students = getFromStorage<Student[]>(KEYS.STUDENTS, []);
  if (students.length === 0) {
    saveToStorage(KEYS.STUDENTS, [
      {
        studentId: 'S2025001',
        name: 'Anita Rao',
        college: "Devil's Kitchen",
        email: 'anita@example.com',
        year: '2nd Year',
        preferences: 'Vegetarian',
      },
    ]);
  }

  // Initialize colleges if empty
  const colleges = getFromStorage<College[]>(KEYS.COLLEGES, []);
  if (colleges.length === 0) {
    saveToStorage(KEYS.COLLEGES, [
      { collegeName: "Devil's Kitchen", password: 'demo' },
    ]);
  }

  // Initialize menu items if empty
  const vegMenu = getFromStorage<MenuItem[]>(KEYS.MENU_VEG, []);
  if (vegMenu.length === 0) {
    saveToStorage(KEYS.MENU_VEG, [
      {
        id: 'veg01',
        name: 'Paneer Wrap',
        price: 70,
        category: 'Vegetarian',
        image: 'paneer-wrap',
        available: true,
        description: 'Grilled paneer, veggies and sauces in a wrap.',
      },
      {
        id: 'veg02',
        name: 'Veg Biryani',
        price: 90,
        category: 'Vegetarian',
        image: 'veg-biryani',
        available: true,
        description: 'Aromatic basmati rice with mixed vegetables and spices.',
      },
      {
        id: 'veg03',
        name: 'Masala Dosa',
        price: 60,
        category: 'Vegetarian',
        image: 'masala-dosa',
        available: true,
        description: 'Crispy dosa with spiced potato filling, served with sambar.',
      },
    ]);
  }

  const nonVegMenu = getFromStorage<MenuItem[]>(KEYS.MENU_NONVEG, []);
  if (nonVegMenu.length === 0) {
    saveToStorage(KEYS.MENU_NONVEG, [
      {
        id: 'nonveg01',
        name: 'Chicken Burger',
        price: 120,
        category: 'Non-Vegetarian',
        image: 'chicken-burger',
        available: true,
        description: 'Juicy chicken patty with fresh vegetables.',
      },
      {
        id: 'nonveg02',
        name: 'Tandoori Chicken',
        price: 150,
        category: 'Non-Vegetarian',
        image: 'tandoori-chicken',
        available: true,
        description: 'Spicy grilled chicken marinated in tandoori spices.',
      },
    ]);
  }

  const juicesMenu = getFromStorage<MenuItem[]>(KEYS.MENU_JUICES, []);
  if (juicesMenu.length === 0) {
    saveToStorage(KEYS.MENU_JUICES, [
      {
        id: 'juice01',
        name: 'Fresh Mango Juice',
        price: 50,
        category: 'Juices',
        image: 'mango-juice',
        available: true,
        description: 'Freshly squeezed mango juice.',
      },
      {
        id: 'juice02',
        name: 'Smoothie Bowl',
        price: 80,
        category: 'Juices',
        image: 'smoothie-bowl',
        available: true,
        description: 'Refreshing strawberry smoothie bowl with toppings.',
      },
    ]);
  }

  const dessertsMenu = getFromStorage<MenuItem[]>(KEYS.MENU_DESSERTS, []);
  if (dessertsMenu.length === 0) {
    saveToStorage(KEYS.MENU_DESSERTS, [
      {
        id: 'des01',
        name: 'Chocolate Brownie',
        price: 40,
        category: 'Desserts',
        image: 'chocolate-brownie',
        available: true,
        description: 'Rich chocolate brownie with chocolate sauce.',
      },
      {
        id: 'des02',
        name: 'Rainbow Cake',
        price: 60,
        category: 'Desserts',
        image: 'rainbow-cake',
        available: true,
        description: 'Colorful layered cake slice, perfect for celebrations.',
      },
    ]);
  }
};
