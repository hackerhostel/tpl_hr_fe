import React, { useRef, useState } from 'react';
import FormInput from "../../FormInput.jsx";
import useValidation from "../../../utils/use-validation.jsx";
import { TaskCreateSchema } from "../../../state/domains/authModels.js";
import FormSelect from "../../FormSelect.jsx";
import TaskScreenDetails from "./TaskScreenDetails.jsx";
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAppConfig } from "../../../state/slice/appSlice.js";
import { selectSelectedProject } from "../../../state/slice/projectSlice.js";
import SkeletonLoader from "../../SkeletonLoader.jsx";
import ErrorAlert from "../../ErrorAlert.jsx";
import { useToasts } from "react-toast-notifications";
import { XMarkIcon } from "@heroicons/react/24/outline/index.js";
import { getUserSelectOptions } from "../../../utils/commonUtils.js";
import { selectProjectUserList } from "../../../state/slice/projectUsersSlice.js";
import WYSIWYGInput from "../../WYSIWYGInput.jsx";
import UserSelect from "../../UserSelect.jsx";
import Select from 'react-select';

function getRequiredAdditionalFieldList(fieldsArray) {
    const requiredFields = [];

    fieldsArray.forEach(field => {
        if (Array.isArray(field.fields)) {
            field.fields.forEach(subField => {
                if (subField.required === 1) {
                    requiredFields.push(subField.id)
                }
            });
        }
    });

    return requiredFields;
}

