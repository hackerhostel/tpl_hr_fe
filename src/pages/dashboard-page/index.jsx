import React from "react";
import MainPageLayout from "../../layouts/MainPageLayout";
import DashboardListPage from "../dashboard-page/dashboardListPage";
import DashboardContentPage from "../dashboard-page/dashboardContentPage";

const DashboardLayout = () => {
  return (
    <MainPageLayout
      title="Dashboard"
      leftColumn={<DashboardListPage />}
      rightColumn={<DashboardContentPage />}
    />
  );
};

export default DashboardLayout;
