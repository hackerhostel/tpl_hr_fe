import React, {useEffect, useState} from 'react';
import { PencilIcon } from '@heroicons/react/24/outline/index.js';
import FormInput from '../../components/FormInput.jsx';
import axios from "axios";
import {useToasts} from "react-toast-notifications";
import {getSelectOptions} from "../../utils/commonUtils.js";
import FormSelect from "../../components/FormSelect.jsx";
import {useDispatch, useSelector} from "react-redux";
import {clickedUser, doGetProjectUsers} from "../../state/slice/projectUsersSlice.js";
import {selectSelectedProject} from "../../state/slice/projectSlice.js";
import {doGetOrganizationUsers, selectAppConfig} from "../../state/slice/appSlice.js";

const UserContentPage = () => {

    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [formErrors, setFormErrors] = useState({});
    const [isEditable, setIsEditable] = useState(false);
    const [roles, setRoles] = useState([]);
    const selectedUser = useSelector(clickedUser);
    const selectedProject = useSelector(selectSelectedProject);
    const appConfig = useSelector(selectAppConfig);
    
    // const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleEditable = () => {
        setIsEditable(!isEditable)
    };

    useEffect(() => {
        async function fetchRoles(){
            try {
                const response = await axios.get('/organizations/form-data');
                const roles = response?.data.body;

                return Object.values(roles).map(role => role);
            } catch (error) {
                addToast(error.message || 'Failed to fetch user roles', { appearance: "error" });
            }
        }

        fetchRoles().then(r => setRoles(r));
    }, []);

    const timeData = {
        Today: 4,
        Yesterday: 8,
        Week: 40,
        Month: 150
    };

    const [formValues, setFormValues] = useState({
        email: selectedUser?.email,
        contactNumber: selectedUser?.contactNumber,
        teamID: selectedUser?.teamID,
        userRole: selectedUser?.userRole,
    });
    
    useEffect(() => {
      setFormValues({...formValues, ...selectedUser});
    }, [selectedUser]);

    const updateUser = () => {
        if (selectedUser) {
            axios.put(`/users/${selectedUser.id}`, {...formValues})
                .then(() => {
                    addToast('User Successfully Updated', {appearance: 'success'});
                    dispatch(doGetOrganizationUsers());
                }).catch(() => {
                addToast('User update request failed ', {appearance: 'error'});
            });
        }
    };

    const taskCounts = {
        all: 22,
        tasks: 10,
        bugs: 12
    };

    const estimationDeviations = [
        { id: '10001', summary: 'hjhdasdjhajsd', estimation: '10 hrs', actual: '8 hrs', deviation: '+4 hrs' },
        { id: '10001', summary: 'hjhdasdjhajsd', estimation: '10 hrs', actual: '12 hrs', deviation: '- 2 hrs' }
    ];

    const scheduleDeviations = [
        { id: '10001', summary: 'hjhdasdjhajsd', estimation: '05.10.2024', actual: '06.10.2024', deviation: '- 1d' },
        { id: '10001', summary: 'hjhdasdjhajsd', estimation: '05.10.2024', actual: '02.10.2024', deviation: '+ 3d' }
    ];

    const producedBugs = [
        { id: '10001', summary: 'hjhdasdjhajsd', estimation: 'High', actual: 'Done', deviation: '+ 4 hrs' },
        { id: '10001', summary: 'hjhdasdjhajsd', estimation: 'Low', actual: 'Ongoing', deviation: '- 2 hrs' }
    ];

    const  InputChange = (e, value) => {
        const { name } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const DeviationTable = ({ headers, data }) => (
        <table className="w-full">
            <thead className="text-left text-sm text-gray-500">
                <tr>
                    {headers.map(header => (
                        <th key={header} className="pb-3">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="text-sm">
                {data.map((row, idx) => (
                    <tr key={idx} className="border-t">
                        <td className="py-3">{row.id}</td>
                        <td className="py-3">{row.summary}</td>
                        <td className="py-3">{row.estimation}</td>
                        <td className="py-3">{row.actual}</td>
                        <td className="py-3">
                            <span className={`${row.deviation.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {row.deviation}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="p-6 bg-dashboard-bgc min-h-screen">
            <div className="flex flex-wrap gap-6 pb-6">
                {/* Left Sidebar */}
                <div className="w-72 bg-white mt-16 rounded-lg p-6 h-fit">
                    <div className='flex justify-end'>
                        <PencilIcon onClick={toggleEditable} className='w-4  text-secondary-grey cursor-pointer' />
                    </div>
                    <div className="flex flex-col items-center">
                        {selectedUser?.avatar ? (
                            <img
                                src={selectedUser.avatar}
                                alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div
                                className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold inline-block">
                                {selectedUser?.firstName?.[0]}
                                {selectedUser?.lastName?.[0]}
                            </div>
                        )}
                        <span className="text-xl font-semibold mt-5  text-secondary-grey mb-1">{selectedUser?.firstName} {selectedUser?.lastName}</span>
                        <div className='bg-task-status-qa px-2 mt-1 rounded-md'>
                            <span className="text-xs">Admin</span>
                        </div>
                        <hr className="w-full mt-6 border-t  border-gray-200" />
                        <div className="w-full space-y-4 mt-6">
                            <div className="w-full space-y-4 mt-6">
                                <FormInput
                                    name="email"
                                    formValues={formValues}
                                    placeholder="Email"
                                    onChange={handleInputChange}
                                    className={`w-full p-2 border rounded-md ${
                                        isEditable
                                          ? "bg-white text-secondary-grey border-border-color"
                                          : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                                      }`}
                                    disabled={!isEditable}
                                    formErrors={formErrors}
                                    showErrors={true}
                                    showLabel={true}
                                />

                                <FormInput
                                    name="contactNumber"
                                    formValues={formValues}
                                    placeholder="Contact Number"
                                    onChange={handleInputChange}
                                    className={`w-full p-2 border rounded-md ${
                                        isEditable
                                          ? "bg-white text-secondary-grey border-border-color"
                                          : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                                      }`}
                                    disabled={!isEditable}
                                    formErrors={formErrors}
                                    showErrors={true}
                                    showLabel={true}
                                />

                                {/*<FormSelect*/}
                                {/*    name="teamID"*/}
                                {/*    formValues={formValues}*/}
                                {/*    options={getSelectOptions(appConfig.teams)}*/}
                                {/*    placeholder="Roles"*/}
                                {/*    onChange={handleInputChange}*/}
                                {/*    className={`w-full p-2 border rounded-md ${*/}
                                {/*        isEditable*/}
                                {/*            ? "bg-white text-secondary-grey border-border-color"*/}
                                {/*            : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"*/}
                                {/*    }`}*/}
                                {/*    disabled={!isEditable}*/}
                                {/*    formErrors={formErrors}*/}
                                {/*    showErrors={true}*/}
                                {/*    showLabel={true}*/}
                                {/*/>*/}
                                <FormSelect
                                    name="userRole"
                                    formValues={formValues}
                                    options={getSelectOptions(roles)}
                                    placeholder="Roles"
                                    onChange={handleInputChange}
                                    className={`w-full p-2 border rounded-md ${
                                        isEditable
                                            ? "bg-white text-secondary-grey border-border-color"
                                            : "bg-user-detail-box text-secondary-grey border-border-color cursor-not-allowed"
                                    }`}
                                    disabled={!isEditable}
                                    formErrors={formErrors}
                                    showErrors={true}
                                    showLabel={true}
                                />
                            </div>
                            <button
                                // disabled={isSubmitting}
                                onClick={updateUser}
                                type="submit"
                                className="px-4 py-2 bg-primary-pink w-full text-white rounded-md"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>

                {/* Time log Section */}
                {/* <div className="flex-1 bg-white rounded-lg p-6">
                    <h6 className="font-semibold mb-3">Time logs</h6>
                    <div className="flex gap-4 mb-6">
                        {Object.entries(timeData).map(([period, hours]) => (
                            <div key={period} className="flex-1">
                                <div className="bg-pink-500 text-white p-2 rounded-t-lg text-center">
                                    {period}
                                </div>
                                <div className="border border-t-0 rounded-b-lg p-3 text-center">
                                    <span className="text-xl font-semibold">{hours}</span>
                                    <span className="text-gray-500">hrs</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <table className="w-full">
                        <thead className="text-left text-sm text-gray-500">
                        <tr>
                            <th className="pb-3">Task ID</th>
                            <th className="pb-3">Task Summary</th>
                            <th className="pb-3">Time Speed</th>
                            <th className="pb-3">Date</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm">
                        {[1, 2, 3, 4].map((_, i) => (
                            <tr key={i} className="border-t">
                                <td className="py-3">10001</td>
                                <td className="py-3">hjhtasdhjsad</td>
                                <td className="py-3">4hrs</td>
                                <td className="py-3">05.10.2024</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div> */}

                {/* Tasks Section */}
                {/* <div className="flex-1 bg-white rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h6 className="font-semibold">Tasks</h6>
                        <div className="flex gap-4">
                            {Object.entries(taskCounts).map(([type, count]) => (
                                <div key={type} className="text-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold
                    ${type === 'all' ? 'bg-pink-100 text-pink-500' :
                                        type === 'tasks' ? 'bg-green-100 text-green-500' :
                                            'bg-red-100 text-red-500'}`}>
                                        {count}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 capitalize">{type}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between mb-4">
                        <select className="px-4 py-2 border rounded-lg text-sm">
                            <option>Priority</option>
                        </select>
                        <select className="px-4 py-2 border rounded-lg text-sm">
                            <option>Status</option>
                        </select>
                    </div>

                    <table className="w-full">
                        <thead className="text-left text-sm text-gray-500">
                        <tr>
                            <th className="pb-3">Task ID</th>
                            <th className="pb-3">Task Summary</th>
                            <th className="pb-3">Priority</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Due Date</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm">
                        <tr className="border-t">
                            <td className="py-3">10001</td>
                            <td className="py-3">hjhtasdhjsad</td>
                            <td className="py-3">High</td>
                            <td className="py-3">Done</td>
                            <td className="py-3">05.10.2024</td>
                        </tr>
                        </tbody>
                    </table>
                </div> */}
            </div>

            <div className="flex gap-6 pb-6">
                {/* Estimation Deviations */}
                {/* <div className="flex-1 bg-white rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h6 className="font-semibold">Estimation Deviations</h6>
                        <span className="text-gray-600">+14 hrs</span>
                    </div>
                    <DeviationTable
                        headers={['Task ID', 'Task Summary', 'Estimation', 'Actual', 'Deviation']}
                        data={estimationDeviations}
                    />
                </div> */}

                {/* Schedule Deviations */}
                {/* <div className="flex-1 bg-white rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h6 className="font-semibold">Schedule Deviations</h6>
                        <span className="text-gray-600">+4d</span>
                    </div>
                    <DeviationTable
                        headers={['Task ID', 'Task Summary', 'Estimation', 'Actual', 'Deviation']}
                        data={scheduleDeviations}
                    />
                </div> */}
            </div>

            {/* Produced Bugs */}
            {/* <div className="flex gap-6">
                <div className="flex-1 bg-white rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h6 className="font-semibold">Produced Bugs</h6>
                        <span className="text-gray-600">14 hrs</span>
                    </div>
                    <DeviationTable
                        headers={['Task ID', 'Task Summary', 'Estimation', 'Actual', 'Deviation']}
                        data={producedBugs}
                    />
                </div>
            </div> */}
        </div>
    );
};

export default UserContentPage;