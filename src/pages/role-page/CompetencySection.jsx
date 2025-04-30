import React, { useState } from "react";
import {
    CheckBadgeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PencilIcon,
    PlusCircleIcon,
    TrashIcon,
    EllipsisVerticalIcon,
    XMarkIcon
} from "@heroicons/react/24/outline/index.js";
import axios from "axios";
import { useToasts } from "react-toast-notifications";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";
import { getSelectOptions } from "../../utils/commonUtils.js";

const CompetencySection = ({
    competencies,
    roleId,
    reFetchRole,
    proficiencyLevels
}) => {
    const { addToast } = useToasts();
    const [newRow, setNewRow] = useState({
        name: '',
        description: '',
        proficiencyID: 0
    });
    const [showNewRow, setShowNewRow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [showActionsId, setShowActionsId] = useState(null);
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
        setNewRow({ ...newRow, [name]: isText ? value : Number(value) });
    };

    const handleSaveCompetency = async () => {
        const { name, description, proficiencyID } = newRow;

        if (!name || !description) {
            addToast('All Fields Are Required.', { appearance: 'warning' });
            return;
        }

        const payload = {
            name,
            description,
            proficiencyID: proficiencyID > 0 ? proficiencyID : proficiencyLevels[0]?.id
        };

        try {
            const response = await axios.post(`designations/${roleId}/competencies`, { competency: payload })
            const created = response?.data?.body

            if (created) {
                addToast('Competency successfully created', { appearance: 'success' });
                reFetchRole()
                onHideNew()
            } else {
                addToast('Failed to create the Competency', { appearance: 'error' });
            }
        } catch (error) {
            addToast('Failed to create the Competency', { appearance: 'error' });
        }
    };

    const GenerateRow = ({ competency }) => {
        const initialData = {
            name: competency?.name,
            description: competency?.description,
            proficiencyID: competency?.proficiencyID,
        }

        const [isEditing, setIsEditing] = useState(false);
        const [editRow, setEditRow] = useState(initialData);

        const handleEditFormChange = (name, value, isText) => {
            setEditRow({ ...editRow, [name]: isText ? value : Number(value) });
        };

        const onHideEdit = () => {
            setIsEditing(false)
            setEditRow(initialData)
        }

        const handleUpdateCompetency = async () => {
            try {
                const response = await axios.put(`designations/${roleId}/competencies/${competency?.id}`, { competency: editRow })
                const updated = response?.status

                if (updated) {
                    addToast('Competency Successfully Updated', { appearance: 'success' });
                    reFetchRole()
                } else {
                    addToast('Failed To Update The Competency', { appearance: 'error' });
                }
            } catch (error) {
                console.log(error)
                addToast('Failed To Update The Competency', { appearance: 'error' });
            }
        };

        const confirmDeleteCompetency = (kpiId) => {
            setConfirmDeleteId(kpiId);
        };


        const handleDeleteCompetency = async () => {
            try {
                const response = await axios.delete(`designations/${roleId}/competencies/${competency?.id}`)
                const deleted = response?.status

                if (deleted) {
                    addToast('Competency Successfully Deleted', { appearance: 'success' });
                    reFetchRole()
                } else {
                    addToast('Failed To Delete The Competency', { appearance: 'error' });
                }
            } catch (error) {
                console.log(error)
                addToast('Failed To Delete The Competency', { appearance: 'error' });
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
                            {showActionsId === competency.id ? (
                                <div className="flex items-center gap-3">
                                    <PencilIcon
                                        className="w-5 h-5 text-text-color cursor-pointer"
                                        onClick={() => {
                                            setIsEditing({
                                                name: competency.name || "",
                                                description: competency.description || "",
                                                proficiencyLevel: competency.proficencyLevelName || "", 
                                            });
                                            setEditingKPIId(competency.id);
                                            setShowActionsId(null);
                                        }}
                                    />
                                    <TrashIcon
                                        className="w-5 h-5 text-text-color cursor-pointer"
                                        onClick={() => {
                                            confirmDeleteCompetency(competency.id);
                                            setShowActionsId(null);
                                        }}
                                    />

                                    <XMarkIcon
                                        className="w-5 h-5 text-text-color cursor-pointer"
                                        onClick={() => setShowActionsId(null)}
                                    />
                                </div>
                            ) : (
                                <EllipsisVerticalIcon
                                    className="w-5 h-5 text-text-color cursor-pointer"
                                    onClick={() => setShowActionsId(competency.id)}
                                />
                            )}
                        </td>
                    </>
                ) : (
                    <>
                        <td className="px-4 py-5 w-44">
                            <FormInput
                                type="text"
                                name="name"
                                formValues={{ name: editRow.name }}
                                onChange={({ target: { name, value } }) => handleEditFormChange(name, value, true)}
                            />
                        </td>
                        <td className="px-4 py-5">
                            <FormInput
                                type="text"
                                name="description"
                                formValues={{ description: editRow.description }}
                                onChange={({ target: { name, value } }) => handleEditFormChange(name, value, true)}
                            />
                        </td>
                        <td className="px-4 py-5">
                            <FormSelect
                                name="proficiencyID"
                                formValues={{ proficiencyID: editRow.proficiencyID }}
                                options={getSelectOptions(proficiencyLevels)}
                                onChange={({ target: { name, value } }) => handleEditFormChange(name, value, false)}
                            />
                        </td>
                        <td className="px-4 py-5">
                            <div className={"flex gap-5"}>
                                <div className={"cursor-pointer"} onClick={handleUpdateCompetency}>
                                    <CheckBadgeIcon className={"w-6 h-6 text-pink-700"} />
                                </div>
                                <div className={"cursor-pointer"} onClick={onHideEdit}>
                                    <XMarkIcon className={"w-6 h-6 text-text-color"} />
                                </div>
                            </div>
                        </td>
                    </>
                )}
            </tr>

            

        );
    };

    
    {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-md p-6 w-96 shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Deletion</h2>
                <p className="mb-6 text-sm text-gray-600">
                    Are you sure you want to delete this Competency? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            handleDeleteKPI(confirmDeleteId);
                            setConfirmDeleteId(null);
                        }}
                        className="px-4 py-2 rounded bg-primary-pink text-white text-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )}

    return (
        <div className="bg-white">
            <div className="flex items-center justify-between p-4">
                <p className="text-secondary-grey text-lg font-medium">Competencies ({competencies?.length})</p>
                <button className="flex items-center space-x-2 text-text-color cursor-pointer"
                    onClick={() => handleAddNew()}>
                    <PlusCircleIcon className="w-5 text-text-color" />
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
                                            formValues={{ name: newRow.name }}
                                            onChange={({ target: { name, value } }) => handleFormChange(name, value, true)}
                                        />
                                    </td>
                                    <td className="px-4 py-5">
                                        <FormInput
                                            type="text"
                                            name="description"
                                            formValues={{ name: newRow.description }}
                                            onChange={({ target: { name, value } }) => handleFormChange(name, value, true)}
                                        />
                                    </td>
                                    <td className="px-4 py-5">
                                        <FormSelect
                                            name="proficiencyID"
                                            formValues={{ proficiencyID: newRow.proficiencyID }}
                                            options={getSelectOptions(proficiencyLevels)}
                                            onChange={({ target: { name, value } }) => handleFormChange(name, value, false)}
                                        />
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className={"flex gap-5"}>
                                            <div className={"cursor-pointer"} onClick={handleSaveCompetency}>
                                                <CheckBadgeIcon className={"w-6 h-6 text-pink-700"} />
                                            </div>
                                            <div className={"cursor-pointer"} onClick={onHideNew}>
                                                <XMarkIcon className={"w-6 h-6 text-text-color"} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {currentPageContent.map((competency) => (
                                <GenerateRow competency={competency} key={competency?.id} />
                            ))}
                        </tbody>
                    </table>

                    {confirmDeleteId && (
                        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                            <div className="bg-white rounded-md p-6 w-96 shadow-lg">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Deletion</h2>
                                <p className="mb-6 text-sm text-gray-600">
                                    Are you sure you want to delete this Competency? This action cannot be undone.
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setConfirmDeleteId(null)}
                                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDeleteKPI(confirmDeleteId);
                                            setConfirmDeleteId(null);
                                        }}
                                        className="px-4 py-2 rounded bg-primary-pink text-white text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {(competencies && competencies.length > 0) && (
                        <div className="w-full flex gap-5 items-center justify-end mt-4 mb-4">
                            <button
                                onClick={handlePreviousPage}
                                className={`p-2 rounded-full bg-gray-200 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeftIcon className={"w-4 h-4 text-secondary-grey"} />
                            </button>
                            <span className="text-gray-500 text-center">Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={handleNextPage}
                                className={`p-2 rounded-full bg-gray-200 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRightIcon className={"w-4 h-4 text-secondary-grey"} />
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
