import React, { useEffect, useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline/index.js";
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  Sorting,
} from "devextreme-react/data-grid";
import "./custom-styles.css";
import { useHistory } from "react-router-dom";

// Dummy function for rendering progress badges
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

  const dummyGoals = [
    {
      id: 1,
      courseName: "React Fundamentals",
      target: "Complete",
      certification: "In Progress",
      provider: "Udemy",
      dueDate: "2025-06-01",
      expDate: "2027-06-01",
    },
    {
      id: 2,
      courseName: "AWS Certified Developer",
      target: "Pass Exam",
      certification: "Not Started",
      provider: "AWS Training",
      dueDate: "2025-09-15",
      expDate: "2028-09-15",
    },
    {
      id: 3,
      courseName: "Data Structures & Algorithms",
      target: "Complete",
      certification: "Completed",
      provider: "Coursera",
      dueDate: "2024-12-10",
      expDate: "2026-12-10",
    },
    {
      id: 4,
      courseName: "Python for Data Science",
      target: "Earn Certificate",
      certification: "In Progress",
      provider: "edX",
      dueDate: "2025-03-20",
      expDate: "2027-03-20",
    },
  ];

  useEffect(() => {
    setFilteredGoals(dummyGoals);
  }, []);

  return (
   <div className="px-4">
      {/* Goals Header */}
      <div className="bg-white">
        <div  className="flex items-center justify-between p-4 ">
        <p className="text-secondary-grey text-lg font-medium">
          {`Goals (${filteredGoals.length || 0})`}
        </p>
       <div className="flex items-center space-x-2 text-text-color">
        <PlusCircleIcon className="w-5 text-text-color"/>
        <span>Add New</span>
       </div>
      </div>
      
      

      {/* Goals Table */}
      <DataGrid
        dataSource={filteredGoals}
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
          dataField="courseName"
          caption="Course Name"
          width={150}
          cellRender={(data) => (
            <button
              className="px-2 py-1 text-sm hover:bg-gray-50 rounded-lg text-wrap text-start"
              onClick={() => history.push(`/goal/${data.data.id}`)}
            >
              {data.value}
            </button>
          )}
        />
        <Column dataField="target" caption="Target" width={90} />
        <Column
          dataField="certification"
          caption="Certification"
          width={180}
          cellRender={statusCellRender} 
        />
        <Column dataField="provider" caption="Provider" className="text-left" width={90} />
        <Column dataField="dueDate" caption="Due Date" className="text-left" width={90} />
        <Column dataField="expDate" caption="Exp Date" className="text-left" width={90} />
        <div className="flex justify-center mt-3 text-sm text-gray-500">
        <button className="px-2">&lt;</button>
        <span className="mx-2 text-primary font-bold">01</span>
        <span className="mx-2">02</span>
        <button className="px-2">&gt;</button>
      </div>
      </DataGrid>
      </div>

    </div>
  );
};

export default GoalsTable;
