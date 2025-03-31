import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Accordion from 'react-bootstrap/Accordion';
import { Stethoscope } from 'lucide-react';


// Your food options (keeping them as they are)
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

// Non-Veg Food Options (keeping as it is)
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
  const [diet, setDiet] = useState('vegetarian');
  const [userDetails, setUserDetails] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [medicalCondition, setMedicalCondition] = useState('generic');
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  // Firebase references
  const db = getFirestore();
  const auth = getAuth();

  // Fetch user details from Firebase
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserDetails(userData);

          // Calculate BMI if weight and height are available
          const { weight, height, medicalConditions } = userData;
          if (weight && height) {
            const heightInMeters = height / 100; // Convert height from cm to meters
            const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
            setBmi(bmiValue);
          }

          // Set medical condition based on the available data
          if (medicalConditions) {
            if (medicalConditions.toLowerCase().includes('diabetic') || medicalConditions.toLowerCase().includes('sugar')) {
              setMedicalCondition('diabetic');
            } else if (medicalConditions.toLowerCase().includes('prediabetic')) {
              setMedicalCondition('prediabetic');
            } else {
              setMedicalCondition('General');
            }
          }
          setLoading(false);
        } else {
          console.log('No such document!');
          setLoading(false);
        }
      } else {
        setLoading(false);  // If no user is logged in, stop loading
      }
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchUserData();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();  // Clean up listener on component unmount
  }, []);

  useEffect(() => {
    // Check if any food data is stored in local storage for today
    const storedFoods = JSON.parse(localStorage.getItem("selectedFoods"));
    if (storedFoods) {
      setSelectedFoods(storedFoods);
      const calories = storedFoods.reduce((sum, item) => sum + item.calories, 0);
      setTotalCalories(calories);
    }
  }, []);

  const handleFoodSelect = (foodItem, mealTime) => {
    const isAlreadySelected = selectedFoods.some(item => item.name === foodItem.name && item.mealTime === mealTime);
    
    if (!isAlreadySelected) {
      const updatedFoods = [...selectedFoods, { ...foodItem, mealTime }];
      setSelectedFoods(updatedFoods);
      // Recalculate total calories
      const updatedCalories = updatedFoods.reduce((sum, item) => sum + item.calories, 0);
      setTotalCalories(updatedCalories);
      // Store in local storage for today
      localStorage.setItem("selectedFoods", JSON.stringify(updatedFoods));
    }
  };

  const handleFoodDelete = (foodItem) => {
    const updatedFoods = selectedFoods.filter(item => item.name !== foodItem.name);
    setSelectedFoods(updatedFoods);
    // Recalculate total calories
    const updatedCalories = updatedFoods.reduce((sum, item) => sum + item.calories, 0);
    setTotalCalories(updatedCalories);
    // Update local storage
    localStorage.setItem("selectedFoods", JSON.stringify(updatedFoods));
  };

  const handleSave = () => {
    // Save selected foods to local storage
    localStorage.setItem("selectedFoods", JSON.stringify(selectedFoods));
    alert('Your selected foods have been saved!');
  };

  const handleClear = () => {
    // Clear all selected foods from state and local storage
    setSelectedFoods([]);
    setTotalCalories(0);
    localStorage.removeItem("selectedFoods");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Selected Food Options based on diet and medical condition
  const selectedFoodOptions = diet === 'vegetarian' ? foodOptions : nonVegFoodOptions;

  // Handle dropdown toggle
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Group selected foods by mealTime
  const groupedFoods = selectedFoods.reduce((groups, food) => {
    if (!groups[food.mealTime]) {
      groups[food.mealTime] = [];
    }
    groups[food.mealTime].push(food);
    return groups;
  }, {});

  return (
    <div className="container mx-auto py-4 mt-24">
  {/* Navbar */}
  <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md z-50 py-4 px-6 border-b border-gray-200 shadow-md flex justify-between items-center">
    <div className="flex items-center space-x-2">
      <Stethoscope className="h-6 w-6 text-purple-700" />
      <span className="text-xl font-bold text-gray-900">HealthGuard</span>
    </div>
    <div className="flex space-x-4">
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="px-6 py-2 bg-transparent text-blue-600 border border-blue-600 rounded-full text-sm font-medium"
        >
          Profile
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <ul className="space-y-2 p-2">
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded"
                onClick={() => handleProfileOption("Personal Details")}
              >
                Personal Details
              </li>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded"
                onClick={() => handleProfileOption("Orders")}
              >
                Orders
              </li>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded"
                onClick={() => handleProfileOption("Logout")}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  </nav>

  {/* Main Section: User's Details + BMI Range */}
  <div className="flex justify-between max-w-6xl mx-auto my-6 space-x-6">
    
  {/* User's Details */}
  <div className="bg-blue-50 rounded-lg shadow-md p-4 w-1/2">
    <h5 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-300 pb-2">User's Details</h5>
    <div className="text-sm text-gray-700 space-y-3">
      {/* Weight */}
      <div className="flex justify-between">
        <span className="font-semibold text-gray-800">Weight:</span>
        <span className="text-gray-600">{userDetails?.weight || 'Loading...'} kg</span>
      </div>
      {/* Height */}
      <div className="flex justify-between">
        <span className="font-semibold text-gray-800">Height:</span>
        <span className="text-gray-600">{userDetails?.height ? `${userDetails.height} cm` : 'Loading...'}</span>
      </div>
      {/* BMI */}
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-800">BMI:</span>
        <span
          className={`text-lg font-semibold ${bmi < 18.5 ? 'text-blue-600' : bmi < 24.9 ? 'text-green-600' : bmi < 30 ? 'text-yellow-600' : 'text-red-600'}`}
        >
          {bmi || 'Calculating...'}
        </span>
      </div>
      {/* Medical Condition */}
      <div className="flex justify-between">
        <span className="font-semibold text-gray-800">Medical Condition:</span>
        <span className="text-gray-600">{medicalCondition}</span>
      </div>
    </div>
  </div>

  {/* BMI Range Section */}
  <div className=" bg-blue-50 border-2 border-gray-300 rounded-lg p-4 w-1/3">
    <h6 className="text-lg font-semibold text-gray-800 mb-4">BMI Range:</h6>
    <div className="flex flex-col space-y-4 text-xs">
    <div className="flex justify-center items-center space-x-2">
      <span className="text-blue-600 font-bold">Underweight (&lt;18.5)</span>
    </div>
    <div className="flex justify-center items-center space-x-2">
      <span className="text-green-600 font-bold">Normal (18.5–24.9)</span>
    </div>
    <div className="flex justify-center items-center space-x-2">
      <span className="text-yellow-600 font-bold">Overweight (25–29.9)</span>
    </div>
    <div className="flex justify-center items-center space-x-2">
      <span className="text-red-600 font-bold">Obese (≥30)</span>
    </div>
    </div>
  </div>
</div>


  {/* Dietary Preference */}
  <div className="my-4">
    <label className="block text-lg font-medium text-gray-700">Dietary Preference:</label>
    <select
      className="border rounded-lg p-3 mt-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
      value={diet}
      onChange={(e) => setDiet(e.target.value)}
    >
      <option value="vegetarian">Vegetarian</option>
      <option value="nonVegetarian">Non-Vegetarian</option>
    </select>
  </div>

  {/* Total Daily Calories */}
  <h5 className="text-xl font-semibold mb-4 text-gray-800">Total Daily Calories: {totalCalories} kcal</h5>

  {/* Collapsible Sections for Meals */}
  {Object.entries(selectedFoodOptions).map(([mealTime, meals], idx) => (
    <div key={idx} className="my-4">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-6 rounded-t-lg cursor-pointer">
        <button className="w-full text-left font-semibold">{mealTime.charAt(0).toUpperCase() + mealTime.slice(1)}</button>
      </div>
      <div className="bg-yellow-50 border-t-2 border-yellow-200 p-4">
        {meals.map((meal, index) => (
          <div key={index} className="meal-item mb-4 p-4 bg-white rounded-lg shadow-md border-l-4 border-yellow-500">
            <h3 className="text-lg text-orange-600">{meal.name} ({meal.calories} kcal)</h3>
            <p className="text-gray-600">{meal.description}</p>
            <button
              className={`mt-2 px-4 py-2 rounded ${selectedFoods.some(item => item.name === meal.name && item.mealTime === mealTime) ? 'bg-green-600' : 'bg-blue-600'} text-white`}
              onClick={() => handleFoodSelect(meal, mealTime)}
            >
              {selectedFoods.some(item => item.name === meal.name && item.mealTime === mealTime) ? 'Selected' : '+ Select'}
            </button>
          </div>
        ))}
      </div>
    </div>
  ))}

  {/* Selected Foods List */}
  <div className="my-6">
    <h5 className="text-xl font-semibold text-gray-800 mb-4">Selected Foods:</h5>
    {Object.entries(groupedFoods).map(([mealTime, foods]) => (
      <div key={mealTime} className="mb-6">
        {/* Meal Time Category Header */}
        <h6 className="text-lg font-semibold text-gray-800 mb-2 bg-blue-100 p-3 rounded-lg shadow-sm">
          {mealTime.charAt(0).toUpperCase() + mealTime.slice(1)}
        </h6>

        {/* Food Items for This Meal Time */}
        <ul className="space-y-4">
          {foods.map((food, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md border-l-4 border-blue-400 hover:bg-gray-100"
            >
              <div className="flex flex-col space-y-1">
                <span className="font-semibold text-gray-800">{food.name}</span>
                <span className="text-sm text-gray-600">({food.calories} kcal)</span>
              </div>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                onClick={() => handleFoodDelete(food)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  
    {/* Footer */}
    <div className="flex justify-between items-center mt-6">
      <button
        className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700"
        onClick={handleSave}
      >
        Save
      </button>
      <button
        className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700"
        onClick={handleClear}
      >
        Clear
      </button>
    </div>
  </div>
  );
  };
  
  export default MealPlan;