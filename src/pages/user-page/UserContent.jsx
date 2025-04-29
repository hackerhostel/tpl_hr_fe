import React, {useEffect, useState} from 'react';
import Goal from "../../components/user-tables/Goal"
import Certification from "../../components/user-tables/Certification"
import FeedBackCard from "../../components/user-tables/FeedbackCard"
import Competencies from "../../components/user-tables/RoleCompetencies.jsx"
import RoleKPIs from "../../components/user-tables/RoleKPIs.jsx"
import {useDispatch, useSelector} from "react-redux";
import {clickedUser} from "../../state/slice/projectUsersSlice.js";
import {doGetFormData, selectFeedBackTypes} from "../../state/slice/masterDataSlice.js";
import useFetchEmployee from "../../hooks/custom-hooks/employee/useFetchEmployee.jsx";
import {selectAppConfig} from "../../state/slice/appSlice.js";

const UserContent = () => {
    const dispatch = useDispatch();
    const appConfig = useSelector(selectAppConfig)
    const selectedUserData = useSelector(clickedUser);
    const feedbackTypes = useSelector(selectFeedBackTypes);

    const [selectedUser, setSelectedUser] = useState([]);
    const [kpis, setKPIs] = useState([]);
    const [competencies, setCompetencies] = useState([]);
    const [goals, setGoals] = useState([]);

    const {data: employeeResponse, refetch: reFetchEmployee} = useFetchEmployee(selectedUser?.id ? selectedUser?.id : 0)

    useEffect(() => {
        if (selectedUserData?.id){
            setSelectedUser(selectedUserData)
        }
    }, [selectedUserData]);

    useEffect(() => {
      if (!feedbackTypes || !feedbackTypes.length){
          dispatch(doGetFormData())
      }
    }, [feedbackTypes]);

    useEffect(() => {
        console.log(employeeResponse)
        if (employeeResponse?.kpi && employeeResponse?.kpi.length) {
            setKPIs(employeeResponse?.kpi)
        }else{
            setKPIs([])
        }
        if (employeeResponse?.compliance && employeeResponse?.compliance.length) {
            setCompetencies(employeeResponse?.compliance)
        }else{
            setCompetencies([])
        }
        if (employeeResponse?.goals && employeeResponse?.goals.length) {
            setGoals(employeeResponse?.goals)
        } else {
            setGoals([])
        }
    }, [employeeResponse]);


    return (
        <div className='bg-slate-100 flex flex-col'>
            <div className='flex p-5 space-x-3'>
                <div className='w-96'>
                    <FeedBackCard feedbackTypes={feedbackTypes}/>
                </div>
                <div className='w-96'>
                    <RoleKPIs kpis={kpis} />
                </div>
                <div className='w-96'>
                    <Competencies competencies={competencies} proficiencyLevels={appConfig?.proficiencyLevels}/>
                </div>
            </div>

            <div className='p-5'>
                <div className=''>
                    <Goal selectedUser={selectedUser} goals={goals} reFetchEmployee={reFetchEmployee}/>
                </div>
                <div className='mt-2'>
                    <Certification/>
                </div>
            </div>
        </div>
    )
}

export default UserContent;