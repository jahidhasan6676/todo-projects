import React, { useContext, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import AllTask from "../../hooks/AllTask";
import AuthContext from "../../context/AuthContext";

const AllTaskShow = () => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, isLoading, error, refetch] = AllTask();
    const categories = ["To-Do", "In Progress", "Done"];

    

    const handleOpenModal = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

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
            email: user?.email,
        };

        const res = await axiosPublic.put(`/tasks-update/${selectedTask._id}`, updateTaskData);
        if (res.data.modifiedCount) {
            Swal.fire({
                title: "Updated!",
                text: "Your Task has been updated.",
                icon: "success",
            });
            refetch();
            handleCloseModal();
        }
    };

    if (isLoading) return <p className="text-center text-gray-500">Loading tasks...</p>;
    if (error) return <p className="text-center text-red-500">Error fetching tasks</p>;

    const handleDeleteProduct = (id) => {

        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosPublic.delete(`/tasks/${id}`);
                if (res.data.deletedCount) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your Task has been deleted.",
                        icon: "success",
                    });
                    refetch();
                }
            }
        });
    };

    // Ensure all categories exist even if they are empty
    const groupedTasks = categories.reduce((acc, category) => {
        acc[category] = tasks.filter((task) => task.category === category);
        return acc;
    }, {});

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        const sourceCategory = source.droppableId;
        const destCategory = destination.droppableId;

        const sourceTasks = [...groupedTasks[sourceCategory]];
        const [removed] = sourceTasks.splice(source.index, 1);

        if (sourceCategory === destCategory) {
            sourceTasks.splice(destination.index, 0, removed);
            groupedTasks[sourceCategory] = sourceTasks;
        } else {
            removed.category = destCategory;
            const destTasks = [...groupedTasks[destCategory]];
            destTasks.splice(destination.index, 0, removed);
            groupedTasks[sourceCategory] = sourceTasks;
            groupedTasks[destCategory] = destTasks;
        }

        const updatedTasks = Object.values(groupedTasks).flat();

        axiosPublic.put('/tasks/reorder', { tasks: updatedTasks })
            .then((response) => {
                console.log("Reorder Response:", response.data);
                refetch();
            })
            .catch(err => {
                console.error("Error updating tasks:", err);
            });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="w-11/12 mx-auto mt-20">
                <h2 className="text-2xl font-bold mb-4 text-center">Task List</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <Droppable droppableId={category} key={category}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="border rounded-lg shadow-md bg-gray-100 p-4"
                                >
                                    <h3 className="text-xl font-bold mb-2">{category}</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {groupedTasks[category].length > 0 ? (
                                            groupedTasks[category].map((task, index) => (
                                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="p-4 border rounded-lg shadow-sm bg-white"
                                                        >
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
                                                    )}
                                                </Draggable>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-center mt-2">No tasks available</p>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>

                {/* Modal for updating tasks */}
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
                                <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-500 text-white rounded-lg">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </DragDropContext>
    );
};

export default AllTaskShow;


