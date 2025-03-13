import React, { useState } from "react";
import FormSelect from "../../components/FormSelect";

const AddIssuePopup = ({ isOpen, onClose }) => {
  const [selectedIssue, setSelectedIssue] = useState(null);


  const issueTypes = [
    { label: "Bug", value: "bug" },
    { label: "Task", value: "task" },
    { label: "Story", value: "story" },
    { label: "Epic", value: "epic" },
  ];

  const handleAddIssue = () => {
    console.log("Selected Issue Type:", selectedIssue);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        
   
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-lg font-semibold">Add Issue</span>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            ✖
          </button>
        </div>

        
        <div className="mt-4">
          <label className="text-sm text-gray-500">Select Issue</label>
          <FormSelect
            name="issueType"
            showLabel={false}
            formValues={{ issueType: selectedIssue }}
            placeholder="Select an issue type"
            options={issueTypes}
            onChange={(e, value) => setSelectedIssue(value)}
          />
        </div>

      
        <div className="flex justify-between space-x-2 mt-6">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleAddIssue}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddIssuePopup;
