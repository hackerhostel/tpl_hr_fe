import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {XMarkIcon} from '@heroicons/react/24/outline';
import FormInput from "../FormInput.jsx";
import FormSelect from "../FormSelect.jsx";
import {getSelectOptions} from "../../utils/commonUtils.js";
import {doGetProjectBreakdown, setProjectType} from "../../state/slice/projectSlice.js";
import useValidation from "../../utils/use-validation.jsx";
import axios from 'axios';
import {ProjectCreateSchema} from '../../utils/validationSchemas.js';
import {useToasts} from 'react-toast-notifications';
import {doGetWhoAmI} from "../../state/slice/authSlice.js";
import FormTextArea from "../FormTextArea.jsx" 


const CreateNewProjectPopup = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    

    const projectTypes = useSelector(setProjectType);

    useEffect(() => {
        if (!projectTypes || !projectTypes.length) {
            dispatch(doGetProjectBreakdown())
        }
    }, [projectTypes])

    // Initial form values
    const [formValues, setFormValues] = useState({
        prefix: '',
        name: '',
        projectType: '',
        description: ''
    });
    
    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});

   
    const handleFormChange = (name, value) => {
        setFormValues({ ...formValues, [name]: value });
        setIsValidationErrorsShown(false);
    };

    const handleChange = (e, value) => {
      setFormValues((prevValues) => ({
          ...prevValues,
          [e.target.name]: value,
      }));

      // Optional: Clear errors when user starts typing
      if (formErrors[e.target.name]) {
          setFormErrors((prevErrors) => ({
              ...prevErrors,
              [e.target.name]: "",
          }));
      }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation example
    if (!formValues.description.trim()) {
        setFormErrors({ description: "Description is required" });
        return;
    }

    console.log("Form Submitted", formValues);
};

    const handleClose = () => {
        onClose();
        setFormValues({ prefix: '', name: '', projectType: '' });
        setIsValidationErrorsShown(false);
    };

    const createNewProject = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        if (formErrors && Object.keys(formErrors).length > 0) {
            setIsValidationErrorsShown(true);
        } else {
            setIsValidationErrorsShown(false);
            try {
                const response = await axios.post("/projects", { project: formValues });
                const projectId = response?.data?.body;

                if (projectId) {
                    dispatch(doGetWhoAmI());
                    addToast('Project Successfully Created', { appearance: 'success' });
                    handleClose();
                } else {
                    addToast('Failed To Create The Project', { appearance: 'error' });
                }
            } catch (error) {
                addToast('Failed To Create The Project', { appearance: 'error' });
            }
        }
        setIsSubmitting(false);
    };

    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm">
            <div className="bg-white p-6 shadow-lg w-1/3">
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold text-2xl">Create Role</p>
                <div className={"cursor-pointer"} onClick={handleClose}>
                  <XMarkIcon className={"w-6 h-6 text-gray-500"} />
                </div>
              </div>
              <form
                className={"flex flex-col justify-between h-5/6 mt-10"}
                onSubmit={createNewProject}
              >
                <div className="space-y-4">
                  <div className="flex-col">
                    <p className="text-secondary-grey">Title</p>
                    <FormInput
                      type="text"
                      name="prefix"
                      formValues={formValues}
                      onChange={({ target: { name, value } }) =>
                        handleFormChange(name, value)
                      }
                      formErrors={formErrors}
                      showErrors={isValidationErrorsShown}
                    />
                  </div>
                  <div className="flex-col">
                    <label className='text-text-color' htmlFor=""> Description</label>
                    <FormTextArea
                name="description"
                formValues={formValues}
                formErrors={formErrors}
                onChange={handleChange}
                showErrors={true}
                required
            />
                  </div>
                  <div className="flex-col">
                   
                  </div>
                  {/* <div className="flex-col">
                    <p className="text-secondary-grey">Group</p>
                    <FormSelect
                      name="groupID"
                      formValues={formValues}
                      options={getSelectOptions(appConfig.groups)}
                      onChange={({ target: { name, value } }) =>
                        handleFormChange(name, value)
                      }
                      formErrors={formErrors}
                      showErrors={isValidationErrorsShown}
                    />
                  </div> */}
                </div>
                <div className="flex space-x-4 mt-6 self-end w-full">
                  <button
                    onClick={handleClose}
                    className=" btn-secondary"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className=" btn-primary"
                    disabled={isSubmitting}
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
};

export default CreateNewProjectPopup;
