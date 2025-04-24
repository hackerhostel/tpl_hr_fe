import React, { useEffect, useState } from "react";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import { useDispatch, useSelector } from "react-redux";
import FormSelect from "../../components/FormSelect.jsx";
import FormInput from "../../components/FormInput.jsx";
import { selectSelectedProject } from "../../state/slice/projectSlice.js";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import {
  ChevronRightIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import {
  doGetProjectUsers,
  setClickedUser,
} from "../../state/slice/projectUsersSlice.js";
import { sendInvitation } from "../../state/slice/registerSlice.js";
import { useToasts } from "react-toast-notifications";
import axios from "axios";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";
import {
  selectInitialDataError,
  selectInitialDataLoading,
  selectOrganizationUsers,
} from "../../state/slice/appSlice.js";
import {
  selectUserRoles,
  selectDesignations,
  selectReportingManagers,
  selectDepartments,
  selectEmployeeStatuses,
} from "../../state/slice/masterDataSlice.js";
import {
  selectUser,
  selectInitialUserDataLoading,
  selectInitialUserDataError,
} from "../../state/slice/authSlice.js";

const UserListPage = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const userListError = useSelector(selectInitialDataError);
  const userListForLoading = useSelector(selectInitialDataLoading);
  const userListForOrg = useSelector(selectOrganizationUsers);
  const selectedProject = useSelector(selectSelectedProject);
  const userRoles = useSelector(selectUserRoles);
  const designations = useSelector(selectDesignations);
  const reportingManagers = useSelector(selectReportingManagers);
  const departments = useSelector(selectDepartments);
  const employeeStatuses = useSelector(selectEmployeeStatuses);
  const currentUser = useSelector(selectUser);
  const userDataLoading = useSelector(selectInitialUserDataLoading);
  const userDataError = useSelector(selectInitialUserDataError);

  const [filteredUserList, setFilteredUserList] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
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
    departmentName: "",
    reportingManager: "",
    reportingManagerName: "",
    location: "",
    hiredDate: "",
    userRole: "",
    roleName: "",
    designation: "",
    designationName: "",
    status: "",
    statusName: "",
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

        if (currentUser && !selectedUser) {
          const loggedInUser = employees.find(
            (emp) => emp.id === currentUser.id
          );
          if (loggedInUser) {
            setSelectedUser(loggedInUser);
            dispatch(setClickedUser(loggedInUser));
          }
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [currentUser, selectedUser, dispatch]);

  const handleUserChange = (e) => {
    const selectedId = Number(e.target.value);
    const user = employeeList.find((emp) => emp.id === selectedId);
    setSelectedUser(user);
    dispatch(setClickedUser(user));
  };

  useEffect(() => {
    if (selectedUser) {
      const reportingManager = employeeList.find(
        (emp) => emp.id === selectedUser.reportingManager
      );

      const roleName =
        userRoles.find((r) => r.id === Number(selectedUser.userRole))?.name ||
        "N/A";

      const deptName =
        departments.find((d) => d.id === Number(selectedUser.departmentID))
          ?.name || "N/A";

      const managerName =
        userOptions.find((opt) => opt.value === selectedUser.reportingManager)
          ?.label || "N/A";

      const designationObj = designations.find(
        (d) => String(d.id) === String(selectedUser.designationID)
      );
      const designationName = designationObj ? designationObj.title : "N/A";

      const statusName =
        employeeStatuses.find(
          (s) => s.id === Number(selectedUser.employeeStatusID)
        )?.name || "N/A";

      setFormValues({
        firstName: selectedUser.firstName || "",
        lastName: selectedUser.lastName || "",
        email: selectedUser.email || "",
        contactNumber: selectedUser.contactNumber || "",
        departmentID: selectedUser.departmentID || "",
        departmentName: deptName,
        reportingManager: selectedUser.reportingManager || "",
        reportingManagerName: managerName,
        location: selectedUser.location || "",
        hiredDate: selectedUser.hiredDate
          ? selectedUser.hiredDate.split("T")[0]
          : "",
        userRole: selectedUser.userRole || "",
        roleName: roleName,
        designation: selectedUser.designationID || "",
        designationName: designationName,
        employeeStatusID: Number(formValues.status),
        statusName:
          employeeStatuses.find((s) => s.id === Number(formValues.status))
            ?.name || formValues.statusName,
        id: selectedUser.id,
      });

      setSelectedRole(selectedUser.userRole || "");
      setFormErrors({});
    }
  }, [
    selectedUser,
    employeeList,
    userRoles,
    departments,
    userOptions,
    designations,
    employeeStatuses,
  ]);

  const handleInputChange = (e, isText = true) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: isText ? value : value,
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

    try {
      const payload = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        contactNumber: formValues.contactNumber,
        departmentID: Number(formValues.departmentID),
        departmentName:
          departments.find((d) => d.id === Number(formValues.departmentID))
            ?.name || formValues.departmentName,
        reportingManager: Number(formValues.reportingManager),
        reportingManagerName:
          userOptions.find((opt) => opt.value === formValues.reportingManager)
            ?.label || formValues.reportingManagerName,
        location: formValues.location,
        hiredDate: formValues.hiredDate,
        userRole: Number(formValues.userRole),
        roleName:
          userRoles.find((r) => r.id === Number(formValues.userRole))?.name ||
          formValues.roleName,
        designationID: Number(formValues.designation),
        designationName:
          designations.find((d) => d.id === Number(formValues.designation))
            ?.title || formValues.designationName,
        status: Number(formValues.status),
        statusName:
          employeeStatuses.find((s) => s.id === Number(formValues.status))
            ?.name || formValues.statusName,
        id: selectedUser.id,
      };

      await axios.put(`/employees/${selectedUser.id}`, payload);

      const response = await axios.get(`/organizations/employees`);
      const employees = response.data.body;
      setEmployeeList(employees);

      const updatedUser = employees.find((emp) => emp.id === selectedUser.id);
      setSelectedUser(updatedUser);

      addToast("User updated successfully", { appearance: "success" });
      setIsEditable(false);
    } catch (error) {
      console.error("Error updating user:", error);
      addToast("Failed to update user", { appearance: "error" });
    }
  };

  if (userListForLoading || userDataLoading)
    return (
      <div className="p-2">
        <SkeletonLoader />
      </div>
    );
  if (userListError || userDataError)
    return <ErrorAlert message="Failed to fetch users at the moment" />;

  return (
    <div className="h-list-screen overflow-y-auto w-full pl-3">
      <div className="flex flex-col gap-3 laptopL:w-64 w-full">
        <div>
          <FormSelect
            name="userSelect"
            options={userOptions}
            value={selectedUser?.id || ""}
            onChange={handleUserChange}
            placeholder="Select User"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-96 bg-white rounded-lg p-2 h-fit">
            <div className="flex justify-end">
              <PencilIcon
                onClick={toggleEditable}
                className="w-4 text-secondary-grey cursor-pointer"
              />
            </div>
            <div className="flex flex-col items-center">
              {selectedUser && (
                <div key={selectedUser.id} className="flex items-center gap-3">
                  {selectedUser.avatar ? (
                    <img
                      src={selectedUser.avatar}
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
                      {selectedUser.firstName?.[0]}
                      {selectedUser.lastName?.[0]}
                    </div>
                  )}
                </div>
              )}
              <span className="text-xl font-semibold mt-5 text-secondary-grey mb-1">
                {selectedUser?.firstName} {selectedUser?.lastName}
              </span>
              <div className="bg-task-status-qa px-2 mt-1 rounded-md">
                <span className="text-xs">
                  {formValues.roleName || "N/A"} | EMP ID - {selectedUser?.id}
                </span>
              </div>

              <div className="flex gap-2 mt-5 items-center">
                {isEditable ? (
                  <div className="flex-1">
                    <FormSelect
                      name="userRole"
                      options={userRoles.map((r) => ({
                        label: r.name,
                        value: String(r.id),
                      }))}
                      value={String(formValues.userRole)}
                      onChange={(e) => {
                        setSelectedRole(e.target.value);
                        setFormValues((prev) => ({
                          ...prev,
                          userRole: e.target.value,
                          roleName:
                            userRoles.find(
                              (r) => String(r.id) === String(e.target.value)
                            )?.name || e.target.value,
                        }));
                      }}
                      className="w-full p-2 border rounded-md h-10"
                    />
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-md flex-1 p-2">
                    {formValues.roleName || "N/A"}
                  </div>
                )}

                <button
                  onClick={() => {
                    if (selectedRole) {
                      addToast("User invited successfully", {
                        appearance: "success",
                      });
                    } else {
                      addToast("Please select a role to invite.", {
                        appearance: "error",
                      });
                    }
                  }}
                  className="bg-primary-pink text-white rounded-md py-1 px-4 min-w-[100px] h-10"
                >
                  INVITE
                </button>
              </div>
              <hr className="w-full mt-6 border-t border-gray-200" />
              <div className="w-full space-y-4 mt-6">
                <FormInput
                  name="firstName"
                  placeholder="First Name"
                  formValues={formValues}
                  onChange={(e) => handleInputChange(e, true)}
                  className={`w-full p-2 border rounded-md ${
                    isEditable
                      ? "bg-white"
                      : "bg-user-detail-box cursor-not-allowed"
                  }`}
                  disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true}
                  showLabel={true}
                />
                <FormInput
                  name="lastName"
                  placeholder="Last Name"
                  formValues={formValues}
                  onChange={(e) => handleInputChange(e, true)}
                  className={`w-full p-2 border rounded-md ${
                    isEditable
                      ? "bg-white"
                      : "bg-user-detail-box cursor-not-allowed"
                  }`}
                  disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true}
                  showLabel={true}
                />
                <FormInput
                  name="email"
                  placeholder="Email"
                  label="Email"
                  formValues={formValues}
                  onChange={(e) => handleInputChange(e, true)}
                  className={`w-full p-2 border rounded-md ${
                    isEditable
                      ? "bg-white"
                      : "bg-user-detail-box cursor-not-allowed"
                  }`}
                  disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true}
                  showLabel={true}
                />
                <FormInput
                  name="contactNumber"
                  placeholder="Phone"
                  formValues={formValues}
                  onChange={(e) => handleInputChange(e, true)}
                  className={`w-full p-2 border rounded-md ${
                    isEditable
                      ? "bg-white"
                      : "bg-user-detail-box cursor-not-allowed"
                  }`}
                  disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true}
                  showLabel={true}
                />
                {isEditable ? (
                  <FormSelect
                    name="departmentID"
                    options={departments.map((d) => ({
                      label: d.name,
                      value: String(d.id),
                    }))}
                    value={String(formValues.departmentID)}
                    onChange={(e) => {
                      const dept = departments.find(
                        (d) => String(d.id) === String(e.target.value)
                      );
                      setFormValues((prev) => ({
                        ...prev,
                        departmentID: e.target.value,
                        departmentName: dept ? dept.name : e.target.value,
                      }));
                    }}
                    placeholder="Department"
                  />
                ) : (
                  <FormInput
                    name="departmentName"
                    placeholder="Department"
                    formValues={formValues}
                    className={`w-full p-2 border rounded-md ${
                      isEditable
                        ? "bg-white"
                        : "bg-user-detail-box cursor-not-allowed"
                    }`}
                    disabled={true}
                    showLabel={true}
                  />
                )}
                {isEditable ? (
                  <FormSelect
                    name="reportingManager"
                    options={userOptions}
                    value={String(formValues.reportingManager || "")}
                    onChange={(e) => {
                      const manager = userOptions.find(
                        (opt) => String(opt.value) === String(e.target.value)
                      );
                      setFormValues((prev) => ({
                        ...prev,
                        reportingManager: e.target.value,
                        reportingManagerName: manager
                          ? manager.label
                          : e.target.value,
                      }));
                    }}
                    placeholder="Reported To"
                  />
                ) : (
                  <FormInput
                    name="reportingManagerName"
                    placeholder="Reported To"
                    formValues={formValues}
                    className={`w-full p-2 border rounded-md ${
                      isEditable
                        ? "bg-white"
                        : "bg-user-detail-box cursor-not-allowed"
                    }`}
                    disabled={true}
                    showLabel={true}
                  />
                )}

                {isEditable ? (
                  <div className="relative">
                    <FormInput
                      name="hiredDate"
                      type="date"
                      placeholder="Hired Date"
                      formValues={formValues}
                      onChange={(e) => handleInputChange(e, true)}
                      className={`w-full p-2 border rounded-md ${
                        isEditable
                          ? "bg-white"
                          : "bg-user-detail-box cursor-not-allowed"
                      }`}
                      disabled={!isEditable}
                      formErrors={formErrors}
                      showErrors={true}
                      showLabel={true}
                    />
                  </div>
                ) : (
                  <FormInput
                    name="hiredDate"
                    placeholder="Hired Date"
                    type="text"
                    formValues={formValues}
                    className="w-full p-2 border rounded-md bg-user-detail-box cursor-not-allowed"
                    disabled={true}
                    showLabel={true}
                  />
                )}
                <FormInput
                  name="location"
                  placeholder="Location"
                  formValues={formValues}
                  onChange={(e) => handleInputChange(e, true)}
                  className={`w-full p-2 border rounded-md ${
                    isEditable
                      ? "bg-white"
                      : "bg-user-detail-box cursor-not-allowed"
                  }`}
                  disabled={!isEditable}
                  formErrors={formErrors}
                  showErrors={true}
                  showLabel={true}
                />
                {isEditable ? (
                  <FormSelect
                    name="userRole"
                    options={userRoles.map((r) => ({
                      label: r.name,
                      value: String(r.id),
                    }))}
                    value={String(formValues.userRole)}
                    onChange={(e) => {
                      const role = userRoles.find(
                        (r) => String(r.id) === String(e.target.value)
                      );
                      setFormValues((prev) => ({
                        ...prev,
                        userRole: e.target.value,
                        roleName: role ? role.name : e.target.value,
                      }));
                    }}
                    placeholder="Role"
                  />
                ) : (
                  <FormInput
                    name="roleName"
                    placeholder="Role"
                    formValues={formValues}
                    className={`w-full p-2 border rounded-md ${
                      isEditable
                        ? "bg-white"
                        : "bg-user-detail-box cursor-not-allowed"
                    }`}
                    disabled={true}
                    showLabel={true}
                  />
                )}
                {isEditable ? (
                  <FormSelect
                    name="designation"
                    options={designations.map((d) => ({
                      label: d.title,
                      value: String(d.id),
                    }))}
                    value={String(formValues.designation)}
                    onChange={(e) => {
                      const desg = designations.find(
                        (d) => String(d.id) === String(e.target.value)
                      );
                      setFormValues((prev) => ({
                        ...prev,
                        designation: e.target.value,
                        designationName: desg ? desg.title : e.target.value,
                      }));
                    }}
                    placeholder="Designation"
                  />
                ) : (
                  <FormInput
                    name="designationName"
                    placeholder="Designation"
                    formValues={{ ...formValues }}
                    className={`w-full p-2 border rounded-md ${
                      isEditable
                        ? "bg-white"
                        : "bg-user-detail-box cursor-not-allowed"
                    }`}
                    disabled={true}
                    showLabel={true}
                  />
                )}
                {isEditable ? (
                  <FormSelect
                    name="status"
                    options={employeeStatuses.map((s) => ({
                      label: s.name,
                      value: String(s.id),
                    }))}
                    value={String(formValues.status)}
                    onChange={(e) => {
                      const status = employeeStatuses.find(
                        (s) => String(s.id) === String(e.target.value)
                      );
                      setFormValues((prev) => ({
                        ...prev,
                        status: Number(e.target.value),
                        statusName: status ? status.name : e.target.value,
                      }));
                    }}
                    placeholder="Status"
                  />
                ) : (
                  <FormInput
                    name="statusName"
                    placeholder="Status"
                    formValues={formValues}
                    className={`w-full p-2 border rounded-md ${
                      isEditable
                        ? "bg-white"
                        : "bg-user-detail-box cursor-not-allowed"
                    }`}
                    disabled={true}
                    showLabel={true}
                  />
                )}
                <button
                  type="submit"
                  onClick={handleUpdateUser}
                  className="px-4 py-2 bg-primary-pink text-white rounded-md"
                  style={{ width: "185px" }}
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
