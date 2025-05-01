import React, {useEffect, useState} from "react";
import FormSelect from "../../components/FormSelect.jsx";
import FormTextArea from "../../components/FormTextArea.jsx";
import FormInput from "../../components/FormInput.jsx"
import {getSelectOptions, getSelectOptionsForPR} from "../../utils/commonUtils.js";
import useFetchPerformanceReviewFormData
    from "../../hooks/custom-hooks/performance/useFetchPerformanceReviewFormData.jsx";
import useFetchPerformanceReviews from "../../hooks/custom-hooks/performance/useFetchPerformanceReviews.jsx";
import {useToasts} from "react-toast-notifications";
import axios from "axios";

const PerformanceContentPage = () => {
    const {addToast} = useToasts();
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(0);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(0);
    const [cycles, setCycles] = useState([]);
    const [selectedCycle, setSelectedCycle] = useState(0);
    const [reviewCycle, setReviewCycle] = useState({})
    const [reviewItems, setReviewItems] = useState([])
    const [achievementCount, setAchievementCount] = useState({})

    const {data: formData} = useFetchPerformanceReviewFormData()
    const {
        data: reviewData,
        refetch: reFetchPerformanceReviews
    } = useFetchPerformanceReviews(selectedEmployee, selectedCycle)

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
            setReviewCycle({})
            setReviewItems([])
            setAchievementCount({})
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
                const reviewItemsData = reviewCycleData?.reviewItems
                setReviewItems(reviewItemsData)
                let notAchieved = 0;
                let partiallyAchieved = 0;
                let achieved = 0;

                for (const { status } of reviewItemsData) {
                    switch (status) {
                        case 'Achieved':
                            achieved++;
                            break;
                        case 'Partially Achieved':
                            partiallyAchieved++;
                            break;
                        case 'Not Achieved':
                            notAchieved++;
                            break;
                        default:
                            break;
                    }
                }

                setAchievementCount({ notAchieved, partiallyAchieved, achieved });
            }
        }
    }, [reviewData]);

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

    const handleReviewItemsChange = (name, value, kpiID, isText) => {
        const updatedReviewItems = reviewItems.map(item => {
            if (item.kpiID === kpiID) {
                const updatedItem = {...item, [name]: isText ? value : Number(value)};
                return updatedItem;
            }
            return item;
        });

        setReviewItems(updatedReviewItems);
    };

    const handleSaveReviewCycle = async () => {
        if (!reviewCycle?.reviewID) {
            const payload = {
                employeeID: selectedEmployee,
                cycleID: selectedCycle,
                comment: reviewCycle?.comment || 'N/A',
                reviewItems: []
            };

            let fallbackStatus = formData?.kpiStatuses.find(ks => ks.name === 'Not Achieved');

            if (!fallbackStatus && formData?.kpiStatuses.length) {
                fallbackStatus = formData.kpiStatuses[0];
            }

            for (const rItem of reviewItems) {
                payload.reviewItems.push({
                    kpiID: rItem?.kpiID,
                    statusID: rItem?.statusID || fallbackStatus?.id,
                    kpiScore: rItem?.kpiScore && rItem?.kpiScore !== '' ? rItem?.kpiScore : '0',
                    feedback: rItem?.feedback || 'N/A',
                })
            }

            try {
                const response = await axios.post(`performance-reviews`, {review: payload})
                const created = response?.data?.body

                if (created) {
                    addToast('Performance review successfully added', {appearance: 'success'});
                    reFetchPerformanceReviews()
                } else {
                    addToast('Failed to add the performance review', {appearance: 'error'});
                }
            } catch (error) {
                addToast('Failed to add the performance review', {appearance: 'error'});
            }
        } else {
            const payload = {
                employeeID: selectedEmployee,
                cycleID: selectedCycle,
                comment: reviewCycle?.comment || 'N/A',
                reviewItems: []
            };

            let fallbackStatus = formData?.kpiStatuses.find(ks => ks.name === 'Not Achieved');

            if (!fallbackStatus && formData?.kpiStatuses.length) {
                fallbackStatus = formData.kpiStatuses[0];
            }

            for (const rItem of reviewItems) {
                payload.reviewItems.push({
                    itemID: rItem?.reviewItemID,
                    kpiID: rItem?.kpiID,
                    statusID: rItem?.statusID || fallbackStatus?.id,
                    kpiScore: rItem?.kpiScore && rItem?.kpiScore !== '' ? rItem?.kpiScore : '0',
                    feedback: rItem?.feedback || 'N/A',
                })
            }

            try {
                const response = await axios.put(`performance-reviews/${reviewCycle?.reviewID}`, {review: payload})
                const updated = response?.data?.body

                if (updated) {
                    addToast('Performance review successfully updated', {appearance: 'success'});
                    reFetchPerformanceReviews()
                } else {
                    addToast('Failed to update the performance review', {appearance: 'error'});
                }
            } catch (error) {
                addToast('Failed to update the performance review', {appearance: 'error'});
            }
        }
    };

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
                    <button
                        className="bg-primary-pink text-white rounded-lg w-44 h-10 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={reviewItems.length === 0} onClick={handleSaveReviewCycle}>Save
                    </button>
                </div>
            </div>
            <div className="flex-col overflow-y-auto">
                <div className="p-4 rounded-md">
                    <div className="bg-white p-4 rounded-md mb-5 h-40">
                        <div className="flex space-x-8 mt-3">
                            <StatusCount count={achievementCount?.achieved || 0} label="Achieved" variant="success"/>
                            <StatusCount count={achievementCount?.partiallyAchieved || 0} label="Partially Achieved "
                                         variant="warning"/>
                            <StatusCount count={achievementCount?.notAchieved || 0} label="Not Achieved"
                                         variant="danger"/>
                        </div>
                    </div>
                    {reviewItems.length ? (
                        <>
                            <table className="min-w-full rounded-md border-collapse bg-white">
                                <thead>
                                <tr className="h-16 text-secondary-grey">
                                    <th className="px-4 py-2 text-left w-44">KPI</th>
                                    <th className="px-4 py-2 text-left w-24">Target</th>
                                    <th className="px-4 py-2 text-center w-36">Scores</th>
                                    <th className="px-4 py-2 text-center">Feedback</th>
                                    <th className="px-4 py-2 text-center w-48">Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {reviewItems.map((reviewItem) => (
                                    <tr key={reviewItem?.kpiID} className="border-b hover:bg-slate-100">
                                        <td className="px-4 py-2 w-44">{reviewItem?.kpiName || ''}</td>
                                        <td className="px-4 py-2 w-24">{reviewItem?.targetMetrics || ''}</td>
                                        <td className="px-4 py-2 w-36">
                                            <FormInput
                                                type="text"
                                                name="kpiScore"
                                                formValues={{kpiScore: reviewItem?.kpiScore ? reviewItem?.kpiScore : ''}}
                                                onChange={({target: {name, value}}) =>
                                                    handleReviewItemsChange(name, value, reviewItem?.kpiID, true)
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <FormTextArea
                                                name="feedback"
                                                formValues={{feedback: reviewItem?.feedback}}
                                                onChange={({target: {name, value}}) =>
                                                    handleReviewItemsChange(name, value, reviewItem?.kpiID, true)
                                                }
                                                className="px-4 py-2 h-10 border w-full rounded-md"
                                            />
                                        </td>
                                        <td className="px-4 py-2 w-48">
                                            <FormSelect
                                                name="statusID"
                                                formValues={{statusID: reviewItem?.statusID}}
                                                options={formData?.kpiStatuses ? getSelectOptions(formData?.kpiStatuses) : []}
                                                onChange={({target: {name, value}}) =>
                                                    handleReviewItemsChange(name, value, reviewItem?.kpiID, false)
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div className="p-4 rounded-md mt-2">
                                <p className="text-text-color font-bold align-left">Actions</p>
                                <FormTextArea
                                    name="comment"
                                    rows={6}
                                    formValues={{comment: reviewCycle?.comment}}
                                    onChange={({target: {name, value}}) =>
                                        setReviewCycle({...reviewCycle, [name]: value})
                                    }
                                    className="px-4 py-2 border w-full rounded-md mt-2"
                                />
                            </div>
                        </>
                    ) : (<></>)}
                </div>
            </div>
        </div>
    );
};

export default PerformanceContentPage;
