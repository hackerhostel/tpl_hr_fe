import React, {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import FormInput from "../../FormInput.jsx";
import FormSelect from "../../FormSelect.jsx";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {
  doGetMasterData,
  doGetReportingManagers,
  selectDepartments,
  selectDesignations,
  selectEmployeeStatuses,
  selectReportingManagers,
  selectUserRoles,
} from "../../../state/slice/masterDataSlice.js";
import {useToasts} from "react-toast-notifications";
import axios from "axios";
import {getSelectOptions} from "../../../utils/commonUtils.js";
import {doGetWhoAmI} from "../../../state/slice/authSlice.js";

const CreateEmployee = ({ onClose, isOpen }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const formRef = useRef(null);
  const designations = useSelector(selectDesignations);
  const departments = useSelector(selectDepartments);
  const userRoles = useSelector(selectUserRoles);
  const employeeStatuses = useSelector(selectEmployeeStatuses);
  const reportingManagers = useSelector(selectReportingManagers);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState({});
  const [showErrors, setShowErrors] = React.useState(false);

  const [formValues, setFormValues] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    departmentID: 0,
    reportingManager: 0,
    location: "",
    hiredDate: "",
    userRole: 0,
    designationID: 0,
    employeeStatus: 0,
  });

  const handleChange = (name, value, isText) => {
    setFormValues({...formValues, [name]: isText ? value : Number(value)});
  }

  useEffect(() => {
    dispatch(doGetMasterData());
    dispatch(doGetReportingManagers());
  }, [dispatch]);

  const createNewEmployee = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!formRef.current.checkValidity()) {
      setShowErrors(true);
      return;
    }

    const mappings = [
      {key: 'departmentID', list: departments},
      {key: 'designationID', list: designations},
      {key: 'reportingManager', list: reportingManagers},
      {key: 'userRole', list: userRoles}
    ];

    mappings.forEach(({key, list}) => {
      if (formValues[key] === 0) {
        formValues[key] = list[0].id;
      }
    });

    const activeStatus = employeeStatuses.find(es => es?.name === "Active")
    if (activeStatus) {
      formValues.employeeStatus = activeStatus.id
    }

    try {
      const response = await axios.post("/employees/create", {employee: formValues});
      const employeeID = response?.data?.body;

      if (employeeID && employeeID !== 0) {
        addToast("Employee created successfully", { appearance: "success" });
        dispatch(doGetWhoAmI())
        onClose();
      } else {
        addToast("Failed to create employee", { appearance: "error" });
      }
    } catch (error) {
      console.error("Create Employee Error:", error);
      addToast("Failed to create employee", { appearance: "error" });
    }

    setIsSubmitting(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-end justify-end bg-black bg-opacity-25 backdrop-blur-sm z-10">
          <div className="bg-white pl-10 pt-6 pr-6 pb-10 shadow-lg w-3/6 h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <p className="text-2xl font-semibold">Create Employee</p>
              <button className="cursor-pointer" onClick={onClose}>
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <form
              ref={formRef}
              className="space-y-4 mt-10"
              onSubmit={createNewEmployee}
            >
              <FormInput
                name="firstName"
                type="text"
                placeholder="First Name"
                formValues={formValues}
                onChange={({target: {name, value}}) => handleChange(name, value, true)}
                formErrors={formErrors}
                showErrors={showErrors}
                required
              />
              <FormInput
                name="lastName"
                type="text"
                placeholder="Last Name"
                formValues={formValues}
                onChange={({target: {name, value}}) => handleChange(name, value, true)}
                formErrors={formErrors}
                showErrors={showErrors}
                required
              />
              <FormInput
                name="email"
                type="email"
                placeholder="Email"
                formValues={formValues}
                onChange={({target: {name, value}}) => handleChange(name, value, true)}
                formErrors={formErrors}
                showErrors={showErrors}
                required
              />
              <FormInput
                name="contactNumber"
                type="tel"
                placeholder="Phone"
                formValues={formValues}
                onChange={({target: {name, value}}) => handleChange(name, value, true)}
                formErrors={formErrors}
                showErrors={showErrors}
                required
              />
              <FormSelect
                  name="departmentID"
                  placeholder="Select Department"
                  formValues={formValues}
                  options={getSelectOptions(departments)}
                  onChange={({target: {name, value}}) => handleChange(name, value, false)}
                  formErrors={formErrors}
                  showErrors={showErrors}
              />
              <FormSelect
                  name="reportingManager"
                  placeholder="Select Reporting Manager"
                  formValues={formValues}
                  options={getSelectOptions(reportingManagers)}
                  onChange={({target: {name, value}}) => handleChange(name, value, false)}
                  formErrors={formErrors}
                  showErrors={showErrors}
              />
              <FormInput
                name="location"
                type="text"
                placeholder="Location"
                formValues={formValues}
                onChange={({target: {name, value}}) => handleChange(name, value, true)}
                formErrors={formErrors}
                showErrors={showErrors}
                required
              />
              <FormInput
                name="hiredDate"
                type="date"
                placeholder="Hired Date"
                formValues={formValues}
                onChange={({target: {name, value}}) => handleChange(name, value, true)}
                formErrors={formErrors}
                showErrors={showErrors}
                required
              />
              <FormSelect
                  name="designationID"
                  placeholder="Select Designation"
                  formValues={formValues}
                  options={getSelectOptions(designations)}
                  onChange={({target: {name, value}}) => handleChange(name, value, false)}
                  formErrors={formErrors}
                  showErrors={showErrors}
              />
              <FormSelect
                  name="userRole"
                  placeholder="Select Role"
                  formValues={formValues}
                  options={getSelectOptions(userRoles)}
                  onChange={({target: {name, value}}) => handleChange(name, value, false)}
                  formErrors={formErrors}
                  showErrors={showErrors}
              />
              <div className="flex space-x-4 mt-10 self-end w-full">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateEmployee;
