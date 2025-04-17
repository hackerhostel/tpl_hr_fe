import React, { useEffect, useState } from 'react';
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import { useDispatch, useSelector } from "react-redux";
import FormSelect from "../../components/FormSelect.jsx";
import FormInput from "../../components/FormInput.jsx";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import { ChevronRightIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { doGetProjectUsers, setClickedUser } from "../../state/slice/projectUsersSlice.js";
import { sendInvitation } from "../../state/slice/registerSlice.js";
import { useToasts } from "react-toast-notifications";
import axios from "axios";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";
import {
  selectInitialDataError,
  selectInitialDataLoading,
  selectOrganizationUsers
} from "../../state/slice/appSlice.js";

const UserListPage = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const userListError = useSelector(selectInitialDataError);
  const userListForLoading = useSelector(selectInitialDataLoading);
  const userListForOrg = useSelector(selectOrganizationUsers);
  const selectedProject = useSelector(selectSelectedProject);

  const [filteredUserList, setFilteredUserList] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(1);
  const [isEditable, setIsEditable] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [employeeList, setEmployeeList] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    departmentID: "",
    reportingManager: "",
    location: "",
    hiredDate: "",
    userRole: "",
  });

  useEffect(() => {
    if (userListForOrg?.length) {
      setFilteredUserList(userListForOrg);
    } else {
      setFilteredUserList([]);
    }
  }, [userListForOrg]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`/organizations/employees`);
        const employees = response.data.body;
        setEmployeeList(employees);

        const options = employees.map((emp) => ({
          label: `${emp.firstName} ${emp.lastName}`,
          value: emp.id,
        }));

        setUserOptions(options);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleUserChange = (e) => {
    const selectedId = Number(e.target.value);
    const user = employeeList.find((emp) => emp.id === selectedId);
    setSelectedUser(user);
    dispatch(setClickedUser(user));
  };

  useEffect(() => {
    setFormValues({
      firstName: selectedUser?.firstName || '',
      lastName: selectedUser?.lastName || '',
      email: selectedUser?.email || '',
      departmentID: selectedUser?.departmentID || '',
      reportingManager: selectedUser?.reportingManager || '',
      location: selectedUser?.location || '',
      hiredDate: selectedUser?.hiredDate || '',
      contactNumber: selectedUser?.contactNumber || '',
      userRole: selectedUser?.userRole || '',
    });
  }, [selectedUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleEditable = () => {
    setIsEditable(!isEditable);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser?.id) {
      addToast("Please select a user to update.", { appearance: "error" });
      return;
    }

    if (!validateForm()) {
      addToast("Please fix validation errors before submitting.", { appearance: "error" });
      return;
    }

    try {
      const payload = {
        ...formValues,
        id: selectedUser.id,
      };

      await axios.put(`/employees/${selectedUser.id}`, payload);

      addToast("User updated successfully", { appearance: "success" });
      setIsEditable(false);
    } catch (error) {
      console.error("Error updating user:", error);
      addToast("Failed to update user", { appearance: "error" });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formValues.firstName.trim()) errors.firstName = "First name is required";
    if (!formValues.lastName.trim()) errors.lastName = "Last name is required";
    if (!formValues.email.trim()) errors.email = "Email is required";
    if (!formValues.contactNumber.trim()) errors.contactNumber = "Contact number is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };



  if (userListForLoading) return <div className="p-2"><SkeletonLoader /></div>;
  if (userListError) return <ErrorAlert message="Failed to fetch users at the moment" />;

  return (
    <div className="h-list-screen overflow-y-auto w-full pl-3">
      <div className="flex flex-col gap-3 laptopL:w-64 w-full">
        <div>
          <FormSelect
            name="userSelect"
            options={userOptions}
            value={selectedUser?.id || ""}
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
                      {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                    </div>
                  )}
                </div>
              )}

              <span className="text-xl font-semibold mt-5 text-secondary-grey mb-1">
                {selectedUser?.firstName} {selectedUser?.lastName}
              </span>
              <div className='bg-task-status-qa px-2 mt-1 rounded-md'>
                <span className="text-xs">Admin</span>
              </div>

              <div className='flex gap-2 mt-5'>


                <button className="bg-primary-pink text-white rounded-md px-4 py-2" style={{ width: "185px" }}>
                  INVITE
                </button>
              </div>

              <hr className="w-full mt-6 border-t border-gray-200" />

              <div className="w-full space-y-4 mt-6">
                <FormInput
                  name="firstName"
                  placeholder="First Name"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${isEditable ? "bg-white" : "bg-user-detail-box cursor-not-allowed"}`} disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true} showLabel={true}
                />

                <FormInput
                  name="lastName"
                  placeholder="Last Name"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${isEditable ? "bg-white" : "bg-user-detail-box cursor-not-allowed"}`} disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true} showLabel={true}
                />

                <FormInput
                  name="email"
                  placeholder="Email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${isEditable ? "bg-white" : "bg-user-detail-box cursor-not-allowed"}`} disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true} showLabel={true}
                />

                <FormInput
                  name="contactNumber"
                  placeholder="Phone"
                  value={formValues.contactNumber}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${isEditable ? "bg-white" : "bg-user-detail-box cursor-not-allowed"}`} disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true} showLabel={true}
                />


                <FormInput
                  name="departmentID"
                  placeholder="Department"
                  value={formValues.departmentID}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${isEditable ? "bg-white" : "bg-user-detail-box cursor-not-allowed"}`} disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true} showLabel={true}
                />


                <FormSelect name="reportedTo" options={userOptions} value={selectedUser?.id || ""} onChange={handleUserChange} placeholder="Reported To" />

                <FormInput
                  name="hiredDate"
                  placeholder="Hired Date"
                  value={formValues.hiredDate}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${isEditable ? "bg-white" : "bg-user-detail-box cursor-not-allowed"}`} disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true} showLabel={true}
                />


                <FormInput
                  name="location"
                  placeholder="Location"
                  value={formValues.location}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${isEditable ? "bg-white" : "bg-user-detail-box cursor-not-allowed"}`} disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true} showLabel={true}
                />

                <FormInput
                  name="userRole"
                  placeholder="Role"
                  value={formValues.userRole}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${isEditable ? "bg-white" : "bg-user-detail-box cursor-not-allowed"}`}
                  disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true}
                  showLabel={true}
                />




                {/* <FormSelect name="status" options={userOptions} value={selectedUser?.id || ""} onChange={handleUserChange} placeholder="Status" /> */}

                <button type="submit" onClick={handleUpdateUser} className="px-4 py-2 bg-primary-pink w-full text-white rounded-md">
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
