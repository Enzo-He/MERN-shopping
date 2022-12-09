import { Outlet, Navigate } from "react-router-dom";
import UserChatComponent from "./user/UserChatComponent";

// check if user logged in or not. 
const ProtectedRoutesComponent = ({ admin }) => {
  if (admin) {
    let adminAuth = true;
    // Outlet指的是App.js里面，被ProtectedRoutesComponent包裹的所有route
    //如果logged in, 就转去要去的page，如果没有就转去login page
    return adminAuth ? <Outlet /> : <Navigate to="/login" />;
  } else {
    let userAuth = true;
    return userAuth ? (
      <>
        <UserChatComponent /> <Outlet />
      </>
    ) : (
      <Navigate to="/login" />
    );
  }
};

export default ProtectedRoutesComponent;

