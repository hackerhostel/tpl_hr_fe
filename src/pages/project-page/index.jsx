import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import ProjectListPage from "./ProjectListPage.jsx";
import ProjectContent from "./ProjectContent.jsx";
import CreateNewProjectPopup from '../../components/popupForms/createNewRole.jsx';
import {useState} from "react";
const ProjectLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onAddNew = () => {
    setIsOpen(true)
  };

  const handleClose = () => {
    setIsOpen(false);
  }

  return (
    <>
    <MainPageLayout
      title="All Projects"
      leftColumn={<ProjectListPage />}
      rightColumn={<ProjectContent/>}
      subText = {"Add New"}
      onAction = {onAddNew}
    />
    <CreateNewProjectPopup onClose={handleClose} isOpen={isOpen}/>
    </>
    
    
  );
}

export default ProjectLayout;