import React from 'react';
import {useSelector} from "react-redux";
import {selectSelectedProject} from "../../state/slice/projectSlice.js";
import CustomFieldsListPage from "./CustomFieldsListPage.jsx";
import ScreenListPage from "./ScreenListPage.jsx";
import TaskTypeListPage from "./TaskTypeListPage.jsx";

const SettingPage = () => {
    const selectedProject = useSelector(selectSelectedProject);

    return (
        <div className="h-list-screen overflow-y-auto w-full">
            <CustomFieldsListPage/>
            <ScreenListPage selectedProject={selectedProject}/>
            <TaskTypeListPage selectedProject={selectedProject}/>
        </div>
    );
};

export default SettingPage;