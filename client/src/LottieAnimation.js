// src/LottieAnimation.js
import React from 'react';
import Lottie from 'lottie-react';
import micAnimation from './assets/mic.json'; // Adjust the path accordingly
import assistantAnimation from './assets/assistance.json'; // Adjust the path accordingly
import './Homepage.css';

const LottieAnimation = ({ isListening }) => {
    const animationData = isListening ? micAnimation : assistantAnimation;

    return (
        <div className={`lottie-container ${isListening ? 'lottie-active' : ''}`}>
            <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                className="lottie-animation"
            />
        </div>
    );
};

export default LottieAnimation;
