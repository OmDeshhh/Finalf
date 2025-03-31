import React, { useEffect, useRef } from 'react';
import { Stethoscope, Shield, ArrowRight, Activity, Heart, Droplet } from 'lucide-react';  // Importing additional icons
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

function HomePage() {
  const navigate = useNavigate();  // Initialize the navigate function
  const featuresRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-4');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Redirect to the assessment page when the button is clicked
  const handleGetStarted = () => {
    navigate('/assessment');  // Redirects to /assessment route
  };

  const handleStartJourney = () => {
    navigate('/assessment');  // Redirects to /assessment route
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation - Fixed to the top */}
      <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md z-50 py-4 px-6 border-b border-gray-200 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Stethoscope className="h-6 w-6 text-purple-700" />
          <span className="text-xl font-bold text-gray-900">HealthGuard</span>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleGetStarted}
            className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-transparent text-blue-600 border border-blue-600 rounded-full text-sm font-medium"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen pt-0 mt-0 bg-gradient-to-br from-purple-500 via-white to-blue-500">
        <div className="container mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6 shadow-sm">
            <Shield className="h-4 w-4 mr-2" />
            Trusted by 100,000+ patients worldwide
          </div>

          {/* Heading */}
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Your Health, 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Reimagined</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Experience healthcare that's personalized, proactive, and powered by cutting-edge AI technology.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartJourney}  // Redirect on click
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-16 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-8 shadow-sm">
              <Shield className="h-4 w-4 mr-2" />
              Advanced Features
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transform Your Health Journey
            </h2>
            <p className="text-xl text-gray-700">
              Discover how our AI-powered platform can help you achieve your health goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{
              title: "Predictive Analytics",
              description: "AI algorithms analyze your health data to predict potential risks",
              icon: <Activity className="h-6 w-6 text-blue-600" />,
              benefits: ["Early warning system", "Personalized insights", "Trend analysis"]
            },
            {
              title: "Smart Monitoring",
              description: "24/7 health tracking with intelligent alerts and notifications",
              icon: <Heart className="h-6 w-6 text-blue-600" />,
              benefits: ["Real-time tracking", "Custom alerts", "Progress reports"]
            },
            {
              title: "Blood Testing",
              description: "Easily book essential blood tests to monitor critical health markers",
              icon: <Droplet className="h-6 w-6 text-blue-600" />,
              benefits: [
                "HbA1c Test",
                "HOMA-IR",
                "Fasting Glucose Test"
              ]
            }].map((feature, index) => (
              <div
                key={index}
                className="animate-on-scroll bg-white p-6 rounded-3xl shadow-lg border border-gray-100 transform transition-transform hover:scale-105 hover:shadow-xl hover:bg-blue-50"
              >
                <div className="flex items-center mb-4 justify-center">
                  {feature.icon}
                  <h3 className="text-2xl font-semibold text-gray-900 ml-2 text-center">{feature.title}</h3>
                </div>
                <p className="text-gray-700 mb-4 text-center">{feature.description}</p>
                <ul className="space-y-3 text-center">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center justify-center text-gray-800">
                      <ArrowRight className="h-5 w-5 text-purple-600 mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
