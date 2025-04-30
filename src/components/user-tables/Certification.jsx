import React, {useState} from "react";
import {useSelector} from "react-redux";
import {
    CheckBadgeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsisVerticalIcon,
    PencilIcon,
    PlusCircleIcon,
    TrashIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect"
import {useToasts} from "react-toast-notifications";
import axios from "axios";
import {selectTrainingLevels} from "../../state/slice/masterDataSlice";
import {getSelectOptions} from "../../utils/commonUtils.js";

const CertificationSection = ({selectedUser, certifications, reFetchEmployee}) => {
    const { addToast } = useToasts();
    const [addingNew, setAddingNew] = useState(false);
    const [showActionsId, setShowActionsId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editRow, setEditRow] = useState({});
    const [newCert, setNewCert] = useState({
        name: "",
        certification: "",
        dueDate: "",
        expireDate: "",
        trainingStatusID: "",
        institution: ""
    });

    const [editingCertId, setEditingCertId] = useState(null);
    const [editCertData, setEditCertData] = useState({});
    const trainingStatus = useSelector(selectTrainingLevels);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const totalPages = Math.ceil(certifications.length / rowsPerPage);
    const currentPageContent = certifications.slice(

        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage

    );


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingCertId !== null) {
          setEditCertData((prev) => ({ ...prev, [name]: value }));
        } else {
          setNewCert((prev) => ({ ...prev, [name]: value }));
        }
      };
      

    const handleAddCertification = async () => {
        if (!newCert.name || !newCert.certification) {
            addToast("Course Name and Certification are required", { appearance: "warning" });
            return;
        }

        try {
            const payload = {
                certification: newCert,
            };

            const response = await axios.post(`/employees/${selectedUser.id}/certifications`, payload);

            if (response?.data?.certificationID) {
                addToast("Certification added successfully", { appearance: "success" });
                reFetchEmployee()
                setAddingNew(false);
                setNewCert({
                    name: "",
                    certification: "",
                    dueDate: "",
                    expireDate: "",
                    trainingStatusID: ""
                });
            } else {
                addToast("Failed to add certification", {appearance: "error"});
            }
        } catch (err) {
            console.error(err);
            addToast("Failed to add certification", { appearance: "error" });
        }
    };

    const handleEditCertification = async (certificationID) => {
        try {
            const { institution, ...updatedCertData } = editCertData;

            const payload = {
                certification: {
                    ...updatedCertData,
                    institution: editCertData.institution || undefined,
                    certificationID
                }
            };

            const response = await axios.put(
                `/employees/${selectedUser.id}/certifications/${certificationID}`,
                payload
            );

            if (response?.data?.certificationID) {
                addToast("Certification updated successfully", { appearance: "success" });
                reFetchEmployee()
                setEditingCertId(null);
            } else {
                addToast("Failed to update certification", {appearance: "error"});
            }
        } catch (err) {
            console.error("Update error:", err);
            addToast("Failed to update certification", { appearance: "error" });
        }
    };



    const handleDeleteCertification = async (certificationID) => {
        try {
            const res = await axios.delete(`/employees/${selectedUser.id}/certifications/${certificationID}`);

            if (res?.status === 200) {
                addToast("Certification deleted successfully", { appearance: "success" });
                reFetchEmployee()
            } else {
                addToast("Failed to delete certification", { appearance: "error" });
            }
        } catch (error) {
            console.error("Delete error:", error);
            addToast("Failed to delete certification", { appearance: "error" });
        }
    };

    return (
        <div className="w-full mt-8 px-6 py-4 bg-white rounded-md">
            <div className="flex justify-between mb-4">
                <span className="text-lg text-text-color">Certifications</span>
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
                        <th className="py-3 px-4">Course Name</th>
                        <th className="py-3 px-4">Certification</th>
                        <th className="py-3 px-4">Due Date</th>
                        <th className="py-3 px-4">Expiry Date</th>
                        <th className="py-3 px-4">Training</th>
                        <th className="py-3 px-4">Institution</th>
                        <th className="py-3 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {addingNew && (
                        <tr className="border-b border-gray-200">
                            {["name", "certification", "dueDate", "expireDate", "trainingStatusID", "institution"].map((field) => (
                                <td className="px-4 py-3" key={field}>
                                    {field === "trainingStatusID" ? (
                                        <FormSelect
                                            name={field}
                                            options={getSelectOptions(trainingStatus)}
                                            value={trainingStatus.find((option) => option.id === Number(newCert[field]))?.id || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    { target: { name: field, value: e.target.value } },
                                                    false
                                                )
                                            }
                                            showErrors={false}
                                            required
                                        />
                                    ) : (
                                        <FormInput
                                            type={field.includes("Date") ? "date" : "text"}
                                            name={field}
                                            formValues={{ [field]: newCert[field] }}
                                            onChange={(e) => handleInputChange(e, false)}
                                        />
                                    )}
                                </td>
                            ))}


                            <td className="px-4 py-3 flex gap-3">
                                <CheckBadgeIcon onClick={handleAddCertification} className="w-5 h-5 text-green-600 cursor-pointer" />
                                <XMarkIcon
                                    onClick={() => {
                                        setAddingNew(false);
                                        setNewCert({
                                            name: "",
                                            certification: "",
                                            dueDate: "",
                                            expireDate: "",
                                            trainingStatusID: "",
                                            institution: ""
                                        });

                                    }}
                                    className="w-5 h-5 text-red-600 cursor-pointer"
                                />
                            </td>
                        </tr>
                    )}

                    {currentPageContent.map((cert) => {
                        const isEditing = editingCertId === cert.id;

                        return (
                            <tr className="border-b border-gray-200" key={cert.id}>
                                {isEditing ? (
                                    <>
                                        {["name", "certification", "dueDate", "expireDate", "trainingStatusID", "institution"].map((field) => (
                                           <td className="px-4 py-3" key={field}>
                                           {field === "trainingStatusID" ? (
                                               <FormSelect
                                                   name={field}
                                                   options={getSelectOptions(trainingStatus)}
                                                   formValues={editCertData}
                                                   onChange={(e) => handleInputChange(e, false)}
                                                   showErrors={false}
                                                   required
                                               />
                                           ) : (
                                               <FormInput
                                                   type={field.includes("Date") ? "date" : "text"}
                                                   name={field}
                                                   formValues={{ [field]: editCertData[field] }}
                                                   onChange={(e) => handleInputChange(e, false)}
                                               />
                                           )}
                                       </td>
                                        ))}
                                        <td className="px-4 py-3 flex gap-3">
                                            <CheckBadgeIcon
                                                onClick={() => handleEditCertification(cert.id)}
                                                className="w-5 h-5 text-green-600 cursor-pointer"
                                            />
                                            <XMarkIcon
                                                onClick={() => setEditingCertId(null)}
                                                className="w-5 h-5 text-red-600 cursor-pointer"
                                            />
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-4 py-3">{cert.name}</td>
                                        <td className="px-4 py-3">{cert.certification}</td>
                                        <td className="px-4 py-3">{cert.dueDate?.split("T")[0]}</td>
                                        <td className="px-4 py-3">{cert.expireDate?.split("T")[0]}</td>
                                        <td className="px-4 py-3">{trainingStatus.find(ts => ts.id === cert.trainingStatusID)?.name || "—"}</td>
                                        <td className="px-4 py-3">{cert.institution}</td>
                                        <td className="px-4 py-4 relative">
                                            {showActionsId === cert.id ? (
                                                <div className="flex gap-3">
                                                    <PencilIcon
                                                        className="w-5 h-5 text-text-color cursor-pointer"
                                                        onClick={() => {
                                                            setEditCertData({
                                                                name: cert.name || "",
                                                                certification: cert.certification || "",
                                                                dueDate: cert.dueDate ? cert.dueDate.split("T")[0] : "",
                                                                expireDate: cert.expireDate ? cert.expireDate.split("T")[0] : "",
                                                                trainingStatusID: cert.trainingStatusID || "",
                                                                institution: cert.institution || ""
                                                            });
                                                            setEditingCertId(cert.id);
                                                            setShowActionsId(null);
                                                        }}
                                                    />

                                                    <TrashIcon
                                                        className="w-5 h-5 text-text-color cursor-pointer"
                                                        onClick={() => handleDeleteCertification(cert.id)}
                                                    />
                                                    <XMarkIcon
                                                        className="w-5 h-5 text-text-color cursor-pointer"
                                                        onClick={() => setShowActionsId(null)}
                                                    />
                                                </div>
                                            ) : (
                                                <EllipsisVerticalIcon
                                                    className="w-5 h-5 text-text-color cursor-pointer"
                                                    onClick={() => setShowActionsId(cert.id)}
                                                />
                                            )}
                                        </td>
                                    </>
                                )}
                            </tr>
                        );
                    })}

                </tbody>
            </table>

            {certifications.length > rowsPerPage && (
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

export default CertificationSection;
