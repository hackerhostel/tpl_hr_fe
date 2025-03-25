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
import FormInput from "../FormInput"

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
  const [editingRow, setEditingRow] = useState(null);

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
      setFilteredGoals([{ ...newRow, id: filteredGoals.length + 1 }, ...filteredGoals]);
      setNewRow(null);
    }
    if (editingRow) {
      setFilteredGoals(filteredGoals.map(goal => goal.id === editingRow.id ? editingRow : goal));
      setEditingRow(null);
      setActionRow(null);
    }
  };

  const handleClose = () => {
    setNewRow(null);
    setEditingRow(null);
    setActionRow(null);
  };

  const handleActionClick = (id) => {
    setActionRow(actionRow === id ? null : id);
  };

  const handleEdit = (goal) => {
    setEditingRow({ ...goal });
  };

  const handleDelete = (id) => {
    setFilteredGoals(filteredGoals.filter(goal => goal.id !== id));
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
          dataSource={newRow ? [newRow, ...filteredGoals] : filteredGoals}
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
            cellRender={(data) =>
              editingRow && editingRow.id === data.data.id ? (
                <FormInput
                  className="border p-1 w-full"
                  value={editingRow.name}
                  onChange={(e) => setEditingRow({ ...editingRow, name: e.target.value })}
                />
              ) : (
                <span>{data.value}</span>
              )
            }
          />
          <Column
            dataField="target"
            caption="Target"
            cellRender={(data) =>
              editingRow && editingRow.id === data.data.id ? (
                <FormInput
                  className="border p-1 w-full"
                  value={editingRow.target}
                  onChange={(e) => setEditingRow({ ...editingRow, target: e.target.value })}
                />
              ) : (
                <span>{data.value}</span>
              )
            }
          />
          <Column
            dataField="progress"
            caption="Progress"
            cellRender={(data) =>
              editingRow && editingRow.id === data.data.id ? (
                <FormInput
                  className="border p-1 w-full"
                  value={editingRow.progress}
                  onChange={(e) => setEditingRow({ ...editingRow, progress: e.target.value })}
                />
              ) : (
                statusCellRender(data)
              )
            }
          />
          <Column
            dataField="comment"
            caption="Comment"
            cellRender={(data) =>
              editingRow && editingRow.id === data.data.id ? (
                <FormInput
                  className=" p-1 w-full"
                  value={editingRow.comment}
                  onChange={(e) => setEditingRow({ ...editingRow, comment: e.target.value })}
                />
              ) : (
                <span>{data.value}</span>
              )
            }
          />

          <Column
            caption="Actions"
            cellRender={(data) =>
              actionRow === data.data.id ? (
                <div className="flex space-x-2">
                  <PencilSquareIcon className="w-5 text-blue-500 cursor-pointer" onClick={() => handleEdit(data.data)} />
                  <CheckBadgeIcon className="w-5 text-green-500 cursor-pointer" onClick={handleSave} />
                  <XMarkIcon className="w-5 text-red-500 cursor-pointer" onClick={handleClose} />
                  <TrashIcon className="w-5 text-red-500 cursor-pointer" onClick={() => handleDelete(data.data.id)} />
                </div>
              ) : (
                <EllipsisVerticalIcon className="w-5 cursor-pointer" onClick={() => handleActionClick(data.data.id)} />
              )
            }
          />
        </DataGrid>
      </div>
    </div>
  );
};

export default GoalsTable;
