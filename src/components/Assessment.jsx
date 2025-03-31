import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope } from 'lucide-react'; // Add the icons for the navbar
import { CheckCircle, Clock } from 'lucide-react'; // Clock and check circle icons

const questions = [
    { question: "🍭 Do you crave sugary foods frequently?", answers: ["Never", "Sometimes", "Often", "Always"] },
    { question: "🏃‍♂️ How often do you exercise?", answers: ["Rarely", "1-2 times/week", "3-5 times/week", "Daily"] },
    { question: "🥗 Do you follow a healthy diet plan?", answers: ["No", "Occasionally", "Mostly", "Yes, strictly"] },
    { question: "👨‍👩‍👧‍👦 Is there a family history of diabetes?", answers: ["No", "Distant Relative", "Parent/Sibling", "Multiple family members"] },
    { question: "🚰 Do you stay hydrated throughout the day?", answers: ["Rarely", "Sometimes", "Usually", "Always"] },
    { question: "🕰️ How regular is your meal timing?", answers: ["Very irregular", "Sometimes irregular", "Mostly regular", "Strictly regular"] },
    { question: "😴 How many hours of sleep do you get?", answers: ["< 5 hours", "5-6 hours", "6-8 hours", "> 8 hours"] },
    { question: "🩸 Do you have high blood pressure?", answers: ["No", "Mild", "Moderate", "Severe"] },
    { question: "🧘 How do you manage stress?", answers: ["Not at all", "Rarely", "Sometimes", "Effectively"] },
    { question: "🚶‍♂️ Do you maintain an active lifestyle?", answers: ["No", "Occasionally", "Mostly", "Always"] },
];

const Assessment = () => {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null); // Track the selected answer
    const [showResult, setShowResult] = useState(false);
    const [answers, setAnswers] = useState([]); // Store the answers locally
    const [animate, setAnimate] = useState(true);
    const [progressBarStyle, setProgressBarStyle] = useState("bg-blue-500 opacity-100");

    // Clock related state
    const [isAssessmentInProgress, setIsAssessmentInProgress] = useState(true);

    const selectAnswer = (index) => {
        setSelectedAnswer(index);
    };

    const nextQuestion = () => {
        if (selectedAnswer !== null) {
            // Save the answer to local storage
            const newAnswers = [...answers, selectedAnswer];
            setAnswers(newAnswers);
            setScore(score + selectedAnswer); // Update score with the selected answer
            setSelectedAnswer(null); // Reset selected answer for next question
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setShowResult(true);
                setIsAssessmentInProgress(false); // Set to false when assessment is complete
            }
        } else {
            alert("Please select an answer to proceed.");
        }
    };

    // Change progress bar color for blinking effect
    useEffect(() => {
        const interval = setInterval(() => {
            setProgressBarStyle(prevStyle =>
                prevStyle === "bg-blue-500 opacity-100" ? "bg-blue-500 opacity-50" : "bg-blue-500 opacity-100"
            );
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Fix progress bar completion on last question
    const progressWidth = showResult ? 100 : ((currentQuestionIndex + 0) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Navigation - Fixed to the top */}
            <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md z-50 py-4 px-6 border-b border-gray-200 shadow-md flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Stethoscope className="h-6 w-6 text-purple-700" />
                    <span className="text-xl font-bold text-gray-900">HealthGuard</span>
                </div>
                {/* Blinking Assessment in Progress button */}
                <button
                    className={`px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg ${isAssessmentInProgress ? 'bg-blue-600 text-white animate-pulse' : 'bg-green-600 text-white'}`}
                    disabled={isAssessmentInProgress}
                >
                    {isAssessmentInProgress ? (
                        <>
                        <Clock className="inline ml-2 animate-spin" />    Assessment in Progress 
                        </>
                    ) : (
                        <>
                        <CheckCircle className="inline ml-2" />    Assessment Completed 
                        </>
                    )}
                </button>
            </nav>

            {/* Header Section */}
            <div className="container mx-auto px-3 text-center pt-24">
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                    🩺 Diabetes Risk Assessment
                </h1>
                <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                    Answer 10 questions to calculate your risk.
                </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-gray-200">
                <div
                    className={`h-full ${progressBarStyle} transition-all duration-300 ease-in-out`}
                    style={{ width: `${progressWidth}%` }}
                ></div>
            </div>

            {/* Questions Section */}
            {!showResult ? (
                <div className="px-6 py-8">
                    <h2 className={`text-2xl font-bold mb-4 ${animate ? "animate__animated animate__fadeInUp" : ""}`}>
                        {questions[currentQuestionIndex].question}
                    </h2>
                    <div className="space-y-4">
                        {questions[currentQuestionIndex].answers.map((answer, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 text-lg
                                ${selectedAnswer === index ? 'bg-blue-600 text-white !important' : 'bg-gray-200 text-gray-800'}`}
                                onClick={() => selectAnswer(index)}
                            >
                                {answer}
                            </div>
                        ))}
                    </div>
                    <button
                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                        onClick={nextQuestion}
                    >
                        Next
                    </button>
                </div>
            ) : (
                <div className="px-6 py-8">
                    <h2 className="text-3xl font-bold">📊 Assessment Complete!</h2>
                    <p className="mt-4 text-xl">
                        {score < 5 ? "🚨 High Risk - Pay attention to your habits." : score < 7 ? "⚠️ Moderate Risk - Consider making minor lifestyle changes." : "🎉 Low Risk - Great job!"}
                    </p>
                    <button
                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                        onClick={() => {
                            navigate("/signup/user");
                        }}
                    >
                        🚀 Sign Up
                    </button>
                </div>
            )}
        </div>
    );
};

export default Assessment;
