import useAxiosPublic from "../../hooks/useAxiosPublic";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import AllTask from "../../hooks/AllTask";
import Swal from "sweetalert2";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";

const AllTaskShow = () => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, isLoading, error, refetch] = AllTask();

    // Modal Open Function
    const handleOpenModal = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    // Modal Close Function
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    // Update Task Function
    const handleUpdateTask = async (event) => {
        event.preventDefault();
        
        const form = event.target;
        const title = form.title.value;
        const description = form.description.value;
        const category = form.category.value;

        const updateTaskData = {
            title,
            description,
            category,
            date: selectedTask.date,
            email: user?.email
        }

        const res = await axiosPublic.put(`/tasks-update/${selectedTask._id}`, updateTaskData);
        if (res.data.modifiedCount) {
            Swal.fire({
                title: "Updated!",
                text: "Your Task has been updated.",
                icon: "success"
            });
            refetch();
            handleCloseModal(); 
        } 
    };

    if (isLoading) return <p className="text-center text-gray-500">Loading tasks...</p>;
    if (error) return <p className="text-center text-red-500">Error fetching tasks</p>;

    // Task delete
    const handleDeleteProduct = (id) => {
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosPublic.delete(`/tasks/${id}`);
                if (res.data.deletedCount) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your Task has been deleted.",
                        icon: "success"
                    });
                    refetch();
                }
            }
        });
    };

    // Grouping tasks by category
    const groupedTasks = tasks.reduce((acc, task) => {
        if (!acc[task.category]) {
            acc[task.category] = [];
        }
        acc[task.category].push(task);
        return acc;
    }, {});

    return (
        <div className="w-11/12 mx-auto mt-20">
            <h2 className="text-2xl font-bold mb-4 text-center">Task List</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(groupedTasks).map((category) => (
                    <div key={category} className="border rounded-lg shadow-md bg-gray-100 p-4">
                        <h3 className="text-xl font-bold mb-2">{category}</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {groupedTasks[category].map((task) => (
                                <div key={task._id} className="p-4 border rounded-lg shadow-sm bg-white">
                                    <h4 className="text-lg font-semibold">{task.title}</h4>
                                    <p className="text-gray-600">{task.description}</p>
                                    <p className="text-sm text-gray-500">Date: {task.date}</p>
                                    <div className="text-end">
                                        <button onClick={() => handleOpenModal(task)} className="text-blue-500 hover:text-blue-700 mr-2">
                                            <FiEdit size={20} />
                                        </button>
                                        <button onClick={() => handleDeleteProduct(task._id)} className="text-red-500 hover:text-red-700">
                                            <MdDelete size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Update Modal */}
            {isModalOpen && selectedTask && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <form className="bg-white p-6 rounded-lg w-96" onSubmit={handleUpdateTask}>
                        <h3 className="text-xl font-semibold mb-4">Update Task</h3>
                        <input
                            type="text"
                            name="title"
                            defaultValue={selectedTask.title}
                            placeholder="Task Title"
                            className="w-full mb-2 p-2 border rounded-lg"
                        />
                        <textarea
                            name="description"
                            defaultValue={selectedTask.description}
                            placeholder="Task Description"
                            className="w-full mb-2 p-2 border rounded-lg"
                        />
                        <select
                            name="category"
                            defaultValue={selectedTask.category}
                            className="w-full mb-4 p-2 border rounded-lg"
                        >
                            <option value="To-Do">To-Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                        <div className="flex justify-between">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg">
                                Cancel
                            </button>
                            <button type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AllTaskShow;


