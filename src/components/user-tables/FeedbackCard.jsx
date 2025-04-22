import React, { useEffect, useState } from "react";
import { PlusCircleIcon, StarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import FormInput from "../FormInput";
import FormTextArea from "../FormTextArea";
import axios from "axios";

// FeedbackPopup Component
const FeedbackPopup = ({ isOpen, onClose, onAddFeedback }) => {
  const [relationship, setRelationship] = useState("");
  const [comments, setComments] = useState("");
  const [rating, setRating] = useState(0);


  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        // Get logged-in employee ID
        const whoamiRes = await axios.get("/employees/who-am-i");
        const employeeID = whoamiRes?.data?.body?.userDetails?.id;
  
        // Get feedbacks for the employee
        const res = await axios.get(`/employees/${employeeID}`);
        const feedbackList = res?.data?.body?.feedback || [];
  
        console.log("Raw feedback list from API:", feedbackList);
  
        // Get employee list for name mapping
        const employeeRes = await axios.get(`/organizations/employees`);
        const employees = employeeRes.data.body;
        console.log("employees", employees);
  
        // Format feedbacks
        const formatted = feedbackList.map((f) => {
          const creator = employees.find((e) => e.id === f.createdBy);
          const creatorName = creator ? `${creator.firstName} ${creator.lastName}` : "Unknown";

          
  console.log(`Feedback ID: ${f.id}, createdBy: ${f.createdBy}, Creator Name: ${creatorName}`);
  
          return {
            id: f.id,
            name: creatorName, // <- this now shows who gave the feedback
            role: setRelationship(f.feedbackType),
            date: new Date(f.createdDate).toLocaleDateString(),
            rating: f.rating,
            feedback: f.comments,
          };
        });
  
        console.log("Formatted feedback data:", formatted);
  
        setFeedbackData(formatted);
      } catch (error) {
        console.error("Failed to fetch feedbacks:", error?.response?.data || error.message);
      }
    };
  
    fetchFeedbacks();
  }, []);
  
  

  const handleAddFeedback = async () => {
    try {
      const whoamiRes = await axios.get("/employees/who-am-i");
      const employeeID = whoamiRes?.data?.body?.userDetails?.id;
      const email = whoamiRes?.data?.body?.userDetails?.email;
      



      const payload = {
        feedbackTypeID: Number(relationship),
        comments,
        rating,
        createdBy: email,
        employeeID,
      };

      const res = await axios.post(`/employees/${employeeID}/feedback`, {
        feedback: payload,
      });

      if (res.status === 201) {
        onAddFeedback({
          id: res.data.feedbackID,
          name: res.data.firstName, // Adjust if your backend returns creator name
          role: "Contributor", // Or dynamically assign based on feedbackType?
          date: new Date().toLocaleDateString(),
          rating,
          feedback: comments,
        });

        onClose();
        setRelationship("");
        setComments("");
        setRating(0);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error?.response?.data || error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500">
          <XMarkIcon className="w-5 h-5" />
        </button>
        <span className="text-lg font-semibold text-text-color">Add Feedback</span>

        <div className="flex items-center space-x-5">
          <div className="mt-3">
            <label className="text-sm font-medium text-gray-600">Relationship</label>
            <FormInput
              name="feedbackTypeID"
              label="Feedback Type"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              type="number"
            />
          </div>

          <div className="mt-3">
            <label className="text-sm font-medium text-gray-600">Rate</label>
            <div className="flex mt-1">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`w-6 cursor-pointer ${index < rating ? "text-yellow-500" : "text-gray-300"}`}
                  onClick={() => setRating(index + 1)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <label className="text-sm font-medium text-gray-600">Comment</label>
          <FormTextArea
            className="w-full mt-1"
            rows="3"
            name="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        <button className="mt-4 bg-orange-500 text-white w-full py-2 rounded" onClick={handleAddFeedback}>
          Add
        </button>
      </div>
    </div>
  );
};

// FeedbackCard Component
const FeedbackCard = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const whoamiRes = await axios.get("/employees/who-am-i");
        const employeeID = whoamiRes?.data?.body?.userDetails?.id;
  
        // Fetch feedbacks
        const res = await axios.get(`/employees/${employeeID}`);
        const feedbackList = res?.data?.body?.feedback || [];
  
        // Fetch employee list
        const employeeRes = await axios.get(`/organizations/employees`);
        const employees = employeeRes.data.body;
  
        const formatted = feedbackList.map((f) => {
          const creator = employees.find((e) => e.id === f.createdBy);
          const creatorName = creator ? `${creator.firstName} ${creator.lastName}` : "Unknown";
  
          return {
            id: f.id,
            name: creatorName,
            role: getRelationshipName(f.feedbackType),
            date: new Date(f.createdDate).toLocaleDateString(),
            rating: f.rating,
            feedback: f.comments,
          };
        });
  
        setFeedbackData(formatted);
      } catch (error) {
        console.error("Failed to fetch feedbacks:", error?.response?.data || error.message);
      }
    };
  
    fetchFeedbacks();
  }, []);
  

  const getRelationshipName = (typeID) => {
    const types = {
      1: "Peer",
      2: "Manager",
      3: "Subordinate",
      // Add more as needed
    };
    return types[typeID] || "Contributor";
  };

  const handleAddFeedback = (newFeedback) => {
    setFeedbackData((prev) => [...prev, newFeedback]);
    setCurrentIndex(feedbackData.length);
  };

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

  const feedback = feedbackData[currentIndex];

  return (
    <div style={{ width: "100%" }} className="bg-white rounded-md p-5">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2">
        <span className="text-lg font-semibold text-gray-800">
          Feedback ({feedbackData.length ? currentIndex + 1 : 0} / {feedbackData.length})
        </span>
        <button onClick={() => setIsPopupOpen(true)} className="flex items-center space-x-2 text-text-color">
          <PlusCircleIcon className="w-5 text-text-color" />
          <span>Add New</span>
        </button>
      </div>

      {feedback && (
        <>
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
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={`${index < Math.floor(feedback.rating) ? "text-yellow-500" : "text-gray-300"} w-5`}
              />
            ))}
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
              className={`px-2 py-1 rounded ${
                currentIndex === feedbackData.length - 1 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {">"}
            </button>
          </div>
        </>
      )}

      {/* Feedback Popup */}
      <FeedbackPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onAddFeedback={handleAddFeedback}
      />
    </div>
  );
};

export default FeedbackCard;
