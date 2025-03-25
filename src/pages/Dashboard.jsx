import {Redirect, Route, Switch} from "react-router-dom";
import Header from "../components/navigation/Header.jsx";
import ProjectLayout from "./project-page/index.jsx";
import UserLayout from "./user-page/index.jsx";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {doGetWhoAmI, selectInitialUserDataError, selectInitialUserDataLoading} from "../state/slice/authSlice.js";
import LoadingPage from "./LoadingPage.jsx";
import ServiceDownPage from "./ServiceDownPage.jsx";
import TestPlanLayout from "./test-plan-page/TestSuiteContentPage.jsx";
import DashboardLayout from "./dashboard-page/index.jsx";
import {doGetProjectBreakdown, selectSelectedProject} from "../state/slice/projectSlice.js";
import {isNotEmptyObj} from "../utils/commonUtils.js";
import {doGetMasterData, selectInitialDataError, selectInitialDataLoading} from "../state/slice/appSlice.js";

const Dashboard = () => {
  const isInitialAppDataError = useSelector(selectInitialDataError);
  const isInitialAppDataLoading = useSelector(selectInitialDataLoading);
  const isInitialUserDataError = useSelector(selectInitialUserDataError);
  const isInitialUserDataLoading = useSelector(selectInitialUserDataLoading);
  const selectedProject = useSelector(selectSelectedProject);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(doGetWhoAmI())
    dispatch(doGetMasterData())
  }, []);

  useEffect(() => {
    if(isNotEmptyObj(selectedProject)) {
      dispatch(doGetProjectBreakdown())
    }
  }, [selectedProject])

  if (isInitialUserDataLoading || isInitialAppDataLoading) return <LoadingPage />;
  if (isInitialUserDataError || isInitialAppDataError) return <ServiceDownPage />;

  return (
    <div  className="flex h-screen">
      <div className="bg-white overflow-hidden flex flex-col w-full">
        <Header/>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <Switch>
            <Route path="/dashboard">
              <DashboardLayout />
            </Route>

            <Route path="/projects">
              <ProjectLayout/>
            </Route>

            <Route path="/profile">
              <UserLayout />
            </Route>

            <Route path="/test-plans/:test_plan_id">
              <TestPlanLayout/>
            </Route>

            <Route path="/test-plans">
              <TestPlanLayout/>
            </Route>


            <Route exact path="/">
              <Redirect
                to={{
                  pathname: '/dashboard',
                }}
              />
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  )
}

export default Dashboard;