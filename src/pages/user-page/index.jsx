import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import UserListPage from "./UserListPage.jsx";
import UserContent from "./UserContent.jsx";
import { PlusCircleIcon } from "@heroicons/react/24/outline/index.js";

const UserLayout = () => {
  return (
    <MainPageLayout
      title={
        <div style={{ display: 'flex', gap: '96px', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Users</span>
      </div>
      }
      leftColumn={<UserListPage />}
      rightColumn={<UserContent />}
    />
  );
}

export default UserLayout;