import React, { useEffect, useState, useRef } from "react";
import {
  PlusCircleIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import DataGrid, { Column, Paging, Scrolling, Sorting } from "devextreme-react/data-grid";
import { useHistory } from "react-router-dom";
import FormInput from "../FormInput";
import "./custom-styles.css";

const GoalsTable = () => {
  const history = useHistory();
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRefs = useRef(new Map());

  const [newGoal, setNewGoal] = useState({
    id: null,
    courseName: "",
    target: "",
    certification: "",
    provider: "",
    dueDate: "",
    expDate: "",
  });

  const dummyGoals = [
    { id: 1, courseName: "React Fundamentals", target: "Complete", certification: "In Progress", provider: "Udemy", dueDate: "2025-06-01", expDate: "2027-06-01" },
    { id: 2, courseName: "AWS Certified Developer", target: "Pass Exam", certification: "Not Started", provider: "AWS Training", dueDate: "2025-09-15", expDate: "2028-09-15" },
    { id: 3, courseName: "Data Structures & Algorithms", target: "Complete", certification: "Completed", provider: "Coursera", dueDate: "2024-12-10", expDate: "2026-12-10" },
    { id: 4, courseName: "Python for Data Science", target: "Earn Certificate", certification: "In Progress", provider: "edX", dueDate: "2025-03-20", expDate: "2027-03-20" },
  ];

  useEffect(() => {
    setFilteredGoals(dummyGoals);

    const handleClickOutside = (event) => {
      if (![...menuRefs.current.values()].some((ref) => ref?.contains(event.target))) {
        setMenuOpenId(null);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddNew = () => setIsAdding(true);

  const handleInputChange = (e, field) => {
    setNewGoal({ ...newGoal, [field]: e.target.value });
  };

  const handleEditChange = (e, id, field) => {
    setFilteredGoals(filteredGoals.map(goal => goal.id === id ? { ...goal, [field]: e.target.value } : goal));
  };

  const handleSave = () => {
    if (newGoal.courseName.trim()) {
      setFilteredGoals([{ ...newGoal, id: filteredGoals.length + 1 }, ...filteredGoals]);
      setNewGoal({ id: null, courseName: "", target: "", certification: "", provider: "", dueDate: "", expDate: "" });
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewGoal({ id: null, courseName: "", target: "", certification: "", provider: "", dueDate: "", expDate: "" });
  };

  const handleEdit = (id) => {
    setEditRowId(id);
    setMenuOpenId(null);
  };

  const handleDelete = (id) => {
    setFilteredGoals(filteredGoals.filter(goal => goal.id !== id));
    setMenuOpenId(null);
  };

  return (
    <div className="px-4">
      <div className="bg-white">
        <div className="flex items-center justify-between p-4">
          <p className="text-secondary-grey text-lg font-medium">
            {`Certification (${filteredGoals.length})`}
          </p>
          <div className="flex items-center space-x-2 text-text-color cursor-pointer" onClick={handleAddNew}>
            <PlusCircleIcon className="w-5 text-text-color" />
            <span>Add New</span>
          </div>
        </div>

        <DataGrid
          dataSource={isAdding ? [newGoal, ...filteredGoals] : filteredGoals}
          allowColumnReordering
          showBorders={false}
          width="100%"
          className="rounded-lg overflow-hidden"
          showRowLines
          showColumnLines={false}
        >
          <Scrolling columnRenderingMode="virtual" />
          <Sorting mode="multiple" />
          <Paging enabled pageSize={4} />

          {["courseName", "target", "certification", "provider", "dueDate", "expDate"].map((field) => (
            <Column
              key={field}
              dataField={field}
              caption={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              width={field === "courseName" ? 150 : 100}
              cellRender={(data) => {
                if (isAdding && data.data.id === null) {
                  return <FormInput type="text" name={field} placeholder={field} value={newGoal[field]} onChange={(e) => handleInputChange(e, field)} />;
                }
                if (editRowId === data.data.id) {
                  return <FormInput type="text" name={field} placeholder={field} value={data.data[field]} onChange={(e) => handleEditChange(e, data.data.id, field)} />;
                }
                return data.value;
              }}
            />
          ))}

          <Column
            caption="Actions"
            width={100}
            cellRender={(data) => {
              if (isAdding && data.data.id === null) {
                return (
                  <div className="flex space-x-2">
                    <button className="text-green-600 hover:text-green-800" onClick={handleSave}>
                      <CheckBadgeIcon className="w-5 h-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800" onClick={handleCancel}>
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                );
              }

              return (
                <div className="relative" ref={(el) => menuRefs.current.set(data.data.id, el)}>
                  <button
                    className="p-2 text-text-color cursor-pointer"
                    onClick={() => setMenuOpenId(menuOpenId === data.data.id ? null : data.data.id)}
                  >
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </button>

                  {menuOpenId === data.data.id && (
                    <div className="absolute right-0 bg-white shadow-md rounded-md p-2 z-10 w-28">
                      <button className="flex items-center text-gray-700 px-2 py-1 hover:bg-gray-100 rounded w-full" onClick={() => handleEdit(data.data.id)}>
                        <PencilSquareIcon className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button className="flex items-center text-red-600 px-2 py-1 hover:bg-gray-100 rounded w-full" onClick={() => handleDelete(data.data.id)}>
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            }}
          />
        </DataGrid>
      </div>
    </div>
  );
};

export default GoalsTable;
