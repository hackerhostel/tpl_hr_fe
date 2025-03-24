import React, { useEffect, useState } from "react";
import {
  PlusCircleIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  PencilSquareIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import DataGrid, { Column, Paging, Scrolling, Sorting } from "devextreme-react/data-grid";
import "./custom-styles.css";
import { useHistory } from "react-router-dom";

const statusCellRender = (data) => {
  const progressColors = {
    "Not Started": "bg-gray-300",
    "In Progress": "bg-blue-500",
    "Completed": "bg-green-500",
  };
  return (
    <span className={`px-2 py-1 text-white rounded ${progressColors[data.value] || "bg-gray-500"}`}>
      {data.value}
    </span>
  );
};

const GoalsTable = () => {
  const history = useHistory();
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [newRow, setNewRow] = useState(null);
  const [actionRow, setActionRow] = useState(null);

  const dummyGoals = [
    { id: 1, name: "Increase Sales", target: "$50,000", progress: "In Progress", comment: "Need more marketing efforts" },
    { id: 2, name: "Launch New Product", target: "Q3 2025", progress: "Not Started", comment: "Awaiting final prototype" },
    { id: 3, name: "Improve Customer Satisfaction", target: "90%", progress: "Completed", comment: "Achieved through better support" },
    { id: 4, name: "Expand to New Market", target: "Europe", progress: "In Progress", comment: "Research phase ongoing" },
  ];

  useEffect(() => {
    setFilteredGoals(dummyGoals);
  }, []);

  const handleAddNew = () => {
    setNewRow({ id: null, name: "", target: "", progress: "Not Started", comment: "" });
  };

  const handleSave = () => {
    if (newRow) {
      setFilteredGoals([...filteredGoals, { ...newRow, id: filteredGoals.length + 1 }]);
      setNewRow(null);
    }
  };

  const handleClose = () => {
    setNewRow(null);
  };

  const handleActionClick = (id) => {
    setActionRow(actionRow === id ? null : id);
  };

  const handleDelete = (id) => {
    setFilteredGoals(filteredGoals.filter((goal) => goal.id !== id));
  };

  return (
    <div className="px-4">
      <div className="bg-white">
        <div className="flex items-center justify-between p-4">
          <p className="text-secondary-grey text-lg font-medium">
            {`Goals (${filteredGoals.length || 0})`}
          </p>
          <div className="flex items-center space-x-2 text-text-color cursor-pointer" onClick={handleAddNew}>
            <PlusCircleIcon className="w-5 text-text-color" />
            <span>Add New</span>
          </div>
        </div>
        <DataGrid
          dataSource={newRow ? [...filteredGoals, newRow] : filteredGoals}
          allowColumnReordering={true}
          showBorders={false}
          width="100%"
          className="rounded-lg overflow-hidden"
          showRowLines={true}
          showColumnLines={false}
        >
          <Scrolling columnRenderingMode="virtual" />
          <Sorting mode="multiple" />
          <Paging enabled={true} pageSize={4} />

          <Column
            dataField="name"
            caption="Name"
            width={240}
            cellRender={(data) => (
              data.data.id ? (
                <button
                  className="px-2 py-1 text-sm hover:bg-gray-50 rounded-lg text-wrap text-start"
                  onClick={() => history.push(`/goal/${data.data.id}`)}
                >
                  {data.value}
                </button>
              ) : (
                <input
                  className="border p-1 w-full"
                  value={newRow.name}
                  onChange={(e) => setNewRow({ ...newRow, name: e.target.value })}
                />
              )
            )}
          />
          <Column dataField="target" caption="Target" width={100} />
          <Column dataField="progress" caption="Progress" width={180} cellRender={statusCellRender} />
          <Column dataField="comment" caption="Comment" width={100} />
          <Column
            caption="Actions"
            width={100}
            cellRender={(data) => (
              data.data.id ? (
                <div className="relative">
                  <EllipsisVerticalIcon
                    className="w-5 cursor-pointer"
                    onClick={() => handleActionClick(data.data.id)}
                  />
                  {actionRow === data.data.id && (
                    <div className="absolute bg-white shadow-md p-2 right-0 mt-2 rounded-md z-10">
                      <button className="flex items-center space-x-1 text-sm text-gray-700 py-1">
                        <PencilSquareIcon className="w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        className="flex items-center space-x-1 text-sm text-red-500 py-1"
                        onClick={() => handleDelete(data.data.id)}
                      >
                        <TrashIcon className="w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-2">
                  <CheckBadgeIcon className="w-5 text-green-500 cursor-pointer" onClick={handleSave} />
                  <XMarkIcon className="w-5 text-red-500 cursor-pointer" onClick={handleClose} />
                </div>
              )
            )}
          />
        </DataGrid>
      </div>
    </div>
  );
};

export default GoalsTable;
