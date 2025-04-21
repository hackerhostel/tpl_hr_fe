import React, { useEffect, useState } from "react";
import {
    CheckBadgeIcon,
    PlusCircleIcon,
    XMarkIcon,
    PencilIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from "@heroicons/react/24/outline";
import FormInput from "../FormInput";
import { useToasts } from "react-toast-notifications";
import axios from "axios";

const CertificationSection = ({ certifications = [], refetchCertifications }) => {
    const { addToast } = useToasts();
    const [certList, setCertList] = useState(certifications);
    const [addingNew, setAddingNew] = useState(false);
    const [newCert, setNewCert] = useState({
        name: "",
        certification: "",
        institution: "",
        dueDate: "",
        expireDate: ""
    });
    const [editingCertId, setEditingCertId] = useState(null);
    const [editCertData, setEditCertData] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    useEffect(() => {
        const isDifferent = JSON.stringify(certifications) !== JSON.stringify(certList);
        if (isDifferent) {
            setCertList(certifications);
        }
    }, [certifications]);

    const totalPages = Math.ceil(certList.length / rowsPerPage);
    const currentPageContent = certList.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleInputChange = (e, isEdit = false) => {
        const { name, value } = e.target;
        if (isEdit) {
            setEditCertData({ ...editCertData, [name]: value });
        } else {
            setNewCert({ ...newCert, [name]: value });
        }
    };

    const handleAddCertification = async () => {
      if (!newCert.name || !newCert.certification) {
          addToast("Course Name and Certification are required", { appearance: "warning" });
          return;
      }
  
      try {
          // Step 1: Get current employee info
          const whoamiRes = await axios.get("/employees/who-am-i");
          const employeeID = whoamiRes?.data?.body?.userDetails?.id;
          const email = whoamiRes?.data?.body?.userDetails?.email;
  
          console.log("Retrieved email:", email);
  
          if (!employeeID || !email) {
              addToast("Failed to retrieve employee details", { appearance: "error" });
              return;
          }
  
          // Step 2: Prepare and send certification creation
          const payload = {
              certification: {
                  name: newCert.name,
                  certification: newCert.certification,
                  institution: newCert.institution,
                  dueDate: newCert.dueDate,
                  expireDate: newCert.expireDate,
                  trainingStatusID: newCert.trainingStatusID,
                  employeeID: employeeID,
              },
              createdBy: email
          };
  
          console.log("Payload to be sent:", payload);
  
          const response = await axios.post(`/employees/${employeeID}/certifications`, payload);
  
          if (response?.data?.certificationID) {
              addToast("Certification added successfully", { appearance: "success" });
              refetchCertifications();
              setAddingNew(false);
              setNewCert({
                  name: "",
                  certification: "",
                  institution: "",
                  dueDate: "",
                  expireDate: "",
                  trainingStatusID: ""
              });
          } else {
              throw new Error("Certification ID not returned");
          }
      } catch (err) {
          console.error(err);
          addToast("Failed to add certification", { appearance: "error" });
      }
  };
  
    const handleEditCertification = async (id) => {
        try {
            const response = await axios.put(`/certifications/${id}`, editCertData);
            if (response?.data?.success) {
                addToast("Certification updated successfully", { appearance: "success" });
                refetchCertifications();
                setEditingCertId(null);
            }
        } catch (err) {
            addToast("Failed to update certification", { appearance: "error" });
        }
    };

    const handleDeleteCertification = async (id) => {
        try {
            const response = await axios.delete(`/certifications/${id}`);
            if (response?.data?.success) {
                addToast("Certification deleted successfully", { appearance: "success" });
                refetchCertifications();
            }
        } catch (err) {
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
                        <th className="py-3 px-4">Provider</th>
                        <th className="py-3 px-4">Due Date</th>
                        <th className="py-3 px-4">Expiry Date</th>
                        <th className="py-3 px-4">Training</th>
                        <th className="py-3 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {addingNew && (
                        <tr className="border-b border-gray-200">
                            {["name", "certification", "institution", "dueDate", "expireDate", "trainingStatusID"].map((field) => (
                                <td className="px-4 py-3" key={field}>
                                    <FormInput
                                        type={field.includes("Date") ? "date" : "text"}
                                        name={field}
                                        formValues={{ [field]: newCert[field] }}
                                        onChange={(e) => handleInputChange(e)}
                                    />
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
                                            institution: "",
                                            dueDate: "",
                                            expireDate: "",
                                            trainingStatusID: ""
                                        });
                                    }}
                                    className="w-5 h-5 text-red-600 cursor-pointer"
                                />
                            </td>
                        </tr>
                    )}
                    {currentPageContent.map((cert) => (
                        <tr className="border-b border-gray-200" key={cert.id}>
                            {editingCertId === cert.id ? (
                                <>
                                    {["name", "certification", "institution", "dueDate", "expireDate"].map((field) => (
                                        <td className="px-4 py-3" key={field}>
                                            <FormInput
                                                type={field.includes("Date") ? "date" : "text"}
                                                name={field}
                                                formValues={{ [field]: editCertData[field] }}
                                                onChange={(e) => handleInputChange(e, true)}
                                            />
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
                                    <td className="px-4 py-3">{cert.institution}</td>
                                    <td className="px-4 py-3">{cert.dueDate}</td>
                                    <td className="px-4 py-3">{cert.expireDate}</td>
                                    <td className="px-4 py-3">{cert.trainingStatusID}</td>
                                    <td className="px-4 py-3 flex gap-3">
                                        <PencilIcon
                                            onClick={() => {
                                                setEditingCertId(cert.id);
                                                setEditCertData(cert);
                                            }}
                                            className="w-5 h-5 text-blue-600 cursor-pointer"
                                        />
                                        <TrashIcon
                                            onClick={() => handleDeleteCertification(cert.id)}
                                            className="w-5 h-5 text-red-600 cursor-pointer"
                                        />
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {certList.length > rowsPerPage && (
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
