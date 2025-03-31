import React, { useState, useEffect } from 'react';
import { FaStethoscope } from 'react-icons/fa';

const tips = [
  "Eat more fiber-rich foods like whole grains, vegetables, and fruits to help control blood sugar.",
  "Engage in at least 30 minutes of moderate exercise, such as walking or cycling, most days of the week.",
  "Choose healthy fats like avocado, nuts, and olive oil to improve your insulin sensitivity.",
  "Stay hydrated by drinking plenty of water throughout the day, as dehydration can affect blood sugar levels.",
  "Limit your intake of sugary beverages, as they can cause blood sugar spikes.",
  "Track your carbohydrate intake and consider carb counting to help manage blood sugar levels.",
  "Include lean protein sources like chicken, fish, and beans to stabilize blood sugar after meals.",
  "Practice portion control to avoid overeating and maintain healthy blood sugar levels.",
  "Eat small, balanced meals throughout the day to keep your blood sugar levels stable.",
  "Monitor your blood sugar levels regularly to stay on top of your health and make adjustments to your lifestyle.",
  "Opt for whole fruits instead of fruit juices to avoid added sugar and increase fiber intake.",
  "Take breaks to stretch or walk around if you have a sedentary job, to improve circulation and insulin sensitivity.",
  "Include magnesium-rich foods like spinach, almonds, and beans in your diet, as magnesium helps with blood sugar control.",
  "Consider incorporating cinnamon into your diet, as some studies suggest it may help lower blood sugar levels.",
  "Get at least 7-8 hours of quality sleep each night, as poor sleep can negatively affect insulin sensitivity."
];

const Loader = () => {
  const [tip, setTip] = useState('');

  useEffect(() => {
    // Randomly select a tip when the component loads
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTip(randomTip);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-500">
      {/* Container for Loader */}
      <div className="relative flex flex-col justify-center items-center text-center space-y-6">
        {/* Orbiting circles around the stethoscope */}
        <div className="relative flex justify-center items-center mb-4">
          <div className="absolute animate-pulse bg-white opacity-20 rounded-full w-72 h-72"></div>
          <div className="absolute animate-spin bg-white opacity-30 rounded-full w-96 h-96"></div>
          <div className="absolute animate-bounce bg-white opacity-40 rounded-full w-120 h-120"></div>

          {/* Stethoscope Icon without rotation */}
          <FaStethoscope className="text-white text-6xl z-10" />
        </div>

        {/* HealthGuard Title with Motion */}
        <h1 className="text-5xl font-extrabold text-white mb-6 tracking-widest drop-shadow-2xl">
          HealthGuard
        </h1>

        {/* Spinning Circle Animation */}
        <div className="relative w-24 h-24 border-8 border-t-8 border-white rounded-full animate-spin">
          <div className="absolute w-16 h-16 border-4 border-t-4 border-white rounded-full animate-spin"></div>
        </div>

        {/* Displaying the random diabetes tip */}
        <p className="text-white text-lg font-semibold mt-4">{tip}</p>
      </div>
    </div>
  );
};

export default Loader;
