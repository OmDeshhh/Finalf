import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import 'bootstrap/dist/css/bootstrap.min.css';

const foodOptions = {
  earlyMorning: [
    { name: 'Dried Dates', description: 'Nutrient-dense fruits providing natural sugars, fiber, and essential minerals like potassium and magnesium.', calories: 23 },
    { name: 'Almonds', description: 'Rich in healthy fats, protein, fiber, magnesium, and vitamin E, contributing to heart health and blood sugar management.', calories: 7 },
    { name: 'Lemon Mint Chia Seed Drink', description: 'A refreshing beverage combining lemon, mint, and chia seeds, rich in omega-3 fatty acids, fiber, and protein.', calories: 70 },
    { name: 'Walnuts', description: 'Contain healthy fats and antioxidants that support heart health and may improve blood sugar control.', calories: 26 },
    { name: 'Flaxseed Smoothie', description: 'A smoothie made with ground flaxseeds, providing omega-3 fatty acids and fiber, beneficial for blood sugar regulation.', calories: 150 },
    { name: 'Cinnamon Herbal Tea', description: 'Herbal tea infused with cinnamon, which may help lower blood sugar levels.', calories: 2 },
    { name: 'Pumpkin Seeds', description: 'Rich in magnesium, which is important for blood sugar control.', calories: 30 },
    { name: 'Green Tea with Lemon', description: 'A low-calorie beverage rich in antioxidants that may aid in blood sugar regulation.', calories: 2 },
  ],
  breakfast: [
    { name: 'Vegetable Oats Upma', description: 'A savory dish made with oats and mixed vegetables, rich in fiber and protein.', calories: 150 },
    { name: 'Greek Yogurt Parfait with Berries and Nuts', description: 'Layered Greek yogurt with fresh berries and nuts, offering probiotics and antioxidants.', calories: 200 },
    { name: 'Moong Dal Chilla', description: 'Savory pancakes made from ground moong dal, high in protein and fiber.', calories: 120 },
    { name: 'Idli with Sambar', description: 'Steamed rice cakes served with lentil-based vegetable stew, a balanced meal with protein and fiber.', calories: 150 },
    { name: 'Quinoa Porridge', description: 'Cooked quinoa with milk and nuts, providing a high-protein alternative to traditional porridge.', calories: 180 },
    { name: 'Besan (Chickpea Flour) Pancakes', description: 'Savory pancakes made from chickpea flour, rich in protein and fiber.', calories: 150 },
    { name: 'Ragi (Finger Millet) Porridge', description: 'A nutritious porridge made from ragi flour, high in calcium and fiber.', calories: 180 },
    { name: 'Sprouted Grain Toast with Avocado', description: 'Whole grain toast topped with avocado slices, providing healthy fats and fiber.', calories: 200 },
  ],
  midMorningSnack: [
    { name: 'Sprouted Moong Salad', description: 'A light salad made with sprouted green gram (moong), tomatoes, cucumbers, and a dash of lemon juice.', calories: 120 },
    { name: 'Fruit Salad with Nuts', description: 'A mix of low-glycemic index fruits like apples, pears, and berries, topped with a handful of almonds or walnuts.', calories: 150 },
    { name: 'Vegetable Dhokla', description: 'A steamed savory cake made from fermented rice and chickpea batter, incorporating finely chopped vegetables.', calories: 150 },
    { name: 'Oats Pancake', description: 'Prepared using oats and semolina, this crispy dish is a mix of cheela and pancake.', calories: 180 },
    { name: 'Palak Patta Chaat', description: 'Spinach leaves coated in gram flour batter, lightly fried, and topped with yogurt and chutneys.', calories: 150 },
    { name: 'Barley Paratha', description: 'Flatbread made from barley flour, providing complex carbohydrates and fiber.', calories: 180 },
    { name: 'Chia Seed Pudding', description: 'Chia seeds soaked in almond milk, flavored with vanilla, and topped with nuts.', calories: 200 },
  ],
  lunch: [
    { name: 'Soya Pulao', description: 'A flavorful rice dish cooked with soya chunks and aromatic spices.', calories: 250 },
    { name: 'Mixed Vegetable Raita', description: 'A yogurt-based side dish mixed with various fresh vegetables.', calories: 100 },
    { name: 'Quinoa Khichdi', description: 'A wholesome dish combining quinoa and lentils, tempered with cumin and garnished with coriander.', calories: 220 },
    { name: 'Stuffed Bajra Roti', description: 'Pearl millet flatbread stuffed with spiced mixed vegetables.', calories: 200 },
    { name: 'Vegetable Sambar with Brown Rice', description: 'A South Indian lentil stew with assorted vegetables, served with brown rice.', calories: 300 },
    { name: 'Methi Thepla with Cucumber Raita', description: 'Fenugreek-infused flatbread served with a cooling cucumber yogurt dip.', calories: 280 },
  ],
  eveningSnacks: [
    { name: 'Roasted Chana', description: 'Crunchy roasted chickpeas, rich in protein and fiber.', calories: 120 },
    { name: 'Makhana (Fox Nuts)', description: 'Lightly roasted fox nuts, providing healthy carbs and protein.', calories: 100 },
    { name: 'Paneer Tikka', description: 'Grilled paneer cubes marinated in spices, rich in protein.', calories: 200 },
    { name: 'Hummus with Vegetable Sticks', description: 'Chickpea-based dip served with crunchy vegetable sticks.', calories: 180 },
    { name: 'Oats Chivda', description: 'A light snack made with roasted oats, nuts, and seeds.', calories: 150 },
  ],
  dinner: [
    { name: 'Dal Palak with Roti', description: 'Lentils cooked with spinach, served with whole wheat roti.', calories: 250 },
    { name: 'Grilled Fish with Steamed Vegetables', description: 'Lean protein-rich grilled fish with steamed veggies.', calories: 300 },
    { name: 'Vegetable Soup with Whole Grain Bread', description: 'Nutritious vegetable soup paired with whole grain bread.', calories: 200 },
    { name: 'Methi Roti with Curd', description: 'Fenugreek-infused whole wheat flatbread served with curd.', calories: 220 },
    { name: 'Tofu Stir-fry with Brown Rice', description: 'Stir-fried tofu and vegetables served with brown rice.', calories: 280 },
  ]
};
const nonVegFoodOptions = {
  earlyMorning: [
      { name: 'Boiled Eggs', description: 'Rich in protein and essential nutrients, helps control blood sugar levels.', calories: 78 },
      { name: 'Smoked Salmon', description: 'High in omega-3 fatty acids, supports heart health and blood sugar regulation.', calories: 120 },
      { name: 'Turkey Slices', description: 'Lean protein source, low in fat, and helps stabilize blood sugar levels.', calories: 60 },
      { name: 'Chicken Bone Broth', description: 'Nutrient-rich broth supporting gut health and immunity.', calories: 50 },
      { name: 'Grilled Shrimp', description: 'Low in calories and rich in protein, supports muscle health.', calories: 90 },
  ],
  breakfast: [
      { name: 'Omelette with Spinach and Cheese', description: 'Packed with protein, healthy fats, and fiber for steady energy.', calories: 250 },
      { name: 'Tuna Salad on Whole-Grain Toast', description: 'A protein-rich meal with complex carbs to maintain blood sugar levels.', calories: 300 },
      { name: 'Scrambled Eggs with Smoked Salmon', description: 'A healthy combination of protein and omega-3s.', calories: 280 },
      { name: 'Chicken Sausage with Avocado', description: 'Provides healthy fats and lean protein.', calories: 320 },
      { name: 'Turkey and Egg Breakfast Wrap', description: 'A high-protein wrap with whole-grain tortillas.', calories: 350 },
  ],
  midMorningSnack: [
      { name: 'Grilled Chicken Skewers', description: 'Lean protein source, low in fat and carbohydrates.', calories: 150 },
      { name: 'Boiled Egg with Avocado', description: 'A great mix of protein and healthy fats.', calories: 180 },
      { name: 'Tuna Lettuce Wraps', description: 'Low-carb snack with high protein content.', calories: 200 },
      { name: 'Salmon and Cucumber Slices', description: 'A light yet nutritious snack with omega-3 benefits.', calories: 180 },
      { name: 'Turkey and Cheese Roll-Ups', description: 'A high-protein, low-carb option for steady energy.', calories: 220 },
  ],
  lunch: [
      { name: 'Grilled Chicken Salad', description: 'A protein-packed salad with fresh greens and olive oil dressing.', calories: 350 },
      { name: 'Baked Fish with Vegetables', description: 'A low-carb, high-protein meal with essential omega-3s.', calories: 400 },
      { name: 'Turkey and Quinoa Bowl', description: 'A balanced meal with lean protein and fiber-rich quinoa.', calories: 380 },
      { name: 'Egg Curry with Brown Rice', description: 'A flavorful dish with high protein and complex carbs.', calories: 420 },
      { name: 'Lemon Garlic Shrimp with Cauliflower Rice', description: 'Low in carbs, high in protein, and rich in healthy fats.', calories: 360 },
  ],
  eveningSnack: [
      { name: 'Grilled Salmon Bites', description: 'A light yet protein-rich snack with essential fatty acids.', calories: 180 },
      { name: 'Boiled Eggs with Hummus', description: 'A great mix of protein and fiber for sustained energy.', calories: 200 },
      { name: 'Turkey Avocado Roll-Ups', description: 'A nutritious snack packed with healthy fats and lean protein.', calories: 220 },
      { name: 'Shrimp Ceviche', description: 'A fresh seafood snack with citrus flavors.', calories: 150 },
      { name: 'Spicy Chicken Wings (Air-Fried)', description: 'A healthier alternative to deep-fried wings.', calories: 250 },
  ],
  dinner: [
      { name: 'Grilled Fish with Steamed Vegetables', description: 'A light and nutritious meal with high protein content.', calories: 400 },
      { name: 'Lemon Herb Chicken with Quinoa', description: 'A balanced meal with lean protein and complex carbs.', calories: 420 },
      { name: 'Egg Drop Soup with Tofu', description: 'A light soup rich in protein and essential nutrients.', calories: 180 },
      { name: 'Beef Stir-Fry with Bell Peppers', description: 'A high-protein meal with fiber-rich vegetables.', calories: 450 },
      { name: 'Baked Salmon with Asparagus', description: 'A heart-healthy meal rich in omega-3s.', calories: 380 },
  ],
};
const MealPlan = () => {
  const [age, setAge] = useState('');
  const [diet, setDiet] = useState('vegetarian');
  const [lactose, setLactose] = useState(true);

  // ✅ Use correct dataset based on diet
  const selectedFoodOptions = diet === 'vegetarian' ? foodOptions : nonVegFoodOptions;

  // ✅ Lactose filter logic
  const filterLactoseItems = (meals) => {
    if (lactose) return meals;
    return meals.filter(item => !item.name.toLowerCase().includes('milk'));
  };

  // ✅ Total calories
  const totalCalories = Object.values(selectedFoodOptions)
    .flat()
    .filter(item => lactose || !item.name.toLowerCase().includes('milk'))
    .reduce((sum, item) => sum + item.calories, 0);

  return (
    <div className="container py-4">
      <h2 className="text-success text-center mb-4">🥗 Personalized Diabetic Meal Plan</h2>

      <div className="mb-3">
        <label className="form-label">Age:</label>
        <input
          type="number"
          className="form-control"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter your age"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Dietary Preference:</label>
        <select
          className="form-select"
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
        >
          <option value="vegetarian">Vegetarian</option>
          <option value="nonVegetarian">Non-Vegetarian</option>
        </select>
      </div>

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={!lactose}
          onChange={() => setLactose(!lactose)}
          id="lactoseCheck"
        />
        <label className="form-check-label" htmlFor="lactoseCheck">
          Lactose Intolerant?
        </label>
      </div>

      <h5 className="text-primary mb-4">
        Total Daily Calories: {totalCalories} kcal
      </h5>

      <Accordion defaultActiveKey="0">
        {Object.entries(selectedFoodOptions).map(([mealTime, items], index) => {
          const filteredItems = filterLactoseItems(items);
          const mealCalories = filteredItems.reduce((sum, item) => sum + item.calories, 0);

          return (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header>
                {mealTime.toUpperCase()} ({mealCalories} kcal)
              </Accordion.Header>
              <Accordion.Body>
                {filteredItems.map((item, idx) => (
                  <div key={idx} className="border-bottom mb-3 pb-2">
                    <h6>{item.name}</h6>
                    <p className="mb-1 text-muted">{item.description}</p>
                    <small className="text-secondary">
                      Calories: {item.calories} kcal
                    </small>
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
};

export default MealPlan;