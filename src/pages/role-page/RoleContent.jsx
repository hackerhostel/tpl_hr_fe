import React, {useEffect, useRef, useState} from "react";
import FormInput from "../../components/FormInput";
import WYSIWYGInput from "../../components/WYSIWYGInput";
import "./custom-styles.css";
import {doGetRoles, selectSelectedRole} from "../../state/slice/roleSlice.js";
import {useDispatch, useSelector} from "react-redux";
import axios from 'axios';
import {useToasts} from "react-toast-notifications";
import KPISection from "./KPISection.jsx";
import useFetchRole from "../../hooks/custom-hooks/role/useFetchRole.jsx";
import CompetencySection from "./CompetencySection.jsx";
import {selectAppConfig} from "../../state/slice/appSlice.js";

const RoleContent = () => {
    const selectedRole = useSelector(selectSelectedRole)
    const appConfig = useSelector(selectAppConfig)
    const {addToast} = useToasts();
    const dispatch = useDispatch();

    const [role, setRole] = useState({});
    const [description, setDescription] = useState('');
    const [responsibilities, setResponsibilities] = useState('');
    const [kpis, setKPIs] = useState([]);
    const [competencies, setCompetencies] = useState([]);
    const [proficiencyLevels, setProficiencyLevels] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        data: roleResponse,
        refetch: reFetchRole
    } = useFetchRole(role?.id ? role?.id : 0)

    const [formValues, setFormValues] = useState({
        title: '',
        description: '',
        responsibilities: ''
    });

    useEffect(() => {
        if (roleResponse?.kpi && roleResponse?.kpi.length) {
            setKPIs(roleResponse?.kpi)
        }
        if (roleResponse?.competencies && roleResponse?.competencies.length) {
            setCompetencies(roleResponse?.competencies)
        }
    }, [roleResponse]);

    useEffect(() => {
        if (appConfig?.proficiencyLevels && appConfig?.proficiencyLevels.length) {
            setProficiencyLevels(appConfig?.proficiencyLevels)
        }
    }, [appConfig]);

    useEffect(() => {
        if (selectedRole?.id) {
            setRole(selectedRole)
            setFormValues({
                title: selectedRole?.title,
                description: selectedRole?.description,
                responsibilities: selectedRole?.responsibilities
            })
            setDescription(selectedRole?.description)
            setResponsibilities(selectedRole?.responsibilities)
        }
    }, [selectedRole]);

    const updateRole = async (event) => {
        setIsSubmitting(true)
        event.preventDefault();
        try {
            formValues.description = description
            formValues.responsibilities = responsibilities
            const response = await axios.put(`/designations/${role?.id}`, {designation: formValues})
            const updated = response?.status

            if (updated) {
                addToast('Role Successfully Updated', {appearance: 'success'});
                dispatch(doGetRoles());
            } else {
                addToast('Failed To Update The Role', {appearance: 'error'});
            }
        } catch (error) {
            console.log(error)
            addToast('Failed To Update The Role', {appearance: 'error'});
        }
        setIsSubmitting(false)
    }

    const handleFormChange = (name, value, isText) => {
        setFormValues({...formValues, [name]: isText ? value : Number(value)});
    };

    const handleWYSIWYG = (name, value) => {
        if (name === 'description') {
            setDescription(value)
        } else {
            setResponsibilities(value)
        }
    };

    return (
        role?.id ? (
            <div style={{width: "99%"}} className="p-2 flex flex-col space-y-8 bg-slate-100">
                <form className="p-2 flex flex-col space-y-8" onSubmit={updateRole}>
                    <div>
                        <FormInput
                            placeholder="Title"
                            type="text"
                            name="title"
                            formValues={formValues}
                            onChange={({target: {name, value}}) => handleFormChange(name, value, true)}
                        />
                    </div>

                    <div>
                        <label className="text-text-color" htmlFor="">Description</label>
                        <div className="border border-gray-300 bg-white rounded-md mt-4 p-2">
                            <WYSIWYGInput initialValue={role?.description}
                                          value={description}
                                          name={"description"} onchange={handleWYSIWYG}/>
                        </div>
                    </div>

                    <div>
                        <label className="text-text-color" htmlFor="">Responsibilities</label>
                        <div className="border border-gray-300 rounded-md bg-white mt-4 p-2">
                            <WYSIWYGInput initialValue={role?.responsibilities}
                                          value={responsibilities}
                                          name={"responsibilities"} onchange={handleWYSIWYG}/>
                        </div>
                    </div>
                    <button type="submit"
                            className="px-8 py-2 mt-2 bg-primary-pink text-white rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed w-40 self-end"
                            disabled={isSubmitting}>Update
                    </button>
                </form>

                {/* KPIs Table */}
                <KPISection kpis={kpis} roleId={role?.id} reFetchRole={reFetchRole}/>

                {/* Competencies Table */}
                <CompetencySection competencies={competencies} roleId={role?.id} reFetchRole={reFetchRole}
                                   proficiencyLevels={proficiencyLevels}/>
            </div>
        ) : (
            <div style={{width: "99%"}} className="flex flex-col space-y-8 bg-slate-100 text-center p-10 ">
                <p>No role selected. Please choose one from the list.</p>
            </div>
        )

    );
};

export default RoleContent;
