import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormInput from "../../FormInput.jsx";
import FormSelect from "../../FormSelect.jsx";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { doGetWhoAmI } from "../../../state/slice/authSlice.js";
import {
  doGetMasterData,
  doGetReportingManagers,
  selectDesignations,
  selectDepartments,
  selectUserRoles,
  selectEmployeeStatuses,
  selectReportingManagers,
} from "../../../state/slice/masterDataSlice.js";
import { useToasts } from "react-toast-notifications";
import axios from "axios";

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
    departmentID: "",
    reportingManager: "",
    location: "",
    hiredDate: "",
    userRole: "",
    designationID: "",
    employeeStatus: "",
  });

  const handleChange = (e, customValue = null) => {
    const name = e?.target?.name;
    let value = customValue ?? e?.target?.value;

    if (
      name === "departmentID" ||
      name === "reportingManager" ||
      name === "userRole" ||
      name === "designationID" ||
      name === "employeeStatus"
    ) {
      value = value ? Number(value) : "";
    }

    if (name) {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const getSelectOptions = (options, labelKey = "name") => {
    if (options && options.length) {
      return options.map((o) => {
        const value = Number(o?.id || o?.rID || o?.checklistID);
        const label = o?.[labelKey] || o?.value || o?.title || "Unnamed";
        return { value, label };
      });
    }
    return [];
  };

  useEffect(() => {
    dispatch(doGetMasterData());
    dispatch(doGetReportingManagers());
  }, [dispatch]);

  const user = useSelector((state) => state.auth.user);

  const createNewEmployee = async (event) => {
    event.preventDefault();

    if (!formRef.current.checkValidity()) {
      setShowErrors(true);
      return;
    }

    setIsSubmitting(true);
    const payload = {
      firstName: String(formValues.firstName).trim(),
      lastName: String(formValues.lastName).trim(),
      email: String(formValues.email).trim(),
      contactNumber: String(formValues.contactNumber).trim(),
      departmentID: Number(formValues.departmentID),
      reportingManager: Number(formValues.reportingManager),
      location: String(formValues.location).trim(),
      hiredDate: String(formValues.hiredDate).trim(),
      userRole: Number(formValues.userRole),
      designationID: Number(formValues.designationID),
      employeeStatus: Number(formValues.employeeStatus),
    };

    console.log("Submitting payload:", {
      employee: payload,
      createdByMail: user?.email,
    });

    try {
      const response = await axios.post("/employees/create", {
        employee: payload,
        createdByMail: user?.email,
      });

      const employeeID = response?.data?.body;

      if (employeeID && employeeID !== 0) {
        dispatch(doGetWhoAmI());
        addToast("Employee created successfully", { appearance: "success" });
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
                onChange={handleChange}
                formErrors={formErrors}
                showErrors={showErrors}
                required
              />
              <FormInput
                name="lastName"
                type="text"
                placeholder="Last Name"
                formValues={formValues}
                onChange={handleChange}
                formErrors={formErrors}
                showErrors={showErrors}
                required
              />
              <FormInput
                name="email"
                type="email"
                placeholder="Email"
                formValues={formValues}
                onChange={handleChange}
                formErrors={formErrors}
                showErrors={showErrors}
                required
              />
              <FormInput
                name="contactNumber"
                type="tel"
                placeholder="Phone"
                formValues={formValues}
                onChange={handleChange}
                formErrors={formErrors}
                showErrors={showErrors}
                required
              />
              <FormSelect
                name="departmentID"
                placeholder="Select Department"
                options={getSelectOptions(departments)}
                value={
                  getSelectOptions(departments).find(
                    (option) => option.value === Number(formValues.departmentID)
                  ) || ""
                }
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "departmentID",
                      value: e.target.value,
                    },
                  })
                }
                formErrors={formErrors}
                showErrors={showErrors}
                required
              />
              <FormSelect
                name="reportingManager"
                placeholder="Select Reporting Manager"
                options={getSelectOptions(reportingManagers, "name")}
                value={
                  getSelectOptions(reportingManagers, "name").find(
                    (option) =>
                      option.value === Number(formValues.reportingManager)
                  ) || ""
                }
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "reportingManager",
                      value: e.target.value,
                    },
                  })
                }
                formErrors={formErrors}
                showErrors={showErrors}
                required
              />
              <FormInput
                name="location"
                type="text"
                placeholder="Location"
                formValues={formValues}
                onChange={handleChange}
                formErrors={formErrors}
                showErrors={showErrors}
                required
              />
              <FormInput
                name="hiredDate"
                type="date"
                placeholder="Hired Date"
                formValues={formValues}
                onChange={handleChange}
                formErrors={formErrors}
                showErrors={showErrors}
                required
              />
              <FormSelect
                name="designationID"
                placeholder="Select Designation"
                options={getSelectOptions(designations)}
                value={
                  getSelectOptions(designations).find(
                    (option) =>
                      option.value === Number(formValues.designationID)
                  ) || ""
                }
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "designationID",
                      value: e.target.value,
                    },
                  })
                }
                formErrors={formErrors}
                showErrors={showErrors}
                required
              />
              <FormSelect
                name="userRole"
                placeholder="Select Role"
                options={getSelectOptions(userRoles)}
                value={
                  getSelectOptions(userRoles).find(
                    (option) => option.value === Number(formValues.userRole)
                  ) || ""
                }
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "userRole",
                      value: e.target.value,
                    },
                  })
                }
                formErrors={formErrors}
                showErrors={showErrors}
                required
              />
              <FormSelect
                name="employeeStatus"
                placeholder="Select Status"
                options={getSelectOptions(employeeStatuses)}
                value={
                  getSelectOptions(employeeStatuses).find(
                    (option) =>
                      option.value === Number(formValues.employeeStatus)
                  ) || ""
                }
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "employeeStatus",
                      value: e.target.value,
                    },
                  })
                }
                formErrors={formErrors}
                showErrors={showErrors}
                required
              />
              <div className="flex space-x-4 mt-10 self-end w-full">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
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
