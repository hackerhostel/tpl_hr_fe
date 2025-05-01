import React, {useEffect, useState} from "react";
import {PlusCircleIcon, StarIcon, XMarkIcon} from "@heroicons/react/24/outline";
import FormTextArea from "../FormTextArea";
import axios from "axios";
import FormSelect from "../FormSelect.jsx";
import {getSelectOptions} from "../../utils/commonUtils.js";
import {useSelector} from "react-redux";
import {clickedUser} from "../../state/slice/projectUsersSlice.js";

// FeedbackPopup Component
const FeedbackPopup = ({isOpen, onClose, onAddFeedback, feedbackTypes, selectedUser, reFetchFeedback}) => {
  const [rating, setRating] = useState(0);

  const [formValues, setFormValues] = useState({
    feedbackTypeID: 0,
    comments: "",
  });

  const handleAddFeedback = async () => {
    try {
      const employeeID = selectedUser?.id;

      const payload = {
        ...formValues,
        feedbackTypeID: formValues.feedbackTypeID > 0 ? Number(formValues.feedbackTypeID): (feedbackTypes[0].id),
        rating,
      };

      const res = await axios.post(`/employees/${employeeID}/feedback`, {
        feedback: payload,
      });

      if (res.status === 201) {
        onAddFeedback({
          id: res.data.feedbackID,
          name: res.data.firstName,
          role: "Contributor",
          date: new Date().toLocaleDateString(),
          rating,
          feedback: formValues.comments,
        });


        setFormValues({
          feedbackTypeID: "",
          comments: "",
        });
        setRelationship("");
        setComments("");
        setRating(0);

        onClose();
      }
    } catch (error) {
      console.error("Error submitting feedback:", error?.response?.data || error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
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
            <FormSelect
                name="feedbackTypeID"
                options={getSelectOptions(feedbackTypes)}
                formValues={formValues}
                onChange={handleChange}
            />
          </div>

          <div className="mt-3 items-center flex-col">
            <label className="text-sm font-medium text-gray-600">Rate</label>
            <div className="flex justify-center items-center">
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
            name="comments"
            className="w-full mt-1"
            rows="3"
            value={formValues.comments}
            onChange={handleChange}
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
const FeedbackCard = ({feedbackTypes}) => {
  const selectedUserData = useSelector(clickedUser);
  const [feedbackData, setFeedbackData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      const employeeID = selectedUserData?.id

      // Fetch feedbacks
      const res = await axios.get(`/employees/${employeeID}`);
      const feedbackList = res?.data?.body?.feedback || [];

      // Fetch employee list
      const employeeRes = await axios.get(`/organizations/employees`);
      const employees = employeeRes.data.body;

      const formatted = feedbackList.map((f) => {
        const creator = employees.find((e) => e.id === f.createdBy);
        const creatorName = creator ? `${creator.firstName} ${creator.lastName}` : "Unknown";
        const feedbackGiverRole = feedbackTypes.find(fb => fb.id === f.feedbackType)

        return {
          id: f.id,
          name: creatorName,
          role: feedbackGiverRole?.id ? feedbackGiverRole?.name : 'Unknown',
          date: new Date(f.createdDate).toLocaleDateString(),
          rating: f.rating,
          feedback: f.comments,
        };
      });

      setFeedbackData(feedbackList.length ? formatted : []);
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error?.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [feedbackTypes, selectedUserData]);

  const handleAddFeedback = (newFeedback) => {
    setIsPopupOpen(false)
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
    <div style={{ width: "100%", height: "330px" }} className="bg-white rounded-md p-5">
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
          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-16">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-2 py-1 rounded ${currentIndex === 0 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"}`}
            >
              {"<"}
            </button>

            {/* Show max 3 page buttons */}
            {feedbackData.slice(
              Math.max(0, currentIndex - 1),
              Math.min(feedbackData.length, currentIndex + 2)
            ).map((_, index) => {
              const pageIndex = Math.max(0, currentIndex - 1) + index;
              return (
                <button
                  key={pageIndex}
                  className={`px-2 py-1 text-sm ${pageIndex === currentIndex ? "text-red-500 font-bold" : "text-gray-500"}`}
                  onClick={() => setCurrentIndex(pageIndex)}
                >
                  {pageIndex + 1}
                </button>
              );
            })}

            <button
              onClick={handleNext}
              disabled={currentIndex === feedbackData.length - 1}
              className={`px-2 py-1 rounded ${currentIndex === feedbackData.length - 1 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"}`}
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
        feedbackTypes={feedbackTypes}
        selectedUser={selectedUserData}
        reFetchFeedback={fetchFeedbacks}
      />
    </div>
  );
};

export default FeedbackCard;
