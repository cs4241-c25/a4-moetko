import React, { useEffect, useState } from "react";
import { fetchTasks, addTask, deleteTask, markTaskComplete, updateTask } from "../api";
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";
import { Container, Card } from "react-bootstrap";

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks()
            .then((data) => {
                console.log("Fetched tasks in useEffect:", data);
                setTasks(data); // update the tasks state
            })
            .catch((err) => {
                console.error("Error fetching tasks:", err);
            });
    }, []);
    useEffect(() => {
        console.log("Tasks state updated:", tasks);
    }, [tasks]);

    const handleTaskAdded = async (newTask) => {
        try {
            await addTask(newTask);
            const updatedTasks = await fetchTasks();
            setTasks(updatedTasks);
        } catch (err) {
            console.error("Error adding task:", err);
        }
    };

    const handleTaskDeleted = async (taskId) => {
        try {
            await deleteTask(taskId);
            const updatedTasks = await fetchTasks();
            setTasks(updatedTasks);
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };

    const handleTaskCompleted = async (taskId) => {
        try {
            await markTaskComplete(taskId);
            // re-fetch tasks from the backend
            const updatedTasks = await fetchTasks();
            setTasks(updatedTasks);
        } catch (err) {
            console.error("Error marking task as completed:", err);
        }
    };

    const handleTaskUpdated = async (taskId, updatedTask) => {
        try {
            await updateTask(taskId, updatedTask);
            const updatedTasks = await fetchTasks();
            setTasks(updatedTasks);
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    return (
        <Container fluid className="d-flex flex-column vh-100">
            <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                <Card className="shadow-lg p-4 w-75">
                    <h1 className="text-center mb-4">To-Do List</h1>
                    <Card className="p-4 mb-4">
                        <AddTaskForm onTaskAdded={(newTask) => {
                            addTask(newTask).then(() => fetchTasks().then(setTasks));
                        }} />
                    </Card>
                    <Card className="p-4">
                        {tasks.length > 0 ? (
                            <TaskList
                                tasks={tasks}
                                onTaskDeleted={handleTaskDeleted}
                                onTaskCompleted={handleTaskCompleted}
                                onTaskUpdated={async (id, updatedTask) => {
                                    try {
                                        await updateTask(id, updatedTask);
                                        const updatedTasks = await fetchTasks();
                                        setTasks(updatedTasks);
                                    } catch (err) {
                                        console.error("Error updating task:", err);
                                    }
                                }}
                            />

                        ) : (
                            <p className="text-center text-muted">No tasks available. Add a new task above!</p>
                        )}
                    </Card>
                </Card>
            </div>
        </Container>
    );
};

export default TasksPage;
