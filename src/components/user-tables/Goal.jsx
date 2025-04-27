import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    CheckBadgeIcon,
    EllipsisVerticalIcon,
    PlusCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect"
import { useToasts } from "react-toast-notifications";
import { selectEmployeeStatuses, selectTrainingLevels, doGetFormData, selectDevelopmentPlans } from "../../state/slice/masterDataSlice";
import axios from "axios";


const GoalsSection = ({ refetchGoals }) => {
    const { addToast } = useToasts();

    const [goalList, setGoalList] = useState([]);
    const [showActionsId, setShowActionsId] = useState(null);
    const [addingNew, setAddingNew] = useState(false);
    const [newGoal, setNewGoal] = useState({ name: "", targetDate: "", statusID: "", comments: "" });
    const [editingGoalId, setEditingGoalId] = useState(null);
    const [editGoalData, setEditGoalData] = useState({});
    const employeeStatuses = useSelector(selectEmployeeStatuses);
    const trainingLevels = useSelector(selectTrainingLevels);
    const developmentPlans = useSelector(selectDevelopmentPlans);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const dispatch = useDispatch();

    const totalPages = Math.ceil(goalList.length / rowsPerPage);
    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentPageContent = goalList.slice(indexOfFirst, indexOfLast);

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




    const fetchGoals = async () => {
        try {
            const whoamiRes = await axios.get("/employees/who-am-i");
            const employeeID = whoamiRes?.data?.body?.userDetails?.id;

            const res = await axios.get(`/employees/${employeeID}`);
            const goals = res?.data?.body?.goals || [];

            setGoalList(goals);
        } catch (error) {
            console.error("Failed to fetch goals:", error?.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleAddGoal = async () => {
        if (!newGoal.name || !newGoal.targetDate) {
            addToast("Name and Target Date are required", { appearance: "warning" });
            return;
        }

        try {
            const whoamiRes = await axios.get("/employees/who-am-i");
            const employeeID = whoamiRes?.data?.body?.userDetails?.id;
            const email = whoamiRes?.data?.body?.userDetails?.email;

            const payload = {
                goal: {
                    name: newGoal.name,
                    targetDate: newGoal.targetDate,
                    comments: newGoal.comments,
                    statusID: parseInt(newGoal.statusID) || 1,
                    employeeID: employeeID,
                },
                createdBy: email
            };

            const response = await axios.post(`/employees/${employeeID}/goals`, payload);

            if (response?.data?.goalID) {
                addToast("Goal added successfully", { appearance: "success" });
                setAddingNew(false);
                setNewGoal({ name: "", targetDate: "", statusID: "", comments: "" });
                fetchGoals();
            } else {
                throw new Error("Goal ID not returned");
            }
        } catch (err) {
            console.error("Goal Add Error:", err);
            addToast("Failed to add goal", { appearance: "error" });
        }
    };

    const handleEditGoal = async (goalId) => {
        try {
            const whoamiRes = await axios.get("/employees/who-am-i");
            const employeeID = whoamiRes?.data?.body?.userDetails?.id;
            const email = whoamiRes?.data?.body?.userDetails?.email;

            const payload = {
                goal: {
                    ...editGoalData,
                    employeeID: employeeID,
                    statusID: parseInt(editGoalData.statusID),
                },
                updatedBy: email
            };

            const response = await axios.put(`/employees/${employeeID}/goals/${goalId}`, payload);

            console.log("Edit Goal Response:", response); // <-- this will show us the truth

            // TEMPORARY: just check for status code for now
            if (response?.status === 200) {
                addToast("Goal updated successfully", { appearance: "success" });
                setEditingGoalId(null);
                fetchGoals();
            } else {
                throw new Error("Update response didn't indicate success");
            }
        } catch (err) {
            console.error("Edit Goal Error:", err);
            addToast("Failed to update goal", { appearance: "error" });
        }
    };

    const getSelectOptions = (options, labelKey = "name") => {
        if (options && options.length) {
            return options.map((o) => {
                const value = Number(o?.id || o?.rID || o?.checklistID);
                const label = o?.[labelKey] || o?.value || o?.title || "Unnamed";
                return { value, label };
            });
        }
        return [];
    };




    const handleDeleteGoal = async (goalId) => {
        try {
            const whoamiRes = await axios.get("/employees/who-am-i");
            const employeeID = whoamiRes?.data?.body?.userDetails?.id;

            const response = await axios.delete(`/employees/${employeeID}/goals/${goalId}`);
            if (response?.data?.success) {
                addToast("Goal deleted successfully", { appearance: "success" });
                await fetchGoals();
            }
        } catch (err) {
            console.error("Delete Goal Error:", err);
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
                                            options={getSelectOptions(field === "statusID" ? employeeStatuses : developmentPlans )}
                                            value={getSelectOptions(field === "statusID" ? employeeStatuses : developmentPlans).find((option) => option.value === Number(newGoal[field])) || "" }
                                            onChange={(e) =>handleInputChange({
                                                    target: {
                                                        name: field,
                                                        value: e.target.value,
                                                    },
                                                }, true)
                                            }
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
                                        setNewGoal({ name: "", targetDate: "", statusID: "", comments: ""});
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
                                        value={getSelectOptions(field === "statusID" ? employeeStatuses : developmentPlans)
                                          .find((option) => option.value === Number(editGoalData[field])) || ""}
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
                                                    onClick={() => {
                                                        handleDeleteGoal(goal.id);
                                                        setShowActionsId(null);
                                                      }}
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
