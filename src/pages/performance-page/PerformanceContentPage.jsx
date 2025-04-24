import React, {useEffect, useState} from "react";
import FormSelect from "../../components/FormSelect.jsx";
import FormTextArea from "../../components/FormTextArea.jsx";
import FormInput from "../../components/FormInput.jsx"
import {getSelectOptionsForPR} from "../../utils/commonUtils.js";
import useFetchPerformanceReviewFormData
    from "../../hooks/custom-hooks/performance/useFetchPerformanceReviewFormData.jsx";
import useFetchPerformanceReviews from "../../hooks/custom-hooks/performance/useFetchPerformanceReviews.jsx";

const PerformanceContentPage = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(0);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(0);
    const [cycles, setCycles] = useState([]);
    const [selectedCycle, setSelectedCycle] = useState(0);
    const [reviewCycle, setReviewCycle] = useState({})
    const [reviewItems, setReviewItems] = useState([])

    const {data: formData} = useFetchPerformanceReviewFormData()
    const {data: reviewData} = useFetchPerformanceReviews(selectedEmployee, selectedCycle)

    useEffect(() => {
        const resetDepartments = () => {
            setDepartments([]);
            setSelectedDepartment(0);
        };

        if (!formData?.departments || formData?.departments === '') {
            resetDepartments();
            return;
        }

        try {
            const parsedDepartments = JSON.parse(formData?.departments);
            if (Array.isArray(parsedDepartments) && parsedDepartments.length > 0) {
                setDepartments(parsedDepartments);
                if (selectedDepartment === 0) {
                    setSelectedDepartment(parsedDepartments[0]?.departmentID);
                }
            } else {
                resetDepartments();
            }
        } catch (error) {
            console.error("Error parsing departments JSON:", error);
            resetDepartments();
        }
    }, [formData]);


    useEffect(() => {
        const resetEmployees = () => {
            setEmployees([]);
            setSelectedEmployee(0);
        };

        if (selectedDepartment <= 0) {
            resetEmployees();
            return;
        }

        try {
            const parsedDepartments = JSON.parse(formData?.departments || '[]');
            const department = parsedDepartments.find(
                dept => dept.departmentID === selectedDepartment
            );

            if (!department || !department?.employees?.length) {
                resetEmployees();
                return;
            }

            const employeeList = department?.employees;
            setEmployees(employeeList);
            setSelectedEmployee(employeeList[0]?.EmployeeID);
        } catch (error) {
            console.error("Failed to parse departments:", error);
            resetEmployees();
        }
    }, [selectedDepartment]);


    useEffect(() => {
        const hasSelectedEmployee = selectedEmployee > 0;
        const hasCycles = formData?.cycles?.length > 0;

        if (!hasSelectedEmployee) {
            setCycles([]);
            setSelectedCycle(0);
            return;
        }

        if (hasCycles) {
            const cycleList = formData?.cycles;
            setCycles(cycleList);
            if (selectedCycle === 0) {
                setSelectedCycle(cycleList[0]?.id);
            }
        } else {
            setCycles([]);
            setSelectedCycle(0);
        }
    }, [selectedEmployee]);

    useEffect(() => {
        const reviewCycleData = reviewData?.review
        if (reviewCycleData) {
            setReviewCycle(reviewCycleData)
            if (reviewCycleData?.reviewItems && reviewCycleData?.reviewItems.length) {
                setReviewItems(reviewCycleData?.reviewItems)
            }
        }
    }, [reviewData]);

    const [isUpdating, setIsUpdating] = useState(false);

    const StatusCount = ({ count, label, variant = "default" }) => {
        const variants = {
            default: "border-gray-300 text-gray-600",
            success: "border-green-500 text-green-600",
            danger: "border-red-500 text-red-600",
            warning: "border-yellow-500 text-yellow-600",
        };

        return (
            <div
                className={`flex flex-col items-center justify-center p-4 rounded-lg min-w-[200px] border-2 ${variants[variant]}`}
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
            >
                <span className="text-2xl font-semibold mb-1">{count}</span>
                <span className="text-sm">{label}</span>
            </div>
        );
    };


    const testExecutions = [
        {
            id: 1,
            kpi: "Code Quality",
            target: "90%",
            scores: "85%",
            status: 1,
            notes: "Needs minor improvements in documentation.",
        },
        {
            id: 2,
            kpi: "Test Coverage",
            target: "80%",
            scores: "78%",
            status: 2,
            notes: "Increase unit test coverage for critical modules.",
        },
        {
            id: 3,
            kpi: "Performance",
            target: "1s response time",
            scores: "1.2s",
            status: 3,
            notes: "Optimize API calls for better response time.",
        },
    ];

    return (
        <div className="p-2 bg-dashboard-bgc h-full">
            <div className="flex w-full justify-between items-center mt-2">
                <p className="text-text-color font-bold text-sm align-left">Performance Reviews</p>
                <div className="flex space-x-2 justify-end w-1/2">
                    <FormSelect name="department" className="w-64"
                                options={getSelectOptionsForPR(departments)}
                                formValues={{department: selectedDepartment}}
                                onChange={({target: {value}}) => setSelectedDepartment(Number(value))}/>
                    <FormSelect name="employee" className="w-40 " options={getSelectOptionsForPR(employees)}
                                formValues={{employee: selectedEmployee}}
                                onChange={({target: {value}}) => setSelectedEmployee(Number(value))}/>
                    <FormSelect name="cycle" className="w-40 " options={getSelectOptionsForPR(cycles)}
                                formValues={{cycle: selectedCycle}}
                                onChange={({target: {value}}) => setSelectedCycle(Number(value))}/>
                    <button className="bg-primary-pink text-white  rounded-lg w-44 h-10">Save</button>
                </div>
            </div>
            <div className="flex-col overflow-y-auto">
                <div className="p-4 rounded-md">
                    <div className="bg-white p-4 rounded-md mb-5 h-40">
                        <div className="flex space-x-8 mt-3">
                            <StatusCount count="4" label="Achieved" variant="default" />
                            <StatusCount count="2" label="Partially Achieved " variant="success" />
                            <StatusCount count="1" label="Not Achieved" variant="danger" />
                        </div>
                    </div>
                    {reviewItems.length ? (
                        <table className="min-w-full rounded-md border-collapse bg-white">
                            <thead>
                            <tr className="h-16 text-secondary-grey">
                                <th className="px-4 py-2 text-left w-44">KPI</th>
                                <th className="px-4 py-2 text-left w-44">Target</th>
                                <th className="px-4 py-2 text-center w-44">Scores</th>
                                <th className="px-4 py-2 text-center w-44">Feedback</th>
                                <th className="px-4 py-2 text-center w-44">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {reviewItems.map((row) => (
                                <tr key={row?.kpiID} className="border-b hover:bg-slate-100">
                                    <td className="px-4 py-2">{row?.kpiName || ''}</td>
                                    <td className="px-4 py-2">{row?.targetMetrics || ''}</td>
                                    <td className="px-4 py-2 w-44">
                                        <FormInput
                                            type="text"
                                            name="scores"
                                            formValues={{scores: ''}}
                                            // onChange={({target: {name, value}}) => handleFormChange(name, value, true)}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <FormTextArea
                                            name="note"
                                            formValues={{ note: row.notes }}
                                            disabled={isUpdating}
                                            value={row.notes}
                                            className="px-4 py-2 w-54 h-10 border"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <FormSelect
                                            name="testField"
                                            formValues={{ testField: "Achieved" }}
                                            options={[
                                                { label: "Achieved", value: "achieved" },
                                                { label: "Partially Achieved", value: "partially_achieved" },
                                                { label: "Not Achieved", value: "not_achieved" },
                                            ]}
                                            onChange={(e) => console.log(e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (<></>)}
                </div>
            </div>
        </div>
    );
};

export default PerformanceContentPage;
