import { Outlet } from "react-router-dom";
import Navbar from "../shared/navbar/Navbar";

const MainLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className="">
                <Outlet />
            </div>
            
        </div>
    );
};

export default MainLayout;