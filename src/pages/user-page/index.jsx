import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import UserListPage from "./UserListPage.jsx";
import UserContent from "./UserContent.jsx";

const EmployeeLayout = () => {
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

export default EmployeeLayout;