import React, { useEffect, useState } from 'react';
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import { useDispatch, useSelector } from "react-redux";
import FormSelect from "../../components/FormSelect.jsx";
import FormInput from "../../components/FormInput.jsx";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline/index.js";
import { doGetProjectUsers, setClickedUser } from "../../state/slice/projectUsersSlice.js";
import { sendInvitation } from "../../state/slice/registerSlice.js";
import { useToasts } from "react-toast-notifications";
import axios from "axios";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";
import { PencilIcon } from '@heroicons/react/24/outline/index.js';
import { selectInitialDataError, selectInitialDataLoading, selectOrganizationUsers } from "../../state/slice/appSlice.js";

const UserListPage = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const userListError = useSelector(selectInitialDataError);
  const userListForLoading = useSelector(selectInitialDataLoading);
  const userListForOrg = useSelector(selectOrganizationUsers);
  const selectedProject = useSelector(selectSelectedProject);

  const [filteredUserList, setFilteredUserList] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(1);

  const [isEditable, setIsEditable] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(1); // Default user is Alice (ID = 1)

  useEffect(() => {
    if (userListForOrg && userListForOrg.length) {
      setFilteredUserList(userListForOrg);
    } else {
      setFilteredUserList([]);
    }
  }, [userListForOrg]);

  const dummyUsers = [
    { id: 1, firstName: "Alice", lastName: "Johnson", email: "alice@example.com", avatar: "" },
    { id: 2, firstName: "Bob", lastName: "Smith", email: "bob@example.com", avatar: "" },
    { id: 3, firstName: "Charlie", lastName: "Brown", email: "charlie@example.com", avatar: "" }
  ];

  const selectedUser = dummyUsers.find(user => user.id === selectedUserId);

  const userOptions = dummyUsers.map(user => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}`
  }));

  const handleUserChange = (e) => {
    setSelectedUserId(Number(e.target.value));
  };


  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(`/employees/${selectedUserId}`)

        console.log("Employee details:", response.data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };
  
    if (selectedUserId) {
      fetchEmployeeDetails();
    }
  }, [selectedUserId]);
  

  const toggleEditable = () => {
    setIsEditable(!isEditable);
  };

  const [formValues, setFormValues] = useState({
    email: selectedUser?.email,
    contactNumber: selectedUser?.contactNumber,
    teamID: selectedUser?.teamID,
    userRole: selectedUser?.userRole,
  });

  useEffect(() => {
    setFormValues({
      email: selectedUser?.email,
      contactNumber: selectedUser?.contactNumber,
      teamID: selectedUser?.teamID,
      userRole: selectedUser?.userRole,
    });
  }, [selectedUser]);

  if (userListForLoading) return <div className="p-2"><SkeletonLoader /></div>;
  if (userListError) return <ErrorAlert message="failed to fetch users at the moment" />;

  return (
    <div className="h-list-screen overflow-y-auto w-full pl-3">
      <div className="flex flex-col gap-3 laptopL:w-64 w-full">
        <div>
          <FormSelect
            name="userSelect"
            options={userOptions}
            value={selectedUserId}
            onChange={handleUserChange}
          />
        </div>

        {/* Invite Section */}
        <div className="flex items-center gap-2">
          <div className="w-72 bg-white rounded-lg p-2 h-fit">
            <div className='flex justify-end'>
              <PencilIcon onClick={toggleEditable} className='w-4 text-secondary-grey cursor-pointer' />
            </div>
            <div className="flex flex-col items-center">
              {selectedUser && (
                <div key={selectedUser.id} className="flex items-center gap-3">
                  {selectedUser.avatar ? (
                    <img
                      src={selectedUser.avatar}
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
                      {selectedUser.firstName[0]}
                      {selectedUser.lastName[0]}
                    </div>
                  )}
                </div>
              )}
              <span className="text-xl font-semibold mt-5 text-secondary-grey mb-1">{selectedUser?.firstName} {selectedUser?.lastName}</span>
              <div className='bg-task-status-qa px-2 mt-1 rounded-md'>
                <span className="text-xs">Admin</span>
              </div>

              <div className='flex gap-2 mt-5'>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="border border-gray-300 rounded-md  w-full"
                >
                  {roles?.map((r) => (
                    <option key={r.id} value={r.id}>{r.value}</option>
                  ))}
                </select>

                <button
                  className="bg-primary-pink text-white rounded-md px-4 py-2"
                  style={{ width: "185px" }}
                >
                  INVITE
                </button>
              </div>

              <hr className="w-full mt-6 border-t border-gray-200" />

              <div className="w-full space-y-4 mt-6">

                <FormInput
                  name="firstName"
                  formValues={formValues}
                  placeholder="First Name"
                  className={`w-full p-2 border rounded-md ${isEditable
                    ? "bg-white text-secondary-grey border-border-color"
                    : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                    }`}
                  disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true}
                  showLabel={true}
                />


                <FormInput
                  name="secondName"
                  formValues={formValues}
                  placeholder="Second Name"
                  className={`w-full p-2 border rounded-md ${isEditable
                    ? "bg-white text-secondary-grey border-border-color"
                    : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                    }`}
                  disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true}
                  showLabel={true}
                />

                <FormInput
                  name="email"
                  formValues={formValues}
                  placeholder="Email"
                  className={`w-full p-2 border rounded-md ${isEditable
                    ? "bg-white text-secondary-grey border-border-color"
                    : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                    }`}
                  disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true}
                  showLabel={true}
                />

                <FormInput
                  name="phone"
                  formValues={formValues}
                  placeholder="Phone"
                  className={`w-full p-2 border rounded-md ${isEditable
                    ? "bg-white text-secondary-grey border-border-color"
                    : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                    }`}
                  disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true}
                  showLabel={true}
                />

                <FormSelect
                  name="userSelect"
                  options={userOptions}
                  value={selectedUserId}
                  onChange={handleUserChange}
                  placeholder="Department"
                />

                <FormSelect
                  name="userSelect"
                  options={userOptions}
                  value={selectedUserId}
                  onChange={handleUserChange}
                  placeholder="Reported To"
                />




                <FormInput
                  name="hireDate"
                  formValues={formValues}
                  placeholder="Hire Date"
                  className={`w-full p-2 border rounded-md ${isEditable
                    ? "bg-white text-secondary-grey border-border-color"
                    : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                    }`}
                  disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true}
                  showLabel={true}
                />



                <FormInput
                  name="location"
                  formValues={formValues}
                  placeholder="Location"
                  className={`w-full p-2 border rounded-md ${isEditable
                    ? "bg-white text-secondary-grey border-border-color"
                    : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                    }`}
                  disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true}
                  showLabel={true}
                />

                <FormSelect
                  name="userSelect"
                  options={userOptions}
                  value={selectedUserId}
                  onChange={handleUserChange}
                  placeholder="Status"
                />

                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-pink w-full text-white rounded-md"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>



      </div>
    </div>
  );
};

export default UserListPage;
