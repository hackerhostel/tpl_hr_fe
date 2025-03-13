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

const KPIs = () => {
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
      <div className="flex space-x-3 items-center border-b pb-2">
        <div>
          <span className="text-lg font-semibold text-text-color">
            KPIs ({currentIndex + 1} / {feedbackData.length})
          </span>
        </div>

        <div>
          <div className="flex text-text-color">
          <span>Active working hours</span>
          <span className="ml-36">35</span>
          </div>
          
        </div>

      </div>

      {/* User Info */}
      <div className="mt-3">
        <div>
          <span className="text-black font-bold">Description</span>
          <p className="mt-2 text-text-color  ">Tracks the active working hours on a weekly basis,</p>
        </div>

        <div className="mt-4">
          <span className="text-black font-bold">Formula</span>
          <p className="mt-2 text-text-color">(worked hours / allocated worked hours) * 100</p>
        </div>

        <div className="mt-4">
          <p className="text-text-color">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation </p>
        </div>
      </div>


      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-2 py-1 rounded ${currentIndex === 0 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"
            }`}
        >
          {"<"}
        </button>
        {feedbackData.map((_, index) => (
          <button
            key={index}
            className={`px-2 py-1 text-sm ${index === currentIndex ? "text-red-500 font-bold" : "text-gray-500"
              }`}
            onClick={() => setCurrentIndex(index)}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={handleNext}
          disabled={currentIndex === feedbackData.length - 1}
          className={`px-2 py-1 rounded ${currentIndex === feedbackData.length - 1 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"
            }`}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default KPIs;
