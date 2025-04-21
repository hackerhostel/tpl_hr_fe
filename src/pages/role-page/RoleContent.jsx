import React, {useEffect, useRef, useState} from "react";
import FormInput from "../../components/FormInput";
import WYSIWYGInput from "../../components/WYSIWYGInput";
import {CheckBadgeIcon, PlusCircleIcon, TrashIcon, XMarkIcon} from "@heroicons/react/24/outline";
import DataGrid, {Column, Paging, Scrolling, Sorting} from "devextreme-react/data-grid";
import "./custom-styles.css";
import {doGetRoles, selectSelectedRole} from "../../state/slice/roleSlice.js";
import {useDispatch, useSelector} from "react-redux";
import axios from 'axios';
import {useToasts} from "react-toast-notifications";

const RoleContent = () => {
    const selectedRole = useSelector(selectSelectedRole)
    const {addToast} = useToasts();
    const dispatch = useDispatch();

    const [role, setRole] = useState({});
    const [formValues, setFormValues] = useState({
        title: '',
        description: '',
        responsibilities: ''
    });
    const [description, setDescription] = useState('');
    const [responsibilities, setResponsibilities] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // KPIs State
    const [filteredKPIs, setFilteredKPIs] = useState([]);
    const [filteredCompetencies, setFilteredCompetencies] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editRowId, setEditRowId] = useState(null);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const menuRefs = useRef(new Map());
    const [newRow, setNewRow] = useState(null);

    // Dummy KPI Data
    const dummyKPIs = [
        {
            id: 1,
            name: "Revenue Growth",
            description: "Measure revenue increase",
            formula: "(Current Revenue - Past Revenue) / Past Revenue",
            evaluationCriteria: "Above 10% is good",
            targetMetrics: "15%"
        },
        {
            id: 2,
            name: "Customer Retention",
            description: "Track returning customers",
            formula: "(Customers at end - New customers) / Customers at start",
            evaluationCriteria: "Above 80% is good",
            targetMetrics: "85%"
        }
    ];

    // Dummy Competencies Data
    const dummyCompetencies = [
        {id: 1, name: "Leadership", description: "Ability to lead teams", proficiencyLevel: "Expert"},
        {
            id: 2,
            name: "Communication",
            description: "Effective verbal and written skills",
            proficiencyLevel: "Advanced"
        },
    ];

    const handleAddNew = (table) => {
        setNewRow({
            table,
            data: {
                id: Date.now(),
                name: "",
                description: "",
                proficiencyLevel: table === "Competencies" ? "" : undefined,
                formula: table === "KPIs" ? "" : undefined,
                evaluationCriteria: table === "KPIs" ? "" : undefined,
                targetMetrics: table === "KPIs" ? "" : undefined,
            },
        });
    };

    const handleEditChange = (e, field) => {
        if (newRow) {
            setNewRow({
                ...newRow,
                data: {...newRow.data, [field]: e.target.value},
            });
        }
    };

    const handleSaveNew = () => {
        if (!newRow?.data.name) return;
        if (newRow.table === "KPIs") {
            setFilteredKPIs([...filteredKPIs, newRow.data]);
        } else {
            setFilteredCompetencies([...filteredCompetencies, newRow.data]);
        }
        setNewRow(null);
    };

    const handleCancelNew = () => {
        setNewRow(null);
    };

    const handleDelete = (id, table) => {
        if (table === "KPIs") {
            setFilteredKPIs(filteredKPIs.filter(kpi => kpi.id !== id));
        } else {
            setFilteredCompetencies(filteredCompetencies.filter(comp => comp.id !== id));
        }
    };

    useEffect(() => {
        setFilteredKPIs(dummyKPIs);
        setFilteredCompetencies(dummyCompetencies);

        const handleClickOutside = (event) => {
            if (![...menuRefs.current.values()].some((ref) => ref?.contains(event.target))) {
                setMenuOpenId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleEdit = (id) => {
        setEditRowId(id);
        setMenuOpenId(null);
    };

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
                <div className="bg-white">
                    <div className="flex items-center justify-between p-4">
                        <p className="text-secondary-grey text-lg font-medium">KPIs ({filteredKPIs.length})</p>
                        <button className="flex items-center space-x-2 text-text-color cursor-pointer"
                                onClick={() => handleAddNew("KPIs")}>
                            <PlusCircleIcon className="w-5 text-text-color"/>
                            <span>Add New</span>
                        </button>
                    </div>

                    <DataGrid dataSource={[...filteredKPIs, ...(newRow?.table === "KPIs" ? [newRow.data] : [])]}
                              allowColumnReordering showBorders={false} width="100%"
                              className="rounded-lg overflow-hidden">
                        <Scrolling columnRenderingMode="virtual"/>
                        <Sorting mode="multiple"/>
                        <Paging enabled pageSize={4}/>

                        {["name", "description", "formula", "evaluationCriteria", "targetMetrics"].map((field) => (
                            <Column key={field} dataField={field}
                                    caption={field.charAt(0).toUpperCase() + field.slice(1)}
                                    width={200}
                                    cellRender={(data) => newRow?.data.id === data.data.id ?
                                        <FormInput type="text" name={field} value={newRow.data[field]}
                                                   onChange={(e) => handleEditChange(e, field)}/>
                                        : data.value}
                            />
                        ))}

                        <Column caption="Actions" width={100} cellRender={(data) => (
                            newRow?.data.id === data.data.id ? (
                                <div className="flex space-x-2">
                                    <button onClick={handleSaveNew}><CheckBadgeIcon
                                        className="w-5 h-5 text-green-500"/>
                                    </button>
                                    <button onClick={handleCancelNew}><XMarkIcon className="w-5 h-5 text-red-500"/>
                                    </button>
                                </div>
                            ) : (
                                <button className="p-2 text-text-color cursor-pointer"
                                        onClick={() => handleDelete(data.data.id, "KPIs")}>
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            )
                        )}/>
                    </DataGrid>
                </div>

                {/* Competencies Table */}
                <div className="bg-white">
                    <div className="flex items-center justify-between p-4">
                        <p className="text-secondary-grey text-lg font-medium">Competencies
                            ({filteredCompetencies.length})</p>
                        <button className="flex items-center space-x-2 text-text-color cursor-pointer"
                                onClick={() => handleAddNew("Competencies")}>
                            <PlusCircleIcon className="w-5 text-text-color"/>
                            <span>Add New</span>
                        </button>
                    </div>

                    <DataGrid
                        dataSource={[...filteredCompetencies, ...(newRow?.table === "Competencies" ? [newRow.data] : [])]}
                        allowColumnReordering showBorders={false} width="100%"
                        className="rounded-lg overflow-hidden">
                        <Scrolling columnRenderingMode="virtual"/>
                        <Sorting mode="multiple"/>
                        <Paging enabled pageSize={4}/>

                        {["name", "description", "proficiencyLevel"].map((field) => (
                            <Column key={field} dataField={field}
                                    caption={field.charAt(0).toUpperCase() + field.slice(1)}
                                    width={330}
                                    cellRender={(data) => newRow?.data.id === data.data.id ?
                                        <FormInput type="text" name={field} value={newRow.data[field]}
                                                   onChange={(e) => handleEditChange(e, field)}/>
                                        : data.value}
                            />
                        ))}

                        <Column caption="Actions" width={100} cellRender={(data) => (
                            newRow?.data.id === data.data.id ? (
                                <div className="flex space-x-2">
                                    <button onClick={handleSaveNew}><CheckIcon className="w-5 h-5 text-green-500"/>
                                    </button>
                                    <button onClick={handleCancelNew}><XMarkIcon className="w-5 h-5 text-red-500"/>
                                    </button>
                                </div>
                            ) : (
                                <button className="p-2 text-text-color cursor-pointer"
                                        onClick={() => handleDelete(data.data.id, "Competencies")}>
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            )
                        )}/>
                    </DataGrid>
                </div>
            </div>
        ) : (
            <div style={{width: "99%"}} className="flex flex-col space-y-8 bg-slate-100 text-center p-10 ">
                <p>No role selected. Please choose one from the list.</p>
            </div>
        )

    );
};

export default RoleContent;
