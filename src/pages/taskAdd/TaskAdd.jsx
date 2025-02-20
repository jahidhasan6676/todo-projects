import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { toast } from "react-toastify";

const TaskAdd = () => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

    const handleTaskAdd = async (e) => {
        e.preventDefault();
        const date = new Date();
        const taskDate = date.toLocaleDateString("en-GB").split("/").join("-");

        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const category = form.category.value;

        const taskData = {
            title,
            description,
            category,
            date: taskDate,
            email: user?.email
        }

        try {
            const res = await axiosPublic.post("/tasks", taskData);
            if (res.data.insertedId) {
                toast.success("Task Successfully Added")
            }
        } catch (err) {
            toast.error(err.message)
        }



    }

    return (
        <div className="w-11/12 mx-auto ">
            <div className="p-4 border rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-xl font-bold mb-3 text-center">Add New Task</h2>
                <form onSubmit={handleTaskAdd}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Task Title"
                        className="w-full p-2 border rounded mb-2"
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Task Description"
                        className="w-full p-2 border rounded mb-2"
                    />
                    <select className="w-full p-2 border rounded mb-2" name="category">
                        <option value="To-Do">To-Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">
                        Add Task
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskAdd;

