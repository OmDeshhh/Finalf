import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Assessment.css";

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
    const [showResult, setShowResult] = useState(false);
    const [animate, setAnimate] = useState(true);

    const selectAnswer = (index) => {
        setAnimate(false);
        setTimeout(() => {
            setScore(score + index);
            nextQuestion();
            setAnimate(true);
        }, 150);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResult(true);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>🩺 Diabetes Risk Assessment</h1>
                <p>Answer 10 questions to calculate your risk.</p>
            </div>
            <div className="progress-container">
                <div
                    className="progress-bar"
                    style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
                ></div>
            </div>
            {!showResult ? (
                <div className="question-box">
                    <h2 className={`question ${animate ? "fade-in-up" : ""}`}>
                        {questions[currentQuestionIndex].question}
                    </h2>
                    <div className="options">
                        {questions[currentQuestionIndex].answers.map((answer, index) => (
                            <div key={index} className="option" onClick={() => selectAnswer(index)}>
                                {answer}
                            </div>
                        ))}
                    </div>
                    <button className="btn" onClick={nextQuestion}>Next</button>
                </div>
            ) : (
                <div className="result-box">
                    <h2>📊 Assessment Complete!</h2>
                    <p>{score < 5 ? "🚨 High Risk - Pay attention to your habits." : score < 7 ? "⚠️ Moderate Risk - Consider making minor lifestyle changes." : "🎉 Low Risk - Great job!"}</p>
                    <button
                        className="btn-glow"
                        onClick={() => {
                            const choice = window.confirm("Are you signing up as a Pathologist? Click OK for Pathologist, Cancel for User.");
                            navigate(choice ? "/signup/pathologist" : "/signup/user");
                        }}
                    >
                        🚀 Sign Up / Login
                    </button>
                </div>
            )}
        </div>
    );
};

export default Assessment;
