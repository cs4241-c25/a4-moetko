import axios from "axios";

//const  = "http://localhost:3000";
const API_BASE_URL = "https://a4-moetko.vercel.app";
// configure axios to include cookies in all requests
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// fetch tasks
export const fetchTasks = async () => {
    try {
        //const response = await fetch("http://localhost:3000/tasks", {
        const response = await fetch("https://a4-moetko.vercel.app/tasks", {
            credentials: "include", // check cookies are sent
        });
        console.log("Fetch response:", response); // Debug log
        if (response.ok) {
            const data = await response.json();
            console.log("Fetched tasks:", data);
            return data;
        } else {
            console.error("Failed to fetch tasks:", response.status);
            throw new Error("Failed to fetch tasks");
        }
    } catch (error) {
        console.error("Error in fetchTasks:", error);
        throw error;
    }
};

// fetch completed tasks
export const fetchCompletedTasks = async () => {
    try {
        const response = await axios.get("/completed-tasks");
        console.log("Fetched completed tasks:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in fetchCompletedTasks:", error);
        throw error;
    }
};


// add a task
export const addTask = async (task) => {
    try {
        const response = await axios.post("/tasks", task);
        console.log("Added task:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in addTask:", error);
        throw error;
    }
};

// delete a task
export const deleteTask = async (id) => {
    try {
        const response = await axios.delete("/tasks", { data: { id } });
        console.log("Deleted task:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in deleteTask:", error);
        throw error;
    }
};

// mark a task as complete
export const markTaskComplete = async (id) => {
    try {
        const response = await axios.put("/tasks/complete", { id });
        console.log("Marked task as complete:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in markTaskComplete:", error);
        throw error;
    }
};

export const updateTask = async (taskId, updatedTask) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/tasks/update`, {
            id: taskId,
            ...updatedTask, // send all updated fields
        }, {
            withCredentials: true, // check cookies/session are sent
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};