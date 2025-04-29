import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FormInput from "../FormInput.jsx";
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import { doGetWhoAmI } from "../../state/slice/authSlice.js";
import WYSIWYGInput from "../WYSIWYGInput.jsx";


const CreateNewRolePopup = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    responsibilities: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };




  const validateForm = () => {
    const errors = {};
    if (!formValues.title.trim()) errors.title = "Title is required";
    if (!formValues.description.trim()) errors.description = "Description is required";
    if (!formValues.responsibilities.trim()) errors.responsibilities = "Responsibilities are required";
    return errors;
  };

  const handleClose = () => {
    onClose();
    setFormValues({ title: '', description: '', responsibilities: '' });
    setFormErrors({});
    setIsValidationErrorsShown(false);
  };

  const createNewDesignation = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsValidationErrorsShown(true);
      setIsSubmitting(false);
      return;
    }

    const payload = {
      title: formValues.title.trim(),
      description: formValues.description.trim(),
      responsibilities: formValues.responsibilities.trim(),
    };

    try {
      const response = await axios.post("/designations", { designation: payload });

      const designationId = response?.data?.body?.designationID;

      if (designationId) {
        dispatch(doGetWhoAmI());
        addToast('Designation Successfully Created', { appearance: 'success' });
        handleClose();
      } else {
        addToast('Failed To Create Designation', { appearance: 'error' });
      }
    } catch (error) {
      console.error("Create Designation Error:", error);
      addToast('Failed To Create Designation', { appearance: 'error' });
    }

    setIsSubmitting(false);
  };




  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm">
          <div className="bg-white p-6 shadow-lg w-1/3">
            <div className="flex justify-between items-center mb-4">
              <p className="font-bold text-2xl">Create Designation</p>
              <div className="cursor-pointer" onClick={handleClose}>
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </div>
            </div>
            <form
              className="flex flex-col justify-between h-5/6 mt-10"
              onSubmit={createNewDesignation}
            >
              <div className="space-y-4">
                <div>
                  <p className="text-secondary-grey">Title</p>
                  <FormInput
                    type="text"
                    name="title"
                    formValues={formValues}
                    onChange={handleChange}
                    formErrors={formErrors}
                    showErrors={isValidationErrorsShown}
                  />
                </div>
                <div>
                  <label className="text-text-color">Description</label>
                  <div className="border border-gray-300 bg-white rounded-md mt-4 p-2">
                    <WYSIWYGInput
                      name="description"
                      value={description}
                      onchange={(name, value) => {
                        if (typeof setDescription === 'function') {
                          setDescription(value);
                          setFormValues((prev) => ({ ...prev, [name]: value }));
                        }
                      }}
                    />

                  </div>
                </div>

                <div>
                  <label className="text-text-color">Responsibilities</label>
                  <div className="border border-gray-300 bg-white rounded-md mt-4 p-2">
                    <WYSIWYGInput
                      name="responsibilities"
                      value={responsibilities}
                      onchange={(name, value) => {
                        if (typeof setResponsibilities === 'function') {
                          setResponsibilities(value);
                          setFormValues((prev) => ({ ...prev, [name]: value }));
                        }
                      }}
                    />

                  </div>
                </div>

              </div>
              <div className="flex space-x-4 mt-6 self-end w-full">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateNewRolePopup;
