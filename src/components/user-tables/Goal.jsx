import React, { useEffect, useState } from "react";
import {
    CheckBadgeIcon,
    PlusCircleIcon,
    XMarkIcon,
    PencilIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from "@heroicons/react/24/outline";
import FormInput from "../FormInput";
import { useToasts } from "react-toast-notifications";
import axios from "axios";

const GoalsSection = ({ goals = [], refetchGoals }) => {
    const { addToast } = useToasts();

    const [goalList, setGoalList] = useState(goals);
    const [addingNew, setAddingNew] = useState(false);
    const [newGoal, setNewGoal] = useState({ name: "", targetDate: "", progress: "", comments: "" });
    const [editingGoalId, setEditingGoalId] = useState(null);
    const [editGoalData, setEditGoalData] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    useEffect(() => {
      const isDifferent = JSON.stringify(goals) !== JSON.stringify(goalList);
      if (isDifferent) {
          setGoalList(goals);
      }
  }, [goals]);
  

    const totalPages = Math.ceil(goalList.length / rowsPerPage);
    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentPageContent = goalList.slice(indexOfFirst, indexOfLast);

    const handleInputChange = (e, isEdit = false) => {
        const { name, value } = e.target;
        if (isEdit) {
            setEditGoalData({ ...editGoalData, [name]: value });
        } else {
            setNewGoal({ ...newGoal, [name]: value });
        }
    };

    const handleAddGoal = async () => {
      if (!newGoal.name || !newGoal.targetDate) {
          addToast("Name and Target Date are required", { appearance: "warning" });
          return;
      }
  
      try {
          // Step 1: Get current employee info
          const whoamiRes = await axios.get("/employees/who-am-i");
          const employeeID = whoamiRes?.data?.body?.userDetails?.id;
          const email = whoamiRes?.data?.body?.userDetails?.email;
  
          console.log("Retrieved email:", email);
  
          if (!employeeID || !email) {
              addToast("Failed to retrieve employee details", { appearance: "error" });
              return;
          }
  
          // Step 2: Prepare and send goal creation
          const payload = {
              goal: {
                  name: newGoal.name,
                  targetDate: newGoal.targetDate,
                  comments: newGoal.comments,
                  statusID: parseInt(newGoal.progress) || 1,
                  employeeID: employeeID,
              },
              createdBy: email
          };
  
          console.log("Payload to be sent:", payload);
  
          const response = await axios.post(`/employees/${employeeID}/goals`, payload);
  
          if (response?.data?.goalID) {
              addToast("Goal added successfully", { appearance: "success" });
              refetchGoals();
              setAddingNew(false);
              setNewGoal({ name: "", targetDate: "", progress: "", comments: "" });
          } else {
              throw new Error("Goal ID not returned");
          }
      } catch (err) {
          console.error(err);
          addToast("Failed to add goal", { appearance: "error" });
      }
  };
  
  
  

    const handleEditGoal = async (goalId) => {
        try {
            const response = await axios.put(`/goals/${goalId}`, editGoalData); // Replace with actual API
            if (response?.data?.success) {
                addToast("Goal updated successfully", { appearance: "success" });
                refetchGoals();
                setEditingGoalId(null);
            }
        } catch (err) {
            addToast("Failed to update goal", { appearance: "error" });
        }
    };

    const handleDeleteGoal = async (goalId) => {
        try {
            const response = await axios.delete(`/goals/${goalId}`); // Replace with actual API
            if (response?.data?.success) {
                addToast("Goal deleted successfully", { appearance: "success" });
                refetchGoals();
            }
        } catch (err) {
            addToast("Failed to delete goal", { appearance: "error" });
        }
    };

    return (
        <div className="w-full mt-8 px-6 py-4 bg-white rounded-md">
            <div className="flex justify-between mb-4">
                <span className="text-lg text-text-color">Goals</span>
                {!addingNew && (
                       <div className="flex items-center space-x-2 text-text-color cursor-pointer" onClick={() => setAddingNew(true)}>
                       <PlusCircleIcon className="w-5 text-text-color" />
                       <span>Add New</span>
                     </div>
                )}
            </div>
            <table className="table-auto w-full border-collapse">
                <thead>
                    <tr className="text-left text-secondary-grey border-b border-gray-200">
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Target Date</th>
                        <th className="py-3 px-4">Progress</th>
                        <th className="py-3 px-4">Comments</th>
                        <th className="py-3 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {addingNew && (
                        <tr className="border-b border-gray-200">
                            {["name", "targetDate", "progress", "comments"].map((field) => (
                                <td className="px-4 py-3" key={field}>
                                    <FormInput
                                        type={field === "targetDate" ? "date" : "text"}
                                        name={field}
                                        formValues={{ [field]: newGoal[field] }}
                                        onChange={(e) => handleInputChange(e)}
                                    />
                                </td>
                            ))}
                            <td className="px-4 py-3 flex gap-3">
                                <CheckBadgeIcon onClick={handleAddGoal} className="w-5 h-5 text-green-600 cursor-pointer" />
                                <XMarkIcon
                                    onClick={() => {
                                        setAddingNew(false);
                                        setNewGoal({ name: "", targetDate: "", progress: "", comments: "" });
                                    }}
                                    className="w-5 h-5 text-red-600 cursor-pointer"
                                />
                            </td>
                        </tr>
                    )}
                    {currentPageContent.map((goal) => (
                        <tr className="border-b border-gray-200" key={goal.id}>
                            {editingGoalId === goal.id ? (
                                <>
                                    {["name", "targetDate", "progress", "comments"].map((field) => (
                                        <td className="px-4 py-3" key={field}>
                                            <FormInput
                                                type={field === "targetDate" ? "date" : "text"}
                                                name={field}
                                                formValues={{ [field]: editGoalData[field] }}
                                                onChange={(e) => handleInputChange(e, true)}
                                            />
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 flex gap-3">
                                        <CheckBadgeIcon
                                            onClick={() => handleEditGoal(goal.id)}
                                            className="w-5 h-5 text-green-600 cursor-pointer"
                                        />
                                        <XMarkIcon
                                            onClick={() => setEditingGoalId(null)}
                                            className="w-5 h-5 text-red-600 cursor-pointer"
                                        />
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="px-4 py-3">{goal.name}</td>
                                    <td className="px-4 py-3">{goal.targetDate}</td>
                                    <td className="px-4 py-3">{goal.progress}</td>
                                    <td className="px-4 py-3">{goal.comments}</td>
                                    <td className="px-4 py-3 flex gap-3">
                                        <PencilIcon
                                            onClick={() => {
                                                setEditingGoalId(goal.id);
                                                setEditGoalData(goal);
                                            }}
                                            className="w-5 h-5 text-blue-600 cursor-pointer"
                                        />
                                        <TrashIcon
                                            onClick={() => handleDeleteGoal(goal.id)}
                                            className="w-5 h-5 text-red-600 cursor-pointer"
                                        />
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {goalList.length > rowsPerPage && (
                <div className="w-full flex gap-5 items-center justify-end mt-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className={`p-2 rounded-full bg-gray-200 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeftIcon className="w-4 h-4 text-secondary-grey" />
                    </button>
                    <span className="text-gray-500 text-center">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className={`p-2 rounded-full bg-gray-200 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRightIcon className="w-4 h-4 text-secondary-grey" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default GoalsSection;
