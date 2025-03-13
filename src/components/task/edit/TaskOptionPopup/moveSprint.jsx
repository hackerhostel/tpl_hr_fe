import React, { useState } from "react";
import FormInput from "../../../../components/FormInput";
import FormSelect from "../../../../components/FormSelect";

const MoveSprintPopup = ({ isOpen, onClose }) => {
  // Mock current sprint data (selected from store)
  const currentSprint = { id: "sprint_1", name: "Sprint Q1 - Development" };

  // Mock new sprint options
  const newSprintOptions = [
    { label: "Sprint Q2 - Testing", value: "sprint_2" },
    { label: "Sprint Q3 - Deployment", value: "sprint_3" },
    { label: "Sprint Q4 - Optimization", value: "sprint_4" },
  ];

  const [selectedNewSprint, setSelectedNewSprint] = useState(null);

  const handleMoveSprint = () => {
    console.log("Moving to Sprint:", selectedNewSprint);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[500px]">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-lg font-semibold">
            Move Sprint: <span className="text-sm">Select Sprint</span>
          </span>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* Body */}
        <div className="mt-4">
          {/* Current Sprint */}
          <label className="text-sm text-gray-500">Current Sprint</label>
          <FormInput
            name="currentSprint"
            formValues={{ currentSprint: currentSprint.name || "N/A" }}
            placeholder="Current Sprint"
            className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
            disabled={true}
            showErrors={false}
            showLabel={false}
          />

          {/* New Sprint Selection */}
          <label className="text-sm text-gray-500 mt-4 block">New Sprint</label>
          <FormSelect
            name="newSprint"
            showLabel={false}
            formValues={{ newSprint: selectedNewSprint }}
            placeholder="Select a new sprint"
            options={newSprintOptions}
            onChange={(e, value) => setSelectedNewSprint(value)}
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between space-x-2 mt-6">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`btn-primary`}
            onClick={handleMoveSprint}
           
          >
            Move Sprint
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveSprintPopup;
