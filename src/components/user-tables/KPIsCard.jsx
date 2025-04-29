import React, { useEffect, useState } from "react";
import {
    CheckBadgeIcon,
    PlusCircleIcon,
    XMarkIcon,
    PencilIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsisVerticalIcon
} from "@heroicons/react/24/outline";
import FormInput from "../FormInput";
import { useToasts } from "react-toast-notifications";
import axios from "axios";

const KPISection = ({ kpis = [], refetchKPIs }) => {
    const { addToast } = useToasts();
    const [kpiList, setKPIList] = useState(kpis);
    const [addingNew, setAddingNew] = useState(false);
    const [newKPI, setNewKPI] = useState({
        name: "",
        description: "",
        formula: "",
        criteria: "",
        targetMetrics: ""
    });
    const [editingKPIId, setEditingKPIId] = useState(null);
    const [editKPIData, setEditKPIData] = useState({});
    const [showActionsId, setShowActionsId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    useEffect(() => {
        if (JSON.stringify(kpis) !== JSON.stringify(kpiList)) {
            setKPIList(kpis);
        }
    }, [kpis]);

    const totalPages = Math.ceil(kpiList.length / rowsPerPage);
    const currentPageContent = kpiList.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleInputChange = (e, isEdit = false) => {
        const { name, value } = e.target;
        if (isEdit) {
            setEditKPIData({ ...editKPIData, [name]: value });
        } else {
            setNewKPI({ ...newKPI, [name]: value });
        }
    };

    const handleAddKPI = async () => {
        if (!newKPI.name || !newKPI.description) {
            addToast("Name and Description are required", { appearance: "warning" });
            return;
        }

        try {
            const response = await axios.post("/kpis", newKPI);
            if (response?.data?.id) {
                addToast("KPI added successfully", { appearance: "success" });
                refetchKPIs();
                setAddingNew(false);
                setNewKPI({
                    name: "",
                    description: "",
                    formula: "",
                    criteria: "",
                    targetMetrics: ""
                });
            } else {
                throw new Error("KPI creation failed");
            }
        } catch (err) {
            addToast("Failed to add KPI", { appearance: "error" });
        }
    };

    const handleEditKPI = async (id) => {
        try {
            const response = await axios.put(`/kpis/${id}`, editKPIData);
            if (response?.data?.success) {
                addToast("KPI updated successfully", { appearance: "success" });
                refetchKPIs();
                setEditingKPIId(null);
            }
        } catch (err) {
            addToast("Failed to update KPI", { appearance: "error" });
        }
    };

    const handleDeleteKPI = async (id) => {
        try {
            const response = await axios.delete(`/kpis/${id}`);
            if (response?.data?.success) {
                addToast("KPI deleted successfully", { appearance: "success" });
                refetchKPIs();
            }
        } catch (err) {
            addToast("Failed to delete KPI", { appearance: "error" });
        }
    };

    return (
        <div className="w-full mt-8 px-6 py-4 bg-white rounded-md">
            <div className="flex justify-between mb-4">
                <span className="text-lg text-text-color">KPIs</span>
                {!addingNew && (
                    <div
                        className="flex items-center space-x-2 text-text-color cursor-pointer"
                        onClick={() => setAddingNew(true)}
                    >
                        <PlusCircleIcon className="w-5 text-text-color" />
                        <span>Add New</span>
                    </div>
                )}
            </div>
            <table className="table-auto w-full border-collapse">
                <thead>
                    <tr className="text-left text-secondary-grey border-b border-gray-200">
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Formula</th>
                        <th className="py-3 px-4">Criteria</th>
                        <th className="py-3 px-4">Target Metrics</th>
                        <th className="py-3 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {addingNew && (
                        <tr className="border-b border-gray-200">
                            {["name", "description", "formula", "criteria", "targetMetrics"].map((field) => (
                                <td className="px-4 py-3" key={field}>
                                    <FormInput
                                        name={field}
                                        formValues={{ [field]: newKPI[field] }}
                                        onChange={handleInputChange}
                                    />
                                </td>
                            ))}
                            <td className="px-4 py-3 flex gap-3">
                                <CheckBadgeIcon onClick={handleAddKPI} className="w-5 h-5 text-green-600 cursor-pointer" />
                                <XMarkIcon
                                    onClick={() => {
                                        setAddingNew(false);
                                        setNewKPI({
                                            name: "",
                                            description: "",
                                            formula: "",
                                            criteria: "",
                                            targetMetrics: "",
                                        });
                                    }}
                                    className="w-5 h-5 text-red-600 cursor-pointer"
                                />
                            </td>
                        </tr>
                    )}

                    {currentPageContent.map((kpi) => (
                        <tr className="border-b border-gray-200" key={kpi.id}>
                            {editingKPIId === kpi.id ? (
                                <>
                                    {["name", "description", "formula", "criteria", "targetMetrics"].map((field) => (
                                        <td className="px-4 py-3" key={field}>
                                            <FormInput
                                                name={field}
                                                formValues={{ [field]: editKPIData[field] }}
                                                onChange={(e) => handleInputChange(e, true)}
                                            />
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 flex gap-3">
                                        <CheckBadgeIcon
                                            onClick={() => handleEditKPI(kpi.id)}
                                            className="w-5 h-5 text-green-600 cursor-pointer"
                                        />
                                        <XMarkIcon
                                            onClick={() => setEditingKPIId(null)}
                                            className="w-5 h-5 text-red-600 cursor-pointer"
                                        />
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="px-4 py-3">{kpi.name}</td>
                                    <td className="px-4 py-3">{kpi.description}</td>
                                    <td className="px-4 py-3">{kpi.formula}</td>
                                    <td className="px-4 py-3">{kpi.criteria}</td>
                                    <td className="px-4 py-3">{kpi.targetMetrics}</td>
                                    <td className="px-4 py-3">
                                        {showActionsId === kpi.id ? (
                                            <div className="flex items-center gap-3">
                                                <PencilIcon
                                                    className="w-5 h-5 text-text-color cursor-pointer"
                                                    onClick={() => {
                                                        setEditKPIData({
                                                            name: kpi.name || "",
                                                            description: kpi.description || "",
                                                            formula: kpi.formula || "",
                                                            criteria: kpi.criteria || "",
                                                            targetMetrics: kpi.targetMetrics || "",
                                                        });
                                                        setEditingKPIId(kpi.id);
                                                        setShowActionsId(null); // close actions menu
                                                    }}
                                                />
                                                <TrashIcon
                                                    className="w-5 h-5 text-text-color cursor-pointer"
                                                    onClick={() => {
                                                        handleDeleteKPI(kpi.id);
                                                        setShowActionsId(null); // close actions menu
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
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>


            {kpiList.length > rowsPerPage && (
                <div className="w-full flex gap-5 items-center justify-end mt-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className={`p-2 rounded-full bg-gray-200 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeftIcon className="w-4 h-4 text-secondary-grey" />
                    </button>
                    <span className="text-gray-500 text-center">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className={`p-2 rounded-full bg-gray-200 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRightIcon className="w-4 h-4 text-secondary-grey" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default KPISection;
