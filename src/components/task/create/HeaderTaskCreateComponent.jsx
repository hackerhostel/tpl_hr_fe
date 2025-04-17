import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormInput from "../../FormInput.jsx";
import FormSelect from "../../FormSelect.jsx";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { doGetWhoAmI } from '../../../state/slice/authSlice.js';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';

const CreateEmployee = ({ onClose, isOpen }) => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const formRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [designations, setDesignations] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);
    const [userRoles, setUserRoles] = useState([]);


    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        departmentID: null,
        reportingManager: '',
        location: '',
        hiredDate: '',
        userRole: '',
        designationID: null,
    });

    const handleChange = (e, customValue = null) => {
        const name = e.target?.name;
        const value = customValue ?? e.target?.value ?? '';
        if (name) {
            setFormValues((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };



    const getSelectOptions = (list, labelKey = 'title') =>
        list.map((item) => ({
          label: item[labelKey], // e.g., title or name
          value: item.id         // always store the ID
        }));
      
      
      

    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const res = await axios.get("/organizations/master-data");
                const { designations, userRoles, departments, employeeStatuses } = res.data;
                console.log("Master Data:", res.data);
                setDesignations(designations);
                setUserRoles(userRoles)
            } catch (err) {
                console.error("Error fetching master data:", err);
            }
        };
        fetchMasterData();
    }, []);


    const validateForm = () => {
        const errors = {};
        Object.entries(formValues).forEach(([key, val]) => {
            if (!val && val !== 0) {
                errors[key] = `${key} is required`;
            }
        });

        if (formValues.email && !/\S+@\S+\.\S+/.test(formValues.email)) {
            errors.email = "Invalid email format";
        }

        setFormErrors(errors);
        setShowErrors(true);
        return Object.keys(errors).length === 0;
    };

    const user = useSelector((state) => state.auth.user);

    const createNewEmployee = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        const payload = {
            firstName: String(formValues.firstName).trim(),
            lastName: String(formValues.lastName).trim(),
            email: String(formValues.email).trim(),
            contactNumber: String(formValues.contactNumber).trim(),
            reportingManager: String(formValues.reportingManager).trim(),
            location: String(formValues.location).trim(),
            hiredDate: String(formValues.hiredDate).trim(),
            userRole: Number(formValues.userRole),
            designationID: Number(formValues.designationID),
        };

        console.log('formValues', formValues);


        console.log("Submitting payload:", {
            employee: payload,
            createdByMail: user?.email
        });

        try {
            const response = await axios.post("/employees/create", {
                employee: payload,
                createdByMail: user?.email,
            });

            const employeeID = response?.data?.body;

            if (employeeID && employeeID !== 0) {
                dispatch(doGetWhoAmI());
                addToast("Employee created successfully", { appearance: 'success' });
                onClose();
            } else {
                addToast("Failed to create employee", { appearance: 'error' });
            }
        } catch (error) {
            console.error("Create Employee Error:", error);
            addToast('Failed to create employee', { appearance: 'error' });
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
                        <form ref={formRef} className="space-y-4 mt-10" onSubmit={createNewEmployee}>
                            <FormInput name="firstName" type="text" placeholder="First Name"
                                formValues={formValues} onChange={handleChange}
                                formErrors={formErrors} showErrors={showErrors}
                            />
                            <FormInput name="lastName" type="text" placeholder="Last Name"
                                formValues={formValues} onChange={handleChange}
                                formErrors={formErrors} showErrors={showErrors}
                            />
                            <FormInput name="email" type="email" placeholder="Email"
                                formValues={formValues} onChange={handleChange}
                                formErrors={formErrors} showErrors={showErrors}
                            />
                            <FormInput name="contactNumber" type="tel" placeholder="Phone"
                                formValues={formValues} onChange={handleChange}
                                formErrors={formErrors} showErrors={showErrors}
                            />
                            <FormInput name="departmentID" type="text" placeholder="Department ID"
                                formValues={formValues} onChange={handleChange}
                                formErrors={formErrors} showErrors={showErrors}
                            />
                            <FormInput name="reportingManager" type="text" placeholder="Reporting Manager"
                                formValues={formValues} onChange={handleChange}
                                formErrors={formErrors} showErrors={showErrors}
                            />
                            <FormInput name="location" type="text" placeholder="Location"
                                formValues={formValues} onChange={handleChange}
                                formErrors={formErrors} showErrors={showErrors}
                            />
                            <FormInput name="hiredDate" type="date" placeholder="Hired Date"
                                formValues={formValues} onChange={handleChange}
                                formErrors={formErrors} showErrors={showErrors}
                            />

<FormSelect
  name="designationID"
  placeholder="Select Designation"
  options={getSelectOptions(designations, 'title')}
  value={
    getSelectOptions(designations, 'title').find(
      (option) => option.value === Number(formValues.designationID)
    ) || null
  }
  onChange={(selectedOption) =>
    handleChange({
      target: {
        name: 'designationID',
        value: selectedOption ? selectedOption.value : '',
      },
    })
  }
  formErrors={formErrors}
  showErrors={showErrors}
/>


<FormSelect
  name="userRole"
  placeholder="Select User Role"
  options={getSelectOptions(userRoles, 'name')}
  value={
    getSelectOptions(userRoles, 'name').find(
      (option) => option.value === Number(formValues.userRole)
    ) || null
  }
  onChange={(selectedOption) => {
    handleChange({
      target: {
        name: 'userRole',
        value: selectedOption?.value ?? '', // store only the ID
      },
    });
  }}
  formErrors={formErrors}
  showErrors={showErrors}
/>



                            {/* <FormSelect
                                name="designationID"
                                placeholder="Select Designation"
                                options={getSelectOptions(designations)}
                                value={getSelectOptions(designations).find(
                                    (option) => option.value === Number(formValues.designationID)
                                )}
                                onChange={(selectedOption) => {
                                    const name = "designationID";
                                    const value = selectedOption?.value ?? '';
                                    handleChange({ target: { name, value } });
                                    updateTaskDetails("designationID", value); // if epicID = designationID, else update key
                                }}
                                formErrors={formErrors}
                                showErrors={showErrors}
                            /> */}



                            <div className="flex space-x-4 mt-10 self-end w-full">
                                <button type="button" onClick={onClose} className="btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Continue'}
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
