import React, { useState } from "react";
import {
    CheckBadgeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PencilIcon,
    PlusCircleIcon,
    TrashIcon,
    XMarkIcon,
    EllipsisVerticalIcon
} from "@heroicons/react/24/outline/index.js";
import axios from "axios";
import { useToasts } from "react-toast-notifications";
import FormInput from "../../components/FormInput.jsx";

const KPISection = ({
    kpis,
    roleId,
    reFetchRole,
}) => {
    const { addToast } = useToasts();
    const [newRow, setNewRow] = useState({
        name: '',
        description: '',
        formula: '',
        evaluationCriteria: '',
        targetMetrics: ''
    });
    const [showNewRow, setShowNewRow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showActionsId, setShowActionsId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const rowsPerPage = 5;
    const totalPages = kpis && kpis.length ? Math.ceil(kpis.length / rowsPerPage) : 0;
    const indexOfLastTask = currentPage * rowsPerPage;
    const indexOfFirstTask = indexOfLastTask - rowsPerPage;
    const currentPageContent = kpis && kpis.length ? kpis.slice(indexOfFirstTask, indexOfLastTask) : [];

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
            formula: '',
            evaluationCriteria: '',
            targetMetrics: ''
        })
    }

    const handleFormChange = (name, value, isText) => {
        setNewRow({ ...newRow, [name]: isText ? value : Number(value) });
    };

    const handleSaveKPI = async () => {
        const { name, description, formula, evaluationCriteria, targetMetrics } = newRow;

        if (!name || !description || !formula || !evaluationCriteria || !targetMetrics) {
            addToast('All Fields Are Required.', { appearance: 'warning' });
            return;
        }

        const payload = {
            name,
            description,
            formula,
            evaluationCriteria,
            targetMetrics,
        };

        try {
            const response = await axios.post(`designations/${roleId}/kpis`, { kpiItem: payload })
            const created = response?.data?.body

            if (created) {
                addToast('KPI successfully created', { appearance: 'success' });
                reFetchRole()
                onHideNew()
            } else {
                addToast('Failed to create the KPI', { appearance: 'error' });
            }
        } catch (error) {
            addToast('Failed to create the KPI', { appearance: 'error' });
        }
    };

    const handleDeleteKPI = async (kpiId) => {
        try {
            const response = await axios.delete(`designations/${roleId}/kpis/${kpiId}`);
            const deleted = response?.status;

            if (deleted) {
                addToast('KPI Successfully Deleted', { appearance: 'success' });
                reFetchRole();
                setConfirmDeleteId(null);
            } else {
                addToast('Failed To Delete The KPI', { appearance: 'error' });
            }
        } catch (error) {
            console.log(error);
            addToast('Failed To Delete The KPI', { appearance: 'error' });
        }
    };

    const GenerateRow = ({ kpi }) => {
        const initialData = {
            name: kpi?.name,
            description: kpi?.description,
            formula: kpi?.formula,
            evaluationCriteria: kpi?.evaluationCriteria,
            targetMetrics: kpi?.targetMetrics
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

        const handleUpdateKPI = async () => {
            try {
                const response = await axios.put(`designations/${roleId}/kpis/${kpi?.id}`, { kpiItem: editRow })
                const updated = response?.status

                if (updated) {
                    addToast('KPI Successfully Updated', { appearance: 'success' });
                    reFetchRole()
                } else {
                    addToast('Failed To Update The KPI', { appearance: 'error' });
                }
            } catch (error) {
                console.log(error)
                addToast('Failed To Update The KPI', { appearance: 'error' });
            }
        };

        return (
            <tr className="border-b border-gray-200">
                {!isEditing ? (
                    <>
                        <td className="py-5 px-4 text-text-color">{kpi?.name}</td>
                        <td className="py-5 px-4 text-text-color">{kpi?.description}</td>
                        <td className="py-5 px-4 text-text-color">{kpi?.formula}</td>
                        <td className="py-5 px-4 text-text-color">{kpi?.evaluationCriteria}</td>
                        <td className="py-5 px-4 text-text-color">{kpi?.targetMetrics}</td>
                        <td className="px-4 py-5">
                            {showActionsId === kpi.id ? (
                                <div className="flex items-center gap-3">
                                    <PencilIcon
                                        className="w-5 h-5 text-text-color cursor-pointer"
                                        onClick={() => {
                                            setIsEditing({
                                                name: kpi.name || "",
                                                description: kpi.description || "",
                                                formula: kpi.formula || "",
                                                criteria: kpi.criteria || "",
                                                targetMetrics: kpi.targetMetrics || "",
                                            });
                                            setEditingKPIId(kpi.id);
                                            setShowActionsId(null);
                                        }}
                                    />
                                    <TrashIcon
                                        className="w-5 h-5 text-text-color cursor-pointer"
                                        onClick={() => {
                                            setConfirmDeleteId(kpi.id);
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
                                    onClick={() => setShowActionsId(kpi.id)}
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
                            <FormInput
                                type="text"
                                name="formula"
                                formValues={{ formula: editRow.formula }}
                                onChange={({ target: { name, value } }) => handleEditFormChange(name, value, true)}
                            />
                        </td>
                        <td className="px-4 py-5">
                            <FormInput
                                type="text"
                                name="evaluationCriteria"
                                formValues={{ evaluationCriteria: editRow.evaluationCriteria }}
                                onChange={({ target: { name, value } }) => handleEditFormChange(name, value, true)}
                            />
                        </td>
                        <td className="px-4 py-5">
                            <FormInput
                                type="text"
                                name="targetMetrics"
                                formValues={{ targetMetrics: editRow.targetMetrics }}
                                onChange={({ target: { name, value } }) => handleEditFormChange(name, value, true)}
                            />
                        </td>
                        <td className="px-4 py-5">
                            <div className={"flex gap-5"}>
                                <div className={"cursor-pointer"} onClick={handleUpdateKPI}>
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

    return (
        <div className="bg-white">
            <div className="flex items-center justify-between p-4">
                <p className="text-secondary-grey text-lg font-medium">KPIs ({kpis?.length})</p>
                <button className="flex items-center space-x-2 text-text-color cursor-pointer"
                    onClick={() => handleAddNew()}>
                    <PlusCircleIcon className="w-5 text-text-color" />
                    <span>Add New</span>
                </button>
            </div>
            {(kpis && kpis.length) || showNewRow ? (
                <>
                    <table className="table-auto w-full border-collapse">
                        <thead>
                            <tr className="text-left text-secondary-grey border-b border-gray-200">
                                <th className="py-5 px-4">Name</th>
                                <th className="py-5 px-4">Description</th>
                                <th className="py-5 px-4">Formula</th>
                                <th className="py-5 px-4">Evaluation Criteria</th>
                                <th className="py-5 px-4">Target Metrics</th>
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
                                            formValues={{ description: newRow.description }}
                                            onChange={({ target: { name, value } }) => handleFormChange(name, value, true)}
                                        />
                                    </td>
                                    <td className="px-4 py-5">
                                        <FormInput
                                            type="text"
                                            name="formula"
                                            formValues={{ formula: newRow.formula }}
                                            onChange={({ target: { name, value } }) => handleFormChange(name, value, true)}
                                        />
                                    </td>
                                    <td className="px-4 py-5">
                                        <FormInput
                                            type="text"
                                            name="evaluationCriteria"
                                            formValues={{ evaluationCriteria: newRow.evaluationCriteria }}
                                            onChange={({ target: { name, value } }) => handleFormChange(name, value, true)}
                                        />
                                    </td>
                                    <td className="px-4 py-5">
                                        <FormInput
                                            type="text"
                                            name="targetMetrics"
                                            formValues={{ targetMetrics: newRow.targetMetrics }}
                                            onChange={({ target: { name, value } }) => handleFormChange(name, value, true)}
                                        />
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className={"flex gap-5"}>
                                            <div className={"cursor-pointer"} onClick={handleSaveKPI}>
                                                <CheckBadgeIcon className={"w-6 h-6 text-pink-700"} />
                                            </div>
                                            <div className={"cursor-pointer"} onClick={onHideNew}>
                                                <XMarkIcon className={"w-6 h-6 text-text-color"} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {currentPageContent.map((kpi) => (
                                <GenerateRow kpi={kpi} key={kpi?.id} />
                            ))}
                        </tbody>
                    </table>

                    {confirmDeleteId && (
                        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                            <div className="bg-white rounded-md p-6 w-96 shadow-lg">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Deletion</h2>
                                <p className="mb-6 text-sm text-gray-600">
                                    Are you sure you want to delete this KPI? This action cannot be undone.
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setConfirmDeleteId(null)}
                                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                                    >Cancel</button>
                                    <button
                                        onClick={()=> handleDeleteKPI(confirmDeleteId)}
                                        className="px-4 py-2 rounded bg-primary-pink text-white text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {(kpis && kpis.length > 0) && (
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
                <p className="text-text-color w-full text-center mb-10">No KPIs Available</p>
            )}
        </div>
    );
};



export default KPISection;
