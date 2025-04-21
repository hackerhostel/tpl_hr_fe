import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useRef, useState} from "react";
import {
  selectIsProjectDetailsLoading,
  selectSelectedProjectFromList,
  setProjectType
} from "../../state/slice/projectSlice.js";
import FormInput from "../../components/FormInput.jsx";
import {EllipsisVerticalIcon, PencilIcon, PlusCircleIcon} from '@heroicons/react/24/outline';
import FormSelect from "../../components/FormSelect.jsx";
import {getInitials, getSelectOptions} from "../../utils/commonUtils.js";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import {doGetProjectUsers, selectProjectUserList} from "../../state/slice/projectUsersSlice.js";
import {useToasts} from "react-toast-notifications";
import axios from "axios";
import useValidation from "../../utils/use-validation.jsx";
import {ProjectUpdateSchema} from "../../utils/validationSchemas.js";
import {selectOrganizationUsers} from "../../state/slice/appSlice.js";
import {doGetWhoAmI} from "../../state/slice/authSlice.js";
import {TrashIcon} from "@heroicons/react/24/outline/index.js";
import ConfirmationDialog from "../../components/ConfirmationDialog.jsx";
import Icon from "../../../public/Icon.png"
import OpenPopUp from "./AddUserPopup.jsx"


const ProjectContentPage = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const formRef = useRef(null);
  const selectedProject = useSelector(selectSelectedProjectFromList);
  const isProjectDetailsLoading = useSelector(selectIsProjectDetailsLoading);
  const userListForProject = useSelector(selectProjectUserList);
  const projectTypes = useSelector(setProjectType);
  const organizationUsers = useSelector(selectOrganizationUsers);
  const [activeButton, setActiveButton] = useState("People");
  const [formValues, setFormValues] = useState({ name: "", prefix: "", projectType: "", projectUserIDs: "", status: "" });
  const [formErrors] = useValidation(ProjectUpdateSchema, formValues);
  const projectUsersIdList = userListForProject.map(user => user.id);

  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  

  useEffect(() => {
    if (selectedProject?.id) {
      setFormValues({...selectedProject, projectUserIDs: projectUsersIdList});
      dispatch(doGetProjectUsers(selectedProject.id))
    }

  }, [selectedProject]);

   const toggleEditable = () => {
    setIsEditable(!isEditable)
   };

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  // Handle form input changes
  const handleFormChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  //handle open popup

  const openPopUp = () => {
    setIsOpenPopUp(true)
  }

  const closePopUp = () => {
    setIsOpenPopUp(false)
  }

  const handleSubmitPopup = (userData) => {
    console.log('User Data Submitted:', userData);
    // Add your logic to save the user data to the state or backend
  };

  const [issueFormValues, setIssueFormValues] = useState({
    issueType: "",
    priority: "",
    severity: "",
    status: ""
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toDeleteItem, setToDeleteItem] = useState({});
  const projectStatus = [
    { value: "Active", label: "Active" },
    { value: "On Hold", label: "On Hold" },
    { value: "Closed", label: "Closed" },
  ];

  const handleDeleteClick = (user) => {
    setToDeleteItem(user);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    const updatedList = projectUsersIdList.filter(
      (user) => user !== toDeleteItem.id,
    );

    try {
      const payLoad = {
        ...formValues,
        projectUserIDs: [...updatedList],
      };
      const response = await axios.put(
        `/projects/${selectedProject.id}`,
        payLoad,
      );
      const updated = response?.data?.body;

      if (updated) {
        addToast("User Deleted Successfully", { appearance: "success" });
        dispatch(doGetProjectUsers(selectedProject?.id));
      } else {
        addToast("Failed To Delete User", { appearance: "error" });
      }
    } catch (error) {
      addToast("Failed To Delete User", { appearance: "error" });
    }

    setIsDialogOpen(false);
  };




  const handleIssueFormChange = (name, value) => {
    setIssueFormValues({
      ...issueFormValues,
      [name]: value
    });
  };

  const handleUserAdd = async () => {
    if (formValues.projectUserIDs === "") {
      addToast('Please select a user to add', { appearance: "error" });
      return;
    }

    setIsSubmitting(true);

    if (formErrors && Object.keys(formErrors).length > 0) {
      setIsValidationErrorsShown(true);
    } else {
      setIsValidationErrorsShown(false);
      try {
        const payLoad = {
          ...formValues,
          projectUserIDs: [...projectUsersIdList, parseInt(formValues.projectUserIDs)]
        }
        const response = await axios.put(`/projects/${selectedProject.id}`, payLoad)
        const updated = response?.data?.body

        if (updated) {
          addToast('User Added Successfully Updated', { appearance: 'success' });
          dispatch(doGetProjectUsers(selectedProject?.id));
        } else {
          addToast('Failed To Add User', { appearance: 'error' });
        }
      } catch (error) {
        addToast('Failed To Add User', { appearance: 'error' });
      }
    }
    setIsSubmitting(false)
  };

  const userList = (users) => {
    const nonProjectUsers = organizationUsers.filter(orgUser =>
      !userListForProject.some(projUser => projUser.id === orgUser.id)
    );

    return nonProjectUsers.map(users => ({ value: users.id, label: `${users.firstName} ${users.lastName}` }));
  };

  const updateProject = async (event) => {
    setIsSubmitting(true)
    event.preventDefault();

    if (formErrors && Object.keys(formErrors).length > 0) {
      setIsValidationErrorsShown(true);
    } else {
      setIsValidationErrorsShown(false);
      try {
        const response = await axios.put(`/projects/${selectedProject.id}`, { ...formValues })
        const updated = response?.data?.body

        if (updated) {
          dispatch(doGetWhoAmI());
          addToast('Project Successfully Updated', { appearance: 'success' });
        } else {
          addToast('Failed To Updated The Project', { appearance: 'error' });
        }
      } catch (error) {
        addToast('Failed To Updated The Project', { appearance: 'error' });
      }
    }
    setIsSubmitting(false)
  };

  if (isProjectDetailsLoading) return <div className="p-2"><SkeletonLoader /></div>;

  return (
    <>
      {!selectedProject ? (
        <div>
          <h5 className="text-black">No Project Selected</h5>
        </div>
      ) : (
        <div className="p-3 bg-dashboard-bgc h-full ">
          <div className="py-5 flex gap-4">
            <span className="text-popup-screen-header text-sm">
              Project &gt;
            </span>
            <span className="text-black text-sm font-bold">{selectedProject.name}</span>
          </div>
          <div className="text flex gap-3 mt-3 text-xs justify-end mr-6">
            {["Overview", "People"].map(
              (buttonName) => (
                <button
                  key={buttonName}
                  onClick={() => handleButtonClick(buttonName)}
                  className={`px-4 py-2 rounded-full ${activeButton === buttonName
                    ? "bg-black text-white"
                    : "bg-white text-black"
                    }`}
                >
                  {buttonName}
                </button>
              ),
            )}
          </div>

          <div className="flex space-x-4">
            <div>
              <form
                onSubmit={updateProject}
                ref={formRef}
                className="flex p-5 flex-col w-72 gap-4  bg-white rounded-lg"
              >
                <div>
                  <div className="flex justify-end"><PencilIcon onClick={toggleEditable} className="w-4 text-secondary-grey cursor-pointer" /></div>
                  <div className="flex justify-center">
                    {selectedProject?.name ? (<div
                        className="w-24 h-24 rounded-full bg-primary-pink flex items-center justify-center text-white text-lg font-semibold mb-1">
                      {getInitials(selectedProject?.name)}
                    </div>) :
                        (< img src={Icon} alt="Icon" className="w-24"/>)
                    }
                  </div>
                  <span
                      className="mt-2 flex justify-center text-secondary-grey text-xl font-bold">{selectedProject.name}</span>

                </div>
                <div className="flex-col">
                  <p className="text-secondary-grey">Name</p>
                  <div className="">
                    <FormInput
                      type="text"
                      name="name"
                      className={`w-full p-2 border rounded-md ${
                        isEditable
                          ? "bg-white text-secondary-grey border-border-color"
                          : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                      }`}
                      disabled={!isEditable}
                      value={formValues.name}
                      formValues={formValues}
                      onChange={({ target: { name, value } }) =>
                        handleFormChange(name, value, true)
                      }
                      formErrors={formErrors}
                      showErrors={isValidationErrorsShown}
                    />
                  </div>

                </div>

                <div className="flex-col">
                  <p className="text-secondary-grey">Key</p>
                  <FormInput
                    type="text"
                    name="prefix"
                    className={`w-full p-2 border rounded-md ${
                      isEditable
                        ? "bg-white text-secondary-grey border-border-color"
                        : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                    }`}
                    disabled={!isEditable}
                    value={formValues.prefix}
                    formValues={formValues}
                    onChange={({ target: { name, value } }) =>
                      handleFormChange(name, value, true)
                    }
                    formErrors={formErrors}
                    showErrors={isValidationErrorsShown}
                  />
                </div>

                <div className="flex gap-10">
                  <div className="flex-col w-full">
                    <p className="text-secondary-grey">Type</p>
                    <FormSelect
                      name="projectType"
                      className={`w-full p-2 border rounded-md ${
                        isEditable
                          ? "bg-white text-secondary-grey border-border-color"
                          : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                      }`}
                      disabled={!isEditable}
                      formValues={formValues}
                      value={formValues.projectType}
                      options={getSelectOptions(projectTypes)}
                      onChange={({ target: { name, value } }) =>
                        handleFormChange(name, value)
                      }
                      formErrors={formErrors}
                      showErrors={isValidationErrorsShown}
                    />
                  </div>
                </div>

                <div className="flex gap-10">
                  <div className="flex-col w-full">
                    <p className="text-secondary-grey">Status</p>
                    <FormSelect
                      name="status"
                      className={`w-full p-2 border rounded-md ${
                        isEditable
                          ? "bg-white text-secondary-grey border-border-color"
                          : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                      }`}
                      disabled={!isEditable}
                      formValues={formValues}
                      value={formValues.status}
                      options={projectStatus}
                      onChange={({ target: { name, value } }) =>
                        handleFormChange(name, value)
                      }
                      formErrors={formErrors}
                      showErrors={isValidationErrorsShown}
                    />
                  </div>
                </div>

                {/* <div className="flex gap-10">
                  <div className="flex-col w-full">
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
                  </div>
                </div> */}

                <div className="flex gap-10 justify-end">
                  <div className="flex-col">
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="px-4 py-2 bg-primary-pink w-full text-white rounded-md"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {activeButton === "Overview" && (
              <div><span className="text-secondary-grey font-semibold text-base">Overview</span></div>
            )}

            {activeButton === "People" && (
              <div>
                <div className="flex items-center space-x-4">
                  <span className="text-secondary-grey font-semibold text-base">People</span>
                  <div className="flex items-center space-x-1">
                    <PlusCircleIcon onClick={openPopUp} className="w-6 cursor-pointer text-primary-pink" />
                    <span className="text-popup-screen-header text-sm">Add New</span>
                  </div>
                </div>
                <div style={{ width: '759px' }} className="rounded-lg bg-white mt-5 p-4">
                  <table className="table-auto w-full text-left">
                    <thead>
                      <tr className="text-secondary-grey text-sm h-16 font-medium border-b">
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800">
                      {userListForProject.map((user, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="py-6 px-4 flex items-center space-x-3">
                            <span>{`${user.firstName} ${user.lastName}`}</span>
                          </td>
                          <td className="py-3 px-4">{user.role}</td>
                          <td className="py-3 px-4">
                            <div
                              onClick={() => handleDeleteClick(user)}
                              className="cursor-pointer flex justify-end"
                            >
                              <TrashIcon className="w-5 h-5 text-gray-500" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <OpenPopUp
                  isOpen={isOpenPopUp}
                  onClose={closePopUp}
                  onSubmit={handleSubmitPopup}
                />

              </div>

            )}

            {activeButton === "Configuration" && (
              <div>
                <div><span className="text-secondary-grey font-semibold text-base">Configuration</span></div>
                <div style={{ width: '759px' }} className=" bg-white p-4 rounded-md mt-5">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-sm text-secondary-grey">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-secondary-grey">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-secondary-grey">
                          Priority
                        </th>
                        <th scope="col" className="px-6 py-3 text-secondary-grey">
                          Severity
                        </th>
                        <th scope="col" className="px-6 py-3 text-secondary-grey">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-secondary-grey">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 h-16 font-medium text-secondary-grey">
                          Task
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-5 py-1 rounded bg-priority-button-high text-sm text-white">
                            High
                          </span>
                        </td>
                        <td className="px-6 py-4">Sprint 1</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-800 text-xs px-3 py-2 rounded">
                            In Progress
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-gray-500 hover:text-gray-700">
                            <EllipsisVerticalIcon className="h-6 w-6" />
                          </button>
                        </td>
                      </tr>

                      
                    </tbody>
                  </table>
                </div>

                {/* Form */}
                {/* <div className="bg-white mt-6 p-6 rounded-md shadow-sm">
                  <form className="flex gap-2">
                    <FormInput
                      type="text"
                      name="issueType"
                      placeholder="Enter Issue type"
                      formValues={issueFormValues}
                      style={{ width: "450px" }}
                      onChange={({ target: { name, value } }) =>
                        handleIssueFormChange(name, value)
                      }
                    />
                    <FormInput
                      type="text"
                      name="priority"
                      placeholder="Priority"
                      formValues={issueFormValues}
                      onChange={({ target: { name, value } }) =>
                        handleIssueFormChange(name, value)
                      }
                    />
                    <FormInput
                      type="text"
                      name="severity"
                      placeholder="Severity"
                      formValues={issueFormValues}
                      onChange={({ target: { name, value } }) =>
                        handleIssueFormChange(name, value)
                      }
                    />
                    <FormInput
                      type="text"
                      name="status"
                      placeholder="Status"
                      formValues={issueFormValues}
                      onChange={({ target: { name, value } }) =>
                        handleIssueFormChange(name, value)
                      }
                    />
                  </form>

                  <div className="flex justify-end">
                    <button
                      style={{ width: "418px" }}
                      type="submit"
                      className="mt-2 px-6 py-2 bg-primary-pink text-white rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                </div> */}
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
        onConfirm={() => {
          handleConfirmDelete(toDeleteItem.id);
        }}
        message={
          toDeleteItem
            ? `To delete user - ${toDeleteItem.firstName} ${toDeleteItem.lastName} ?`
            : ""
        }
      />
    </>
  );
};

export default ProjectContentPage;



