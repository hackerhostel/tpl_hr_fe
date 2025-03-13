import React, { useState } from "react";

import { PlusCircleIcon, StarIcon } from "@heroicons/react/24/outline/index.js";

const feedbackData = [
  {
    id: 1,
    name: "Nilanga",
    role: "Manager",
    date: "12-12-24",
    rating: 4.5,
    feedback:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
  },
  {
    id: 2,
    name: "John Doe",
    role: "Senior Developer",
    date: "10-10-24",
    rating: 5,
    feedback:
      "A great experience! The team was very helpful and professional...",
  },
];

const FeedbackCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const feedback = feedbackData[currentIndex];

  const handleNext = () => {
    if (currentIndex < feedbackData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="bg-white rounded-md p-5 ">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2">
        <span className="text-lg font-semibold text-gray-800">
          Feedback ({currentIndex + 1} / {feedbackData.length})
        </span>
         <div className="flex items-center space-x-2 text-text-color">
               <PlusCircleIcon className="w-5 text-text-color"/>
               <span>Add New</span>
              </div>
      </div>

      {/* User Info */}
      <div className="mt-3">
        <div className="flex justify-between">
        <span className="font-medium text-gray-800">{feedback.name}</span>

        <div className="flex items-center">
          <span className="bg-purple-200 text-purple-800 text-xs font-semibold px-2 py-1 rounded">
            {feedback.role}
          </span>
          <span className="ml-3 text-gray-500 text-sm">{feedback.date}</span>
        </div>
        </div>
        
        
      </div>

      {/* Star Rating */}
      <div className="flex items-center ">
        {[...Array(5)].map((_, index) => {
          return index < Math.floor(feedback.rating) ? (
            <StarIcon key={index} className="text-yellow-500 w-5" />
          ) : (
            <StarIcon key={index} className="text-yellow-500 w-5"  />
          );
        })}
      </div>

      {/* Feedback Text */}
      <p className="mt-3 text-gray-600 text-sm">{feedback.feedback}</p>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-2 py-1 rounded ${
            currentIndex === 0 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {"<"}
        </button>
        {feedbackData.map((_, index) => (
          <button
            key={index}
            className={`px-2 py-1 text-sm ${
              index === currentIndex ? "text-red-500 font-bold" : "text-gray-500"
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={handleNext}
          disabled={currentIndex === feedbackData.length - 1}
          className={`px-2 py-1 rounded ${
            currentIndex === feedbackData.length - 1 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default FeedbackCard;
