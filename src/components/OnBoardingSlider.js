import React from 'react';
import { useState, useEffect } from 'react';
import onboard1 from '../assets/onboard1.png';
import onboard2 from '../assets/onboard2.png';
import onboard3 from '../assets/onboard3.png';

const images = [onboard1, onboard2, onboard3];
const text = [
  "With a team of experienced professionals and cutting-edge technology,  helping clients to achieve their transportation goals with efficiency.",
  "Access a vast network of trusted carriers to find the best rates and services for your needs.",
  "We offers a wide range of services to help businesses streamline their supply chain operations, including freight management, carrier selection, tracking and tracing, and more."
];

function OnBoardingSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className="bg-primaryBackground h-full flex flex-col justify-center items-center relative">
      <div className="w-full h-5/6 flex justify-center items-center relative">
        {images.map((image, index) => (
          <div
            key={index}
            className={`w-full h-full transition-opacity duration-1000 absolute top-0 left-0 flex flex-col justify-center items-center ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className='w-4/6 onboarding_text '>
              <h3 className='text-2xl font-bold text-center mb-16'>{text[index]}</h3>
            </div>
            <img src={image} alt={`Image ${index + 1}`} className="object-cover mx-auto" />
          </div>
        ))}
      </div>
      <div className="w-full h-1/6 flex justify-center items-start  ">
        {images.map((_, index) => (
          <span
            key={index}
            className={`mx-1 bg-gray-400 w-4 h-4 rounded-full inline-block mr-8 ${
              index === currentIndex ? 'bg-primarybtn' : ''
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default OnBoardingSlider;
