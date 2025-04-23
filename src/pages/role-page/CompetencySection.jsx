import React, {useState} from "react";
import {
    CheckBadgeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsisVerticalIcon,
    PlusCircleIcon,
    XMarkIcon
} from "@heroicons/react/24/outline/index.js";
import axios from "axios";
import {useToasts} from "react-toast-notifications";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import {getSelectOptions} from "../../utils/commonUtils.js";

const CompetencySection = ({
                               competencies,
                               roleId,
                               reFetchRole,
                               proficiencyLevels
                           }) => {
    const {addToast} = useToasts();
    const [newRow, setNewRow] = useState({
        name: '',
        description: '',
        proficiencyID: 0
    });
    const [showNewRow, setShowNewRow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const rowsPerPage = 5;
    const totalPages = competencies && competencies.length ? Math.ceil(competencies.length / rowsPerPage) : 0;
    const indexOfLastTask = currentPage * rowsPerPage;
    const indexOfFirstTask = indexOfLastTask - rowsPerPage;
    const currentPageContent = competencies && competencies.length ? competencies.slice(indexOfFirstTask, indexOfLastTask) : [];

    const handleAddNew = () => {
        setShowNewRow(true)
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const onHideNew = () => {
        setShowNewRow(false)
        setNewRow({
            name: '',
            description: '',
            proficiencyID: 0
        })
    }

    const handleFormChange = (name, value, isText) => {
        setNewRow({...newRow, [name]: isText ? value : Number(value)});
    };

    const handleSaveCompetency = async () => {
        const {name, description, proficiencyID} = newRow;

        if (!name || !description) {
            addToast('All Fields Are Required.', {appearance: 'warning'});
            return;
        }

        const payload = {
            name,
            description,
            proficiencyID: proficiencyID > 0 ? proficiencyID : proficiencyLevels[0]?.id
        };

        try {
            const response = await axios.post(`designations/${roleId}/competencies`, {competency: payload})
            const created = response?.data?.body

            if (created) {
                addToast('Competency successfully created', {appearance: 'success'});
                reFetchRole()
                onHideNew()
            } else {
                addToast('Failed to create the Competency', {appearance: 'error'});
            }
        } catch (error) {
            addToast('Failed to create the Competency', {appearance: 'error'});
        }
    };

    const GenerateRow = ({competency}) => {
        const subTaskId = competency?.id
        const editStatus = competency?.attributes?.status

        const initialData = {
            name: competency?.name,
            status: 1,
            assignee: 1
        }

        const [isEditing, setIsEditing] = useState(false);
        const [editRow, setEditRow] = useState(initialData);

        const handleEditFormChange = (name, value, isText) => {
            setEditRow({...editRow, [name]: isText ? value : Number(value)});
        };

        const onHideEdit = () => {
            setIsEditing(false)
            setEditRow(initialData)
        }

        const handleUpdateTask = async () => {
            const payloads = [];

            if (editRow.name !== initialData.name) {
                if (editRow.name.trim() === '') {
                    addToast('Name is required', {appearance: 'warning'});
                    return;
                }
                payloads.push({
                    taskID: subTaskId,
                    type: "TASK",
                    attributeDetails: {
                        attributeKey: "Name",
                        attributeValue: editRow.name,
                    },
                });
            }

            if (editRow.assignee !== initialData.assignee) {
                payloads.push({
                    taskID: subTaskId,
                    type: "TASK",
                    attributeDetails: {
                        attributeKey: "assigneeID",
                        attributeValue: editRow.assignee,
                    },
                });
            }

            if (editRow.status !== initialData.status) {
                if (!editStatus?.attributeId || !editStatus?.fieldID) {
                    addToast('Invalid status update details', {appearance: 'warning'});
                    return;
                }
                payloads.push({
                    taskID: subTaskId,
                    type: "TASK_ATTRIBUTE",
                    attributeDetails: {
                        attributeKey: editStatus.attributeId,
                        taskFieldID: editStatus.fieldID,
                        attributeValue: editRow.status,
                    },
                });
            }

            if (payloads.length) {
                try {
                    await Promise.all(
                        payloads.map(payload => axios.put(`/tasks/${subTaskId}`, payload))
                    );
                    addToast('Sub task successfully updated', {appearance: 'success'});
                    setIsEditing(false);
                    // refetchTask(true);
                } catch (error) {
                    console.error('Error updating sub task:', error);
                    addToast('Failed to update the sub task', {appearance: 'error'});
                }
            } else {
                addToast('No changes to update', {appearance: 'warning'});
            }
        };

        return (
            <tr className="border-b border-gray-200">
                {!isEditing ? (
                    <>
                        <td className="py-5 px-4 text-text-color">{competency?.name}</td>
                        <td className="py-5 px-4 text-text-color">{competency?.description}</td>
                        <td className="py-5 px-4 text-text-color">{competency?.proficencyLevelName}</td>
                        <td className="px-4 py-5">
                            <div className={"flex gap-5"}>
                                <div className="cursor-pointer"
                                    // onClick={() => setIsEditing(true)}
                                >
                                    <EllipsisVerticalIcon className={"w-5 h-5 text-secondary-grey cursor-pointer"}/>
                                </div>
                            </div>
                        </td>
                    </>
                ) : (
                    <>
                        <td className="px-4 py-5 w-44">
                            <FormInput
                                type="text"
                                name="name"
                                formValues={{name: editRow.name}}
                                onChange={({target: {name, value}}) => handleEditFormChange(name, value, true)}
                            />
                        </td>
                        <td className="px-4 py-5">
                            <FormInput
                                type="text"
                                name="name"
                                formValues={{name: editRow.name}}
                                onChange={({target: {name, value}}) => handleEditFormChange(name, value, true)}
                            />
                        </td>
                        <td className="px-4 py-5">
                            <FormInput
                                type="text"
                                name="name"
                                formValues={{name: editRow.name}}
                                onChange={({target: {name, value}}) => handleEditFormChange(name, value, true)}
                            />
                        </td>
                        <td className="px-4 py-5">
                            <div className={"flex gap-5"}>
                                <div className={"cursor-pointer"} onClick={handleUpdateTask}>
                                    <CheckBadgeIcon className={"w-6 h-6 text-pink-700"}/>
                                </div>
                                <div className={"cursor-pointer"} onClick={onHideEdit}>
                                    <XMarkIcon className={"w-6 h-6 text-text-color"}/>
                                </div>
                            </div>
                        </td>
                    </>
                )}
            </tr>
        );
    };

    return (
        <div className="bg-white">
            <div className="flex items-center justify-between p-4">
                <p className="text-secondary-grey text-lg font-medium">Competencies ({competencies?.length})</p>
                <button className="flex items-center space-x-2 text-text-color cursor-pointer"
                        onClick={() => handleAddNew()}>
                    <PlusCircleIcon className="w-5 text-text-color"/>
                    <span>Add New</span>
                </button>
            </div>
            {(competencies && competencies.length) || showNewRow ? (
                <>
                    <table className="table-auto w-full border-collapse">
                        <thead>
                        <tr className="text-left text-secondary-grey border-b border-gray-200">
                            <th className="py-5 px-4">Name</th>
                            <th className="py-5 px-4">Description</th>
                            <th className="py-5 px-4">Proficiency Level</th>
                            <th className="py-5 px-4">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {showNewRow && (
                            <tr className="border-b border-gray-200">
                                <td className="px-4 py-5">
                                    <FormInput
                                        type="text"
                                        name="name"
                                        formValues={{name: newRow.name}}
                                        onChange={({target: {name, value}}) => handleFormChange(name, value, true)}
                                    />
                                </td>
                                <td className="px-4 py-5">
                                    <FormInput
                                        type="text"
                                        name="description"
                                        formValues={{name: newRow.description}}
                                        onChange={({target: {name, value}}) => handleFormChange(name, value, true)}
                                    />
                                </td>
                                <td className="px-4 py-5">
                                    <FormSelect
                                        name="proficiencyID"
                                        formValues={{proficiencyID: newRow.proficiencyID}}
                                        options={getSelectOptions(proficiencyLevels)}
                                        onChange={({target: {name, value}}) => handleFormChange(name, value, false)}
                                    />
                                </td>
                                <td className="px-4 py-5">
                                    <div className={"flex gap-5"}>
                                        <div className={"cursor-pointer"} onClick={handleSaveCompetency}>
                                            <CheckBadgeIcon className={"w-6 h-6 text-pink-700"}/>
                                        </div>
                                        <div className={"cursor-pointer"} onClick={onHideNew}>
                                            <XMarkIcon className={"w-6 h-6 text-text-color"}/>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {currentPageContent.map((competency) => (
                            <GenerateRow competency={competency} key={competency?.id}/>
                        ))}
                        </tbody>
                    </table>
                    {(competencies && competencies.length > 0) && (
                        <div className="w-full flex gap-5 items-center justify-end mt-4 mb-4">
                            <button
                                onClick={handlePreviousPage}
                                className={`p-2 rounded-full bg-gray-200 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeftIcon className={"w-4 h-4 text-secondary-grey"}/>
                            </button>
                            <span className="text-gray-500 text-center">Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={handleNextPage}
                                className={`p-2 rounded-full bg-gray-200 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRightIcon className={"w-4 h-4 text-secondary-grey"}/>
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-text-color w-full text-center mb-10">No Competencies Available</p>
            )}
        </div>
    );
};

export default CompetencySection;
