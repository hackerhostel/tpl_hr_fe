import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    CheckBadgeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsisVerticalIcon,
    PencilIcon,
    PlusCircleIcon,
    TrashIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect"
import { useToasts } from "react-toast-notifications";
import {
    doGetFormData,
    selectDevelopmentPlans,
    selectEmployeeStatuses,
    selectTrainingLevels
} from "../../state/slice/masterDataSlice";
import axios from "axios";
import { getSelectOptions } from "../../utils/commonUtils.js";

const GoalsSection = ({ selectedUser, goals, reFetchEmployee }) => {
    const { addToast } = useToasts();

    const [showActionsId, setShowActionsId] = useState(null);
    const [addingNew, setAddingNew] = useState(false);
    const [newGoal, setNewGoal] = useState({ name: "", targetDate: "", statusID: "", comments: "" });
    const [editingGoalId, setEditingGoalId] = useState(null);
    const [editGoalData, setEditGoalData] = useState({});
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const employeeStatuses = useSelector(selectEmployeeStatuses);
    const trainingLevels = useSelector(selectTrainingLevels);
    const developmentPlans = useSelector(selectDevelopmentPlans);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const dispatch = useDispatch();

    const totalPages = Math.ceil(goals.length / rowsPerPage);
    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentPageContent = goals.slice(indexOfFirst, indexOfLast);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingGoalId !== null) {
            setEditGoalData((prev) => ({ ...prev, [name]: value }));
        } else {
            setNewGoal((prev) => ({ ...prev, [name]: value }));
        }
    };

    useEffect(() => {
        dispatch(doGetFormData());
    }, [dispatch]);

    const handleAddGoal = async () => {
        if (!newGoal.name || !newGoal.targetDate) {
            addToast("Name and Target Date are required", { appearance: "warning" });
            return;
        }

        try {
            const payload = {
                goal: {
                    name: newGoal.name,
                    targetDate: newGoal.targetDate,
                    comments: newGoal.comments,
                    statusID: parseInt(newGoal.statusID) || 1,
                },
            };

            const response = await axios.post(`/employees/${selectedUser.id}/goals`, payload);

            if (response?.data?.goalID) {
                addToast("Goal added successfully", { appearance: "success" });
                setAddingNew(false);
                setNewGoal({ name: "", targetDate: "", statusID: "", comments: "" });
                reFetchEmployee()
            }
        } catch (err) {
            console.error("Goal Add Error:", err);
            addToast("Failed to add the goal", { appearance: "error" });
        }
    };

    const handleEditGoal = async (goalId) => {
        try {
            const payload = {
                goal: {
                    ...editGoalData,
                    statusID: parseInt(editGoalData.statusID),
                },
            };

            const response = await axios.put(`/employees/${selectedUser.id}/goals/${goalId}`, payload);

            // TEMPORARY: just check for status code for now
            if (response?.status === 200) {
                addToast("Goal updated successfully", { appearance: "success" });
                setEditingGoalId(null);
                reFetchEmployee();
            } else {
                addToast("Failed to update the goal", { appearance: "error" });
            }
        } catch (err) {
            console.error("Edit Goal Error:", err);
            addToast("Failed to update the goal", { appearance: "error" });
        }
    };

    const confirmDeleteGoal = (goalID) => {
        setConfirmDeleteId(goalID);
    };

    const handleDeleteGoal = async (goalId) => {
        try {
            const response = await axios.delete(`/employees/${selectedUser.id}/goals/${goalId}`);
            if (response?.data?.goalID) {
                addToast("Goal deleted successfully", { appearance: "success" });
                setShowActionsId(null);
                reFetchEmployee();
            } else {
                addToast("Failed to delete the goal", { appearance: "error" });
            }
        } catch (err) {
            console.error("Delete Goal Error:", err);
            addToast("Failed to delete the goal", { appearance: "error" });
        }
    };

    return (
        <div className="w-full px-6 py-4 bg-white rounded-md">
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
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Comments</th>
                        <th className="py-3 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {addingNew && (
                        <tr className="border-b border-gray-200">
                            {["name", "targetDate", "statusID", "comments"].map((field) => (
                                <td className="px-4 py-3" key={field}>
                                    {["statusID"].includes(field) ? (
                                        <FormSelect
                                            name={field}
                                            options={getSelectOptions(field === "statusID" ? employeeStatuses : developmentPlans)}
                                            formValues={newGoal}
                                            onChange={(e) => handleInputChange(e)}
                                            showErrors={false}
                                            required
                                        />
                                    ) : (
                                        <FormInput
                                            type={field === "targetDate" ? "date" : "text"}
                                            name={field}
                                            formValues={{ [field]: newGoal[field] }}
                                            onChange={(e) => handleInputChange(e, true)}
                                        />
                                    )}
                                </td>
                            ))}

                            <td className="px-4 py-3 flex gap-3">
                                <CheckBadgeIcon onClick={handleAddGoal} className="w-5 h-5 text-green-600 cursor-pointer" />
                                <XMarkIcon
                                    onClick={() => {
                                        setAddingNew(false);
                                        setNewGoal({ name: "", targetDate: "", statusID: "", comments: "" });
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
                                    {["name", "targetDate", "statusID", "comments"].map((field) => (
                                        <td className="px-4 py-3" key={field}>
                                            {["statusID"].includes(field) ? (
                                                <FormSelect
                                                    name={field}
                                                    options={getSelectOptions(field === "statusID" ? employeeStatuses : developmentPlans)}
                                                    formValues={editGoalData}
                                                    onChange={(e) => handleInputChange(e)}
                                                    showErrors={false}
                                                    required
                                                />
                                            ) : (
                                                <FormInput
                                                    type={field === "targetDate" ? "date" : "text"}
                                                    name={field}
                                                    formValues={{ [field]: editGoalData[field] }}
                                                    onChange={(e) => handleInputChange(e)}
                                                />

                                            )}
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
                                    <td className="px-4 py-3">{goal.targetDate?.split("T")[0]}</td>
                                    <td className="px-4 py-3">
                                        {employeeStatuses.find((status) => status.id === goal.statusID)?.name || "Unknown"}
                                    </td>

                                    <td className="px-4 py-3">{goal.comments}</td>


                                    <td className="px-4 py-3 flex gap-3">
                                        {showActionsId === goal.id ? (
                                            <div className="flex gap-3">
                                                <PencilIcon
                                                    className="w-5 h-5 text-text-color cursor-pointer"
                                                    onClick={() => {
                                                        setEditGoalData({
                                                            name: goal.name || "",
                                                            targetDate: goal.targetDate.split("T")[0] || "",
                                                            statusID: goal.statusID || "",
                                                            comments: goal.comments || ""
                                                        });
                                                        setEditingGoalId(goal.id);
                                                        setShowActionsId(null);
                                                    }}
                                                />

                                                <TrashIcon
                                                    className="w-5 h-5 text-text-color cursor-pointer"
                                                    onClick={() => confirmDeleteGoal(goal.id)}
                                                />
                                                <XMarkIcon
                                                    className="w-5 h-5 text-text-color cursor-pointer"
                                                    onClick={() => setShowActionsId(null)}
                                                />
                                            </div>
                                        ) : (
                                            <EllipsisVerticalIcon
                                                className="w-5 h-5 text-text-color cursor-pointer"
                                                onClick={() => setShowActionsId(goal.id)}
                                            />
                                        )}
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>


            {confirmDeleteId && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-md p-6 w-96 shadow-lg">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Deletion</h2>
                        <p className="mb-6 text-sm text-gray-600">Are you sure you want to delete this Goal? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteGoal}
                                className="px-4 py-2 rounded bg-primary-pink text-white text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {goals.length > rowsPerPage && (
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
