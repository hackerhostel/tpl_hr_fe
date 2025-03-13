import React from "react";

const IssueListPopup = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[600px]">
      
            <div className="flex justify-end items-center border-b pb-2">
              <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
                ✖
              </button>
            </div>

            <div className="mt-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-gray-500 text-sm border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Summary</th>
                    <th className="text-left p-2">Assignee</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  
                    <tr className="border-b">
                      <td className="p-2">id</td>
                      <td className="p-2">type</td>
                      <td className="p-2">summery</td>
                      <td className="p-2 flex items-center space-x-2">
                        <img alt="Avatar" className="w-6 h-6 rounded-full" />
                        <span>name</span>
                      </td>
                      <td className="p-2">
                      </td>
                    </tr>
                  
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IssueListPopup;
