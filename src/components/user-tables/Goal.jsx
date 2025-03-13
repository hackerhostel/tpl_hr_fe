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
    { id: 1, name: "Increase Sales", target: "$50,000", progress: "In Progress", comment: "Need more marketing efforts" },
    { id: 2, name: "Launch New Product", target: "Q3 2025", progress: "Not Started", comment: "Awaiting final prototype" },
    { id: 3, name: "Improve Customer Satisfaction", target: "90%", progress: "Completed", comment: "Achieved through better support" },
    { id: 4, name: "Expand to New Market", target: "Europe", progress: "In Progress", comment: "Research phase ongoing" },
  ];

  useEffect(() => {
    setFilteredGoals(dummyGoals);
  }, []);

  return (
   <div className="px-4">
      {/* Goals Header */}
      <div className="bg-white">
        <div  className="flex items-center justify-between p-4">
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
          dataField="name"
          caption="Name"
          width={240}
          cellRender={(data) => (
            <button
              className="px-2 py-1 text-sm hover:bg-gray-50 rounded-lg text-wrap text-start"
              onClick={() => history.push(`/goal/${data.data.id}`)}
            >
              {data.value}
            </button>
          )}
        />
        <Column dataField="target" caption="Target" width={100} />
        <Column
          dataField="progress"
          caption="Progress"
          width={180}
          cellRender={statusCellRender} 
        />
        <Column dataField="comment" caption="Comment" className="text-left" width={100} />
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
