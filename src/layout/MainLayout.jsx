import { Outlet } from "react-router-dom";


const MainLayout = () => {
    return (
        <div>
            
            <div className="">
                <Outlet />
            </div>
            
        </div>
    );
};

export default MainLayout;