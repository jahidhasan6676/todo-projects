import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { toast } from "react-toastify";
import AllTask from "../../hooks/AllTask";

const TaskAdd = () => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [, , , refetch] = AllTask();

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
        };

        try {
            const res = await axiosPublic.post("/tasks", taskData);
            if (res.data.insertedId) {
                refetch();
                toast.success("Task Successfully Added");
                setIsModalOpen(false);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="w-11/12 mx-auto flex flex-col items-center mt-10">
            
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-500 text-white py-2 px-4 border rounded-md">
                Add Task
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-3 text-center">Add New Task</h2>
                        <form onSubmit={handleTaskAdd}>
                            <input
                                type="text"
                                name="title"
                                placeholder="Task Title"
                                maxLength={50}
                                className="w-full p-2 border rounded mb-2"
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Task Description"
                                maxLength={200}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <select className="w-full p-2 border rounded mb-2" name="category">
                                <option value="To-Do">To-Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white py-2 px-4 rounded"
                                >
                                    Add Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskAdd;



