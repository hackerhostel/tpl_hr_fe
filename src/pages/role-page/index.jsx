import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import RoleContent from "./RoleContent.jsx";
import CreateNewRole from '../../components/popupForms/createNewRole.jsx';
import {useState} from "react";
import RoleListPage from "./RoleListPage.jsx";

const RoleLayout = () => {
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
    <CreateNewRole onClose={handleClose} isOpen={isOpen}/>
    </>


  );
}

export default RoleLayout;