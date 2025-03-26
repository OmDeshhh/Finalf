import React, { useEffect } from "react";
import './HomePage.css';

const HomePage = () => {
    useEffect(() => {
        const stats = document.querySelectorAll('.stat-card');
        const revealPoint = 150;

        window.addEventListener('scroll', () => {
            stats.forEach((stat) => {
                const statTop = stat.getBoundingClientRect().top;

                if (statTop < window.innerHeight - revealPoint) {
                    stat.style.transform = 'translateY(0)';
                    stat.style.opacity = '1';
                } else {
                    stat.style.transform = 'translateY(30px)';
                    stat.style.opacity = '0';
                }
            });
        });
        
        document.querySelectorAll('.stat-card').forEach((stat) => {
            stat.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        });
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div>
                    <h1>🩺 Take Control of Your Health</h1>
                    <p>Understand and manage diabetes effectively with AI-powered insights.</p>
                    <a href="/assessment" className="btn">🚀 Take Assessment</a>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats">
                <div className="stat-card">
                    <h2>422M+</h2>
                    <p>People affected by diabetes worldwide.</p>
                </div>
                <div className="stat-card">
                    <h2>50%+</h2>
                    <p>Cases go undiagnosed leading to severe complications.</p>
                </div>
                <div className="stat-card">
                    <h2>97%</h2>
                    <p>Users saw positive results using AI-based diet plans.</p>
                </div>
            </section>

            {/* Why Test Section */}
            <section className="why-test">
                <h2>🧐 Why Should You Take the Test?</h2>
                <p>Discover your risk factors and take preventive measures before it's too late.</p>
            </section>

            {/* Footer */}
            <footer>
                <p>&copy; 2025 Diabetes Health Hub | All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default HomePage;
