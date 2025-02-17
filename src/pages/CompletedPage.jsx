import React, { useEffect, useState } from "react";
import { fetchCompletedTasks } from "../api";
import { Table, Container, Card } from "react-bootstrap";

const CompletedPage = () => {
    const [completedTasks, setCompletedTasks] = useState([]);

    useEffect(() => {
        // Fetch completed tasks
        fetchCompletedTasks()
            .then(setCompletedTasks)
            .catch((err) => {
                console.error("Error fetching completed tasks:", err);
                // redirect to login if user is not authenticated
                window.location.href = "/auth/github";
            });
    }, []);

    return (
        <Container className="mt-4">
            <Card className="shadow-sm p-4">
                <Card.Title className="mb-3 text-center">✔️ Completed Tasks</Card.Title>

                {completedTasks.length === 0 ? (
                    <p className="text-center text-muted">No completed tasks yet.</p>
                ) : (
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead className="table-dark">
                            <tr>
                                <th>Task</th>
                                <th>Priority</th>
                                <th>Completed On</th>
                            </tr>
                            </thead>
                            <tbody>
                            {completedTasks.map((task) => (
                                <tr key={task._id}>
                                    <td>{task.task}</td>
                                    <td>{task.priority}</td>
                                    <td>{new Date(task.completed_at).toLocaleString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Card>
        </Container>
    );
};

export default CompletedPage;
