import React, { useState } from "react";
import { Button, Table, Form } from "react-bootstrap";

const TaskList = ({ tasks, onTaskDeleted, onTaskCompleted, onTaskUpdated }) => {
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTask, setEditedTask] = useState({ task: "", priority: "", deadline: "" });

    // handle edit button click
    const handleEditClick = (task) => {
        setEditingTaskId(task._id);
        setEditedTask({ task: task.task, priority: task.priority, deadline: task.deadline });
    };

    // handle save button click
    const handleSaveClick = (taskId) => {
        onTaskUpdated(taskId, editedTask); // call parent update function
        setEditingTaskId(null);
    };

    return (
        <div className="table-responsive">
            <Table striped bordered hover className="mt-3">
                <thead className="table-dark">
                <tr>
                    <th>Task</th>
                    <th>Priority</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map((task) => (
                    <tr key={task._id}>
                        <td>
                            {editingTaskId === task._id ? (
                                <Form.Control
                                    type="text"
                                    value={editedTask.task}
                                    onChange={(e) => setEditedTask({ ...editedTask, task: e.target.value })}
                                />
                            ) : (
                                task.task
                            )}
                        </td>
                        <td>
                            {editingTaskId === task._id ? (
                                <Form.Select
                                    value={editedTask.priority}
                                    onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                                >
                                    <option>High</option>
                                    <option>Medium</option>
                                    <option>Low</option>
                                </Form.Select>
                            ) : (
                                task.priority
                            )}
                        </td>
                        <td>
                            {editingTaskId === task._id ? (
                                <Form.Control
                                    type="date"
                                    value={editedTask.deadline}
                                    onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
                                />
                            ) : (
                                task.deadline
                            )}
                        </td>
                        <td>
                            {editingTaskId === task._id ? (
                                <Button variant="primary" size="sm" className="me-2" onClick={() => handleSaveClick(task._id)}>
                                    Save
                                </Button>
                            ) : (
                                <>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(task)}>
                                        Edit
                                    </Button>
                                    <Button variant="success" size="sm" className="me-2" onClick={() => onTaskCompleted(task._id)}>
                                        Complete
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => onTaskDeleted(task._id)}>
                                        Delete
                                    </Button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default TaskList;
