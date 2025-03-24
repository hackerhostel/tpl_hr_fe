import React, { useState } from "react";
import { PlusCircleIcon, StarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import FormInput from "../FormInput"; // Assuming you have a FormInput component
import FormTextArea from "../FormTextArea"; // Assuming you have a FormTextArea component

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
    feedback: "A great experience! The team was very helpful and professional...",
  },
];

const FeedbackPopup = ({ isOpen, onClose }) => {

  const [relationship, setRelationship] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500">
          <XMarkIcon className="w-5 h-5" />
        </button>
        <span className="text-lg font-semibold text-text-color">Add Feedback</span>

        <div className="flex items-center space-x-5">
        <div className="mt-3">
          <label className="text-sm font-medium text-gray-600">Relationship</label>
          <FormInput
            label="Relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
          />
        </div>

        <div className="mt-3">
          <label className="text-sm font-medium text-gray-600">Rate</label>
          <div className="flex mt-1">
            {[...Array(5)].map((_, index) => (
              <StarIcon key={index} className="text-yellow-500 w-6" />
            ))}
          </div>
        </div>
        </div>

        

        <div className="mt-3">
        <label className="text-sm font-medium text-gray-600">Role</label>
          <FormTextArea className="w-full mt-1" rows="3"  name="role" />


        </div>

        <button className="mt-4 bg-orange-500 text-white w-full py-2 rounded">Add</button>
      </div>
    </div>
  );
};

const FeedbackCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
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
    <div style={{ width: "100%" }} className="bg-white rounded-md p-5">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2">
        <span className="text-lg font-semibold text-gray-800">
          Feedback ({currentIndex + 1} / {feedbackData.length})
        </span>
        <button onClick={() => setIsPopupOpen(true)} className="flex items-center space-x-2 text-text-color">
          <PlusCircleIcon className="w-5 text-text-color" />
          <span>Add New</span>
        </button>
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
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => {
          return index < Math.floor(feedback.rating) ? (
            <StarIcon key={index} className="text-yellow-500 w-5" />
          ) : (
            <StarIcon key={index} className="text-gray-300 w-5" />
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
          className={`px-2 py-1 rounded ${currentIndex === 0 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"}`}
        >
          {"<"}
        </button>
        {feedbackData.map((_, index) => (
          <button
            key={index}
            className={`px-2 py-1 text-sm ${index === currentIndex ? "text-red-500 font-bold" : "text-gray-500"}`}
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

      {/* Feedback Popup */}
      <FeedbackPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
};

export default FeedbackCard;
