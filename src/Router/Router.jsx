import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import PrivateRoute from "./PrivateRoute";


export const router = createBrowserRouter([
    {
        path:"/",
        element:<PrivateRoute><MainLayout></MainLayout></PrivateRoute>,
        children:[
            {
                path:"/",
                element:<Home></Home>
            }
        ]
    },
    {
        path:"/login",
        element:<Login></Login>
    }
])