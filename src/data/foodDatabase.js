export const FOOD_DATABASE = [
    // Breads & Grains
    { name: 'Roti (Whole Wheat)', unit: 'piece', calories: 104, protein: 3, carbs: 22, fats: 0.5, default_size: 1 },
    { name: 'Chapati (Medium)', unit: 'piece', calories: 120, protein: 3.5, carbs: 25, fats: 1, default_size: 1 },
    { name: 'Paratha (Plain)', unit: 'piece', calories: 180, protein: 4, carbs: 28, fats: 6, default_size: 1 },
    { name: 'Paratha (Aloo)', unit: 'piece', calories: 210, protein: 5, carbs: 35, fats: 7, default_size: 1 },
    { name: 'Rice (White, Cooked)', unit: 'grams', calories: 130, protein: 2.7, carbs: 28, fats: 0.3, default_size: 100 },
    { name: 'Rice (Brown, Cooked)', unit: 'grams', calories: 111, protein: 2.6, carbs: 23, fats: 0.9, default_size: 100 },
    { name: 'Bread (White)', unit: 'slice', calories: 79, protein: 2.7, carbs: 15, fats: 1, default_size: 1 },
    { name: 'Bread (Whole Wheat)', unit: 'slice', calories: 92, protein: 3.6, carbs: 17, fats: 1, default_size: 1 },
    { name: 'Oats (Cooked)', unit: 'grams', calories: 71, protein: 2.5, carbs: 12, fats: 1.5, default_size: 100 },
    { name: 'Poha (Cooked)', unit: 'grams', calories: 180, protein: 3, carbs: 35, fats: 4, default_size: 100 },
    { name: 'Upma', unit: 'grams', calories: 190, protein: 4, carbs: 30, fats: 6, default_size: 100 },
    { name: 'Idli', unit: 'piece', calories: 58, protein: 2, carbs: 12, fats: 0.2, default_size: 1 },
    { name: 'Dosa (Plain)', unit: 'piece', calories: 133, protein: 3, carbs: 22, fats: 3, default_size: 1 },
    { name: 'Masala Dosa', unit: 'piece', calories: 350, protein: 6, carbs: 45, fats: 15, default_size: 1 },

    // Pulses & Legumes (Dal)
    { name: 'Dal (Toor, Cooked)', unit: 'bowl', calories: 150, protein: 8, carbs: 20, fats: 4, default_size: 1 },
    { name: 'Dal (Moong, Cooked)', unit: 'bowl', calories: 140, protein: 9, carbs: 18, fats: 3, default_size: 1 },
    { name: 'Chana Masala', unit: 'bowl', calories: 200, protein: 10, carbs: 25, fats: 7, default_size: 1 },
    { name: 'Rajma Curry', unit: 'bowl', calories: 240, protein: 12, carbs: 30, fats: 8, default_size: 1 },
    { name: 'Chickpeas (Boiled)', unit: 'grams', calories: 164, protein: 9, carbs: 27, fats: 2.6, default_size: 100 },

    // Dairy & Eggs
    { name: 'Milk (Whole)', unit: 'ml', calories: 62, protein: 3.2, carbs: 4.8, fats: 3.3, default_size: 100 },
    { name: 'Milk (Skimmed)', unit: 'ml', calories: 35, protein: 3.4, carbs: 5, fats: 0.1, default_size: 100 },
    { name: 'Curd / Yogurt', unit: 'grams', calories: 60, protein: 3.5, carbs: 4.7, fats: 3.3, default_size: 100 },
    { name: 'Paneer (Raw)', unit: 'grams', calories: 265, protein: 18, carbs: 1.2, fats: 20, default_size: 100 },
    { name: 'Egg (Boiled)', unit: 'piece', calories: 78, protein: 6, carbs: 0.6, fats: 5, default_size: 1 },
    { name: 'Egg Omelette (1 Egg)', unit: 'piece', calories: 120, protein: 7, carbs: 1, fats: 9, default_size: 1 },
    { name: 'Butter', unit: 'tsp', calories: 36, protein: 0, carbs: 0, fats: 4, default_size: 1 },
    { name: 'Ghee', unit: 'tsp', calories: 45, protein: 0, carbs: 0, fats: 5, default_size: 1 },

    // Fruits
    { name: 'Apple', unit: 'piece', calories: 95, protein: 0.5, carbs: 25, fats: 0.3, default_size: 1 },
    { name: 'Banana', unit: 'piece', calories: 105, protein: 1.3, carbs: 27, fats: 0.4, default_size: 1 },
    { name: 'Orange', unit: 'piece', calories: 62, protein: 1.2, carbs: 15, fats: 0.2, default_size: 1 },
    { name: 'Mango', unit: 'piece', calories: 200, protein: 2.8, carbs: 50, fats: 1.2, default_size: 1 },
    { name: 'Grapes', unit: 'grams', calories: 69, protein: 0.7, carbs: 18, fats: 0.2, default_size: 100 },
    { name: 'Watermelon', unit: 'grams', calories: 30, protein: 0.6, carbs: 8, fats: 0.2, default_size: 100 },
    { name: 'Papaya', unit: 'grams', calories: 43, protein: 0.5, carbs: 11, fats: 0.3, default_size: 100 },

    // Vegetables (Cooked Sabzi usually has oil)
    { name: 'Mixed Vegetable Sabzi', unit: 'bowl', calories: 150, protein: 3, carbs: 12, fats: 9, default_size: 1 },
    { name: 'Aloo Gobi', unit: 'bowl', calories: 180, protein: 4, carbs: 20, fats: 10, default_size: 1 },
    { name: 'Bhindi Masala', unit: 'bowl', calories: 160, protein: 3, carbs: 15, fats: 9, default_size: 1 },
    { name: 'Palak Paneer', unit: 'bowl', calories: 280, protein: 12, carbs: 10, fats: 22, default_size: 1 },
    { name: 'Potato (Boiled)', unit: 'grams', calories: 87, protein: 1.9, carbs: 20, fats: 0.1, default_size: 100 },
    { name: 'Cucumber', unit: 'grams', calories: 15, protein: 0.7, carbs: 3.6, fats: 0.1, default_size: 100 },

    // Non-Veg
    { name: 'Chicken Breast (Grilled)', unit: 'grams', calories: 165, protein: 31, carbs: 0, fats: 3.6, default_size: 100 },
    { name: 'Chicken Curry', unit: 'bowl', calories: 300, protein: 25, carbs: 10, fats: 18, default_size: 1 },
    { name: 'Fish Fry', unit: 'piece', calories: 250, protein: 20, carbs: 5, fats: 15, default_size: 1 },
    { name: 'Mutton Curry', unit: 'bowl', calories: 400, protein: 25, carbs: 12, fats: 28, default_size: 1 },

    // Snacks & Others
    { name: 'Samosa', unit: 'piece', calories: 260, protein: 4, carbs: 24, fats: 17, default_size: 1 },
    { name: 'Tea (with milk/sugar)', unit: 'cup', calories: 60, protein: 2, carbs: 8, fats: 2, default_size: 1 },
    { name: 'Coffee (with milk/sugar)', unit: 'cup', calories: 70, protein: 2, carbs: 9, fats: 3, default_size: 1 },
    { name: 'Biscuits (Digestive)', unit: 'piece', calories: 70, protein: 1, carbs: 10, fats: 3, default_size: 1 },
    { name: 'Maggi / Noodles', unit: 'pack', calories: 310, protein: 6, carbs: 40, fats: 14, default_size: 1 },
];
