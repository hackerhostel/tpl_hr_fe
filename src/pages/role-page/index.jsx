import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import RoleContent from "./RoleContent.jsx";
import CreateNewProjectPopup from '../../components/popupForms/createNewRole.jsx';
import {useState} from "react";
import RoleListPage from "./RoleListPage.jsx";

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
        title="Roles"
        leftColumn={<RoleListPage/>}
        rightColumn={<RoleContent/>}
      subText = {"Add New"}
      onAction = {onAddNew}
    />
    <CreateNewProjectPopup onClose={handleClose} isOpen={isOpen}/>
    </>


  );
}

export default ProjectLayout;