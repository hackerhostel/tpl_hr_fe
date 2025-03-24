import React, { useState } from 'react';
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline/index.js";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";

const RoleListPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Dummy role list
  const dummyRoles = [
    { id: 1, name: "Web Developer" },
    { id: 2, name: "SEO Analyst" }
  ];

  const handleDeleteClick = (role) => {
    setSelectedRole(role);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log(`Deleting role: ${selectedRole?.name}`);
    setIsDialogOpen(false);
    setSelectedRole(null);
  };

  return (
    <div className="h-list-screen w-full">
      <div className="h-[calc(100vh-250px)] overflow-y-auto flex flex-col gap-3 pl-5 pr-1 mt-6">
        {dummyRoles.length === 0 ? (
          <div className="text-center text-gray-600">No roles found</div>
        ) : (
          dummyRoles.map((role) => (
            <div
              style={{ width: "256px" }}
              onClick={() => setSelectedRole(role)}
              key={role.id}
              className={`flex justify-between items-center p-3 border rounded-md w-full gap-2 hover:bg-gray-100 cursor-pointer ${selectedRole?.id === role.id ? 'border-primary-pink' : 'border-gray-200'}`}
            >
              <div className="col-span-2 text-left flex flex-col gap-1">
                <div className="font-bold">{role.name}</div>
              </div>
              <div className="flex gap-1">
               
                <ChevronRightIcon className="w-4 h-4 text-black cursor-pointer" />
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedRole(null);
        }}
        onConfirm={handleConfirmDelete}
        message={selectedRole ? `To delete role - ${selectedRole.name}?` : ''}
      />
    </div>
  );
};

export default RoleListPage;
