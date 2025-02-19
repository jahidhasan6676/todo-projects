import { Link } from "react-router-dom";


const Navbar = () => {
    return (
        <div className="w-11/12 mx-auto">
            <nav className="flex justify-center gap-4">
                <h2>TODO</h2>
                <Link>Home</Link>
            </nav>
        </div>
    );
};

export default Navbar;