const TaskCreateComponent = ({ sprintId, onClose, isOpen, epics, refetchSprint }) => {
    const appConfig = useSelector(selectAppConfig);
    const selectedProject = useSelector(selectSelectedProject);
    const users = useSelector(selectProjectUserList);
    const { addToast } = useToasts();

    const [loading, setLoading] = useState(false);
    const [createTaskForm, setCreateTaskForm] = useState({ name: '', taskTypeID: '', description: '' });
    const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
    const formRef = useRef(null);
    const [formErrors] = useValidation(TaskCreateSchema, createTaskForm);

    const [isTaskTypeLoading, setIsTaskTypeLoading] = useState(false);
    const [isTaskTypeApiError, setIsTaskTypeApiError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEpicScreen, setIsEpicScreen] = useState(false);

    const [screenDetails, setScreenDetails] = useState(null);
    const [additionalFormValues, setAdditionalFormValues] = useState({});
    const [requiredAdditionalFieldList, setRequiredAdditionalFieldList] = useState([]);

    const handleFormChange = (name, value) => {
        if (name === 'taskTypeID') {
            const selectedTaskType = appConfig.taskTypes.find(tt => tt.id === parseInt(value))
            if (selectedTaskType?.screenID) {
                fetchScreenForTask(selectedTaskType.screenID)
                setIsEpicScreen(selectedTaskType.value === 'Epic')
            }
        }

        const newForm = { ...createTaskForm, [name]: value };
        setCreateTaskForm(newForm);
    };

    const handleAdditionalFieldChange = (fieldData) => {
        setAdditionalFormValues(prevValues => ({
            ...prevValues, [fieldData.taskFieldID]: fieldData
        }));
    };

    const handleTaskCreateClose = () => {
        setCreateTaskForm({ name: '', taskTypeID: '' })
        onClose()
    }

    const fetchScreenForTask = async (screenId) => {
        setIsTaskTypeLoading(true)
        try {
            const response = await axios.get(`screens/${screenId}?projectID=${selectedProject.id}`)
            if (response.data.screen) {
                const screenData = response.data.screen

                setScreenDetails(screenData)
                setRequiredAdditionalFieldList(getRequiredAdditionalFieldList(screenData.tabs))
            }
            setIsTaskTypeApiError(false)
        } catch (e) {
            setIsTaskTypeApiError(true)
        } finally {
            setIsTaskTypeLoading(false)
            setAdditionalFormValues({})
        }
    }

    const handleCreateTask = async (event) => {
        event.preventDefault();
        let additionalFieldFormErrors = false;

        requiredAdditionalFieldList.forEach(r => {
            if (!additionalFormValues[r]) {
                additionalFieldFormErrors = true;
            }
        });

        if (formErrors || additionalFieldFormErrors) {
            setIsValidationErrorsShown(true);
            return;
        }

        if (loading) {
            return;
        }

        setLoading(true);
        setIsValidationErrorsShown(false);

        const payload = {
            ...createTaskForm,
            sprintID: sprintId,
            projectID: selectedProject?.id,
            attributes: Object.entries(additionalFormValues).map(([key, value]) => value),
        };

        if (createTaskForm?.taskOwner) {
            const ownerValues = screenDetails?.tabs[0]?.fields.find(
                at => at?.fieldType?.name === "USER_PICKER"
            );
            let taskOwnerFound = false;

            if (ownerValues?.fieldType?.id) {
                payload.attributes = payload.attributes.map(attribute => {
                    if (attribute.fieldTypeName === "USER_PICKER") {
                        taskOwnerFound = true;
                        return {
                            fieldTypeName: "USER_PICKER",
                            fieldValue: [payload?.taskOwner],
                            taskFieldID: ownerValues?.id
                        };
                    }
                    return attribute;
                });

                if (!taskOwnerFound) {
                    payload.attributes.push({
                        fieldTypeName: "USER_PICKER",
                        fieldValue: [payload?.taskOwner],
                        taskFieldID: ownerValues?.id
                    });
                }
            }

            delete payload?.taskOwner;
        }

        try {
            const response = await axios.post("tasks", { task: payload });
            addToast(`New task ID: ${response.data.id} added`, { appearance: 'success', autoDismiss: true });
            handleTaskCreateClose();
            if (refetchSprint) {
                refetchSprint();
            }
        } catch (e) {
            addToast(e.message || 'An error occurred while creating the task.', {
                appearance: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const getTaskAdditionalDetailsComponent = () => {
        if (isTaskTypeLoading) {
            return <div className="my-5"><SkeletonLoader /></div>
        }

        if (isTaskTypeApiError) {
            return <div className="my-5"><ErrorAlert message="Cannot get task additional details at the moment" /></div>
        }

        if (!screenDetails) {
            return <></>
        }

        return <TaskScreenDetails
            taskFormData={additionalFormValues}
            handleFormChange={handleAdditionalFieldChange}
            isValidationErrorsShown={isValidationErrorsShown}
            screenDetails={screenDetails}
        />
    }

    return (<>
        {isOpen && (
            <div className="fixed inset-0 flex items-right justify-end bg-white bg-opacity-25 backdrop-blur-sm z-10">
                <div className="bg-white pl-10 pt-6 pr-6 pb-10 shadow-lg w-3/6 h-screen overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-2xl font-semibold">Create New Task</p>
                        <div className={"cursor-pointer"} onClick={handleTaskCreateClose}>
                            <XMarkIcon className={"w-6 h-6 text-gray-500"} />
                        </div>
                    </div>
                    <form className="space-y-4 mt-10" ref={formRef} onSubmit={handleCreateTask}>
                        <div className="mb-6">
                            <FormSelect
                                showLabel
                                placeholder="Task Type"
                                name="taskTypeID"
                                formValues={createTaskForm}
                                options={appConfig.taskTypes.map(tt => {
                                    return {
                                        label: tt.value, value: tt.id
                                    }
                                })}
                                onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                formErrors={formErrors}
                                showErrors={isValidationErrorsShown}
                            />
                        </div>

                        <div className="mb-6">
                            <FormInput
                                type="text"
                                name="name"
                                formValues={createTaskForm}
                                placeholder="Task Title"
                                onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                formErrors={formErrors}
                                showErrors={isValidationErrorsShown}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <div className="border border-gray-300 rounded-md p-2">
                                <div className="flex space-x-2 mb-2">
                                    <button type="button" className="p-1 rounded hover:bg-gray-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="mb-6">
                                    <WYSIWYGInput initialValue={{ description: '' }}
                                        value={createTaskForm.description}
                                        name={"description"} onchange={handleFormChange} />
                                </div>
                            </div>
                        </div>

                        {!isEpicScreen && (
                            <div className="mb-6">
                                <Select
                                    showLabel
                                    placeholder="Epic"
                                    name="epicID"
                                    formValues={createTaskForm}
                                    options={epics}
                                    onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                />
                            </div>
                        )}

                        <div className="flex space-x-4 mb-6">
                            <div className="w-2/4">
                                <UserSelect
                                    label="Assignee"
                                    name="assigneeID"
                                    value={createTaskForm.assigneeID}
                                    users={users}
                                    onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                    formErrors={formErrors}
                                    showErrors={isValidationErrorsShown}
                                />
                            </div>
                            <div className="w-2/4">
                                <UserSelect
                                    label='Task Owner'
                                    name="taskOwner"
                                    value={createTaskForm.taskOwner}
                                    users={users} 
                                    onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                                    formErrors={formErrors}
                                    showErrors={isValidationErrorsShown}
                                />
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <div className='flex justify-center items-center'>
                                <ArrowUpTrayIcon className='w-6 text-text-color' />
                            </div>

                            <p className="mt-1 text-sm text-gray-500">Drop & Drag attachment <br /> OR </p>
                            <button className='bg-primary-pink mt-2 text-white text-xs  px-3 py-2 rounded-md'>Brows Files</button>
                        </div>

                        {getTaskAdditionalDetailsComponent()}

                        <div className="flex space-x-4 mt-10 self-end w-full">
                            <button
                                onClick={handleTaskCreateClose}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={isSubmitting}
                            >
                                Continue
                            </button>
                        </div>
                    </form>
                </div>
            </div>)}
    </>);
};

export default TaskCreateComponent;