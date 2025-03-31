import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Stethoscope } from 'lucide-react';
import Collapsible from 'react-collapsible'; // For collapsible sections
import ProgressBar from 'react-bootstrap/ProgressBar'; // To show the progress bars

// Navbar Component
const Navbar = ({ logout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle dropdown toggle
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
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
                <li className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded">
                  Personal Details
                </li>
                <li className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded">
                  Orders
                </li>
                <li className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded" onClick={() => logout()}>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// Exercise Data
const exercisesData = {
  monday: [
    {
      name: "Brisk Walking",
      description: "Boosts glucose uptake ",
      duration: "30 minutes",
      imgUrl: "https://program.rapidloss.com.au/wp-content/uploads/male-brisk-walk.gif"
    },
    {
      name: "Stretching Arms",
      description: "Stretch arms to improve flexibility.",
      duration: "2 minutes",
      imgUrl: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/topic_centers/Fitness-Exercise/400x400_Stretches_to_Do_at_Work_Every_Day_Upper_Body_Stretch.gif?w=1155&h=840"
    },
    {
      name: "Stretching Legs",
      description: "Stretch Legs to Improve Flexibility",
      duration: "2 minutes",
      imgUrl: "https://images-prod.healthline.com/hlcmsresource/images/topic_centers/Fitness-Exercise/400x400_4_Leg_Stretches_for_Flexibility_Quad_Stretch.gif"
    },
    {
      name: "Planks",
      description: "Helps To Burn Abdomen Calories",
      duration: "5 minutes",
      imgUrl: "https://media.post.rvohealth.io/wp-content/uploads/2023/05/Forearm-plank.gif"
    }

  ],
  tuesday: [
    {
      name: "Bodyweight Squats",
      description: "Builds leg muscles, improves insulin sensitivity.",
      duration: "3 sets of 10-12 reps",
      imgUrl: "https://i0.wp.com/post.healthline.com/wp-content/uploads/2019/09/400x400_Squat_Jumps-1.gif?w=1155&h=840"
    },
    {
      name: "Push-Ups",
      description: "Upper body strength, glucose regulation.",
      duration: "3 sets of 8-12 reps",
      imgUrl: "https://post.healthline.com/wp-content/uploads/2018/06/How-to-do-a-pushup-.gif"
    },
    {
      name: "Bicycle Crunch",
      description: "works your obliques, rectus abdominous, and hips.",
      duration: "3 sets of 12 alternate repetitions.",
      imgUrl: "https://post.healthline.com/wp-content/uploads/2021/09/400x400_Exercises_to_Make_the_Most_of_Your_Oblique_Workout_Bicycle_Crunch.gif"
    },
    {
      name: "High knee",
      description: "improving cardiovascular endurance, burning calories, strengthening lower body muscles, and enhancing coordination",
      duration: "3 sets of 5 alternate repetitions.",
      imgUrl: "https://wp.scoopwhoop.com/wp-content/uploads/2020/04/5e8dc03460c060428dc613d4_6d270a06-3446-4e01-a1fa-adda2f7c4bea.gif"
    }
  ],
  wednesday: [
    {
      name: "Cycling",
      description: "Boosts cardiovascular health and controls glucose.",
      duration: "35 minutes",
      imgUrl: "https://media.tenor.com/BlX7MtdLF-cAAAAM/immersiva-spinning.gif"
    }
  ],
  thursday: [
    {
      name: "Dumbbell Rows",
      description: "Strengthens upper body and improves posture.",
      duration: "3 sets of 12 reps",
      imgUrl: "https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/09/400x400_Back_Moves_for_a_Stronger_Back_Single_Arm_Dumbbell_Row_off_Bench.gif?h=840"
    },
    {
      name: "Step-Ups",
      description: "Strengthens legs and improves coordination.",
      duration: "3 sets of 10 reps per leg",
      imgUrl: "https://media.post.rvohealth.io/wp-content/uploads/2021/01/Step-ups.gif"
    },
    {
      name: "Walking Lunges",
      description: "Boosts circulation and aids in glucose control.",
      duration: "3 sets of 10 reps per leg",
      imgUrl: "https://media.post.rvohealth.io/wp-content/uploads/2023/08/AltruisticFantasticCub-size_restricted-1.gif"
    }
  ],
  friday: [
    {
      name: "Swimming / Sports",
      description: "Full-body workout, improves glucose regulation.",
      duration: "30 minutes",
      imgUrl: "https://media.post.rvohealth.io/wp-content/uploads/2023/08/DentalSecondhandGraywolf-size_restricted.gif"
    },
  ],
  saturday: [
    {
      name: "Wall Sits",
      description: "Strengthens quads and enhances stamina.",
      duration: "3 sets of 30 seconds",
      imgUrl: "https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/08/400x400_9964_Why_a_Wall_is_the_Perfect_Workout_Equipment_Wall_Sit_Clam.gif"
    },
    {
      name: "Seated Arm Raises",
      description: "Strengthens shoulders and arms, improves posture.",
      duration: "3 sets of 12 reps",
      imgUrl: "https://post.healthline.com/wp-content/uploads/2016/01/Dumbbell-rear-delt-fly.gif"
    },
    {
      name: "Upper Back",
      description: "Improves flexibility and reduces muscle tension.",
      duration: "10 minutes",
      imgUrl: "https://i0.wp.com/post.healthline.com/wp-content/uploads/2019/03/400x400_Exercises_to_Relieve_Upper_Back_Pain_Face_Pull.gif?w=1155&h=840"
    }
  ],
  sunday: [
    {
      name: "Running/Walking",
      description: "Active recovery, aids in digestion and glucose control.",
      duration: "35 minutes",
      imgUrl: "https://media2.giphy.com/media/26FPts6BbY7uulUoo/giphy.gif?cid=6c09b952lmeaiiw0u2s9xnox3mmxce0kc2ot732w6sycwhsk&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g"
    }
  ]
};

function Exercise() {
  const [userDetails, setUserDetails] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [glucose, setGlucose] = useState(null);
  const [glucoseMain, setGlucoseMain] = useState(null);
  const [glucoseLastDigits, setGlucoseLastDigits] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [completedDays, setCompletedDays] = useState([]); // Track completed days for the week
  const [dailyProgress, setDailyProgress] = useState({}); // Track daily completion for each day
  const [weeklyProgress, setWeeklyProgress] = useState(0); // Track weekly progress (percentage)
  
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
          const { weight, height } = userData;
          if (weight && height) {
            const heightInMeters = height / 100;
            const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
            setBmi(bmiValue);
          }
          setLoading(false);
        } else {
          console.log('No such document!');
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
  
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchUserData();
      } else {
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  // Fetch glucose from localStorage
  useEffect(() => {
    const glucoseData = localStorage.getItem("glucoseData");
    if (glucoseData) {
      try {
        const parsedGlucoseData = JSON.parse(glucoseData);
        if (Array.isArray(parsedGlucoseData) && parsedGlucoseData.length > 0) {
          const latestGlucose = parsedGlucoseData[parsedGlucoseData.length - 1];
          setGlucose(latestGlucose);
  
          const glucoseStr = latestGlucose.toString();
          const mainPart = glucoseStr.slice(0, -3);
          const lastThreeDigits = glucoseStr.slice(-3);
  
          setGlucoseMain(mainPart);
          setGlucoseLastDigits(lastThreeDigits);
        }
      } catch (error) {
        console.error("Failed to parse glucose data:", error);
      }
    }
  }, []);
  
  // Logout function
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  
  // BMI category based on value
  const getBmiCategory = (bmiValue) => {
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue >= 18.5 && bmiValue < 24.9) return "Normal weight";
    if (bmiValue >= 25 && bmiValue < 29.9) return "Overweight";
    return "Obese";
  };
  
  // Style BMI category color
  const getBmiColor = (category) => {
    switch (category) {
      case 'Underweight': return 'text-blue-500';
      case 'Normal weight': return 'text-green-500';
      case 'Overweight': return 'text-yellow-500';
      case 'Obese': return 'text-red-500';
      default: return '';
    }
  };

  const handleCompleteCard = (day, cardIndex) => {
    setDailyProgress(prev => {
      // Check if the day already has progress information, if not, initialize it
      const dayProgress = prev[day] || {};
  
      // Mark this specific card as completed
      dayProgress[cardIndex] = true;
  
      // Calculate how many cards are completed for the given day
      const completedCards = Object.values(dayProgress).filter(completed => completed).length;
      const totalCards = exercisesData[day].length;
  
      // Calculate the daily progress as a percentage
      const dailyCompletion = (completedCards / totalCards) * 100;
  
      // Update the daily progress state for this specific day
      const updatedDailyProgress = {
        ...prev,
        [day]: dayProgress,
      };
  
      // Update the weekly progress by checking how many days are fully completed
      const updatedCompletedDays = Object.keys(updatedDailyProgress).filter(
        (dayKey) => Object.values(updatedDailyProgress[dayKey]).every(Boolean)
      );
  
      // Calculate weekly progress as a percentage of completed days
      const weeklyPercentage = (updatedCompletedDays.length / 7) * 100;
      setWeeklyProgress(weeklyPercentage);
  
      // Set the updated daily progress and return the new state
      setDailyProgress(updatedDailyProgress);
  
      return updatedDailyProgress;
    });
  };

  // Calculate total daily progress for progress bar
  const calculateDailyProgress = () => {
    let totalProgress = 0;
    let completedDaysCount = 0;

    // Loop through all days and calculate progress
    Object.keys(dailyProgress).forEach(day => {
      const dayProgress = dailyProgress[day];
      const completedCards = Object.values(dayProgress).filter(Boolean).length;
      const totalCards = exercisesData[day]?.length || 0;
      if (totalCards > 0) {
        totalProgress += (completedCards / totalCards) * 100;
        completedDaysCount++;
      }
    });

    // Calculate the average progress for the week
    return totalProgress / completedDaysCount || 0;
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  const bmiCategory = getBmiCategory(bmi);
  const bmiColor = getBmiColor(bmiCategory);
  
  return (
    <div className="pt-20">
      <Navbar logout={logout} />

      {/* Display User Details */}
      {userDetails && (
        <div className="user-details p-6 bg-white shadow-lg rounded-lg mb-6 max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-center mb-4">User Details</h2>
          <p className="text-lg mb-2">Weight: <span className="font-semibold">{userDetails.weight} kg</span></p>
          <p className="text-lg mb-2">Height: <span className="font-semibold">{userDetails.height} cm</span></p>
          <p className="text-lg mb-2">BMI: 
            <span className={`font-semibold ${bmiColor}`}> {bmi} ({bmiCategory})</span>
          </p>
          {glucose ? (
            <p className="text-lg mb-2">Glucose Level: 
              <span className="font-semibold">{glucoseMain}</span>
              <span className="font-semibold text-blue-600">{glucoseLastDigits}</span> mg/dL
            </p>
          ) : (
            <p className="text-lg mb-2 text-gray-500">No glucose data available</p>
          )}
        </div>
      )}

        {/* Exercise Cards Container */}
      <div className="exercise-container">
        {/* Inline CSS for Blinking Effect */}
        <style jsx>{`
          /* CSS for the blinking/fading effect on the progress bar */
          @keyframes blink {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
            }
          }

          .progress-bar-blink {
            animation: blink 1.5s ease-in-out infinite;
          }
        `}</style>

        {/* Progress Bar for Completing Daily Exercises */}
        <div className="progress-container mt-8 px-6 pb-6">
          <h4 className="text-lg font-semibold text-gray-800">Daily Progress</h4>
          <div className="w-full h-1.5 bg-gray-200 border-2 border-gray-300 rounded-full">
            <div
              className={`h-full ${calculateDailyProgress() === 100 ? 'bg-green-500' : 'bg-indigo-500'} progress-bar-blink transition-all duration-500 ease-in-out`}
              style={{ width: `${Math.round(calculateDailyProgress())}%` }}
            ></div>
          </div>
          <div className="text-center mt-2 text-sm text-gray-500">
            {`${Math.round(calculateDailyProgress())}%`}
          </div>
        </div>

        {/* Progress Bar for Weekly Exercises */}
        <div className="progress-container mt-8 px-6 pb-6">
          <h4 className="text-lg font-semibold text-gray-800">Weekly Progress</h4>
          <div className="w-full h-1.5 bg-gray-200 border-2 border-gray-300 rounded-full">
            <div
              className={`h-full ${weeklyProgress === 100 ? 'bg-green-500' : 'bg-indigo-500'} progress-bar-blink transition-all duration-500 ease-in-out`}
              style={{ width: `${Math.round(weeklyProgress)}%` }}
            ></div>
          </div>
          <div className="text-center mt-2 text-sm text-gray-500">
            {`${Math.round(weeklyProgress)}%`}
          </div>
        </div>



        <div className="mb-6">
  {Object.keys(exercisesData).map((day) => (
    <Collapsible
      trigger={
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md mb-4 cursor-pointer">
          <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      }
      key={day}
    >
      <div className="card-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 py-8 bg-gray-50 rounded-lg">
        {exercisesData[day].map((exercise, index) => (
          <div
            className="card bg-white p-6 rounded-xl shadow-lg flex flex-col justify-center items-center"
            key={index}
          >
            <img
              src={exercise.imgUrl}
              alt={exercise.name}
              style={{ width: '200px', height: 'auto', objectFit: 'contain', borderRadius: '0.5rem' }} // Inline style applied
              className="mb-4"
            />

            <h3 className="text-2xl font-semibold text-gray-800 mt-2">{exercise.name}</h3>
            <p className="text-gray-600 mt-2">{exercise.description}</p>
            <p className="text-gray-500 mt-2 font-medium">Duration: {exercise.duration}</p>
            <button
              onClick={() => handleCompleteCard(day, index)} // Mark this card as completed
              className={`mt-4 px-6 py-2 rounded-full ${exercise.completed ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'} text-white`}
            >
              {exercise.completed ? 'Completed' : 'Complete'}
            </button>
          </div>
        ))}
      </div>
    </Collapsible>
  ))}
</div>




      </div>
    </div>
  );
}

export default Exercise;