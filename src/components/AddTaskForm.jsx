import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

const AddTaskForm = ({ onTaskAdded }) => {
    const [task, setTask] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [deadline, setDeadline] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onTaskAdded({ task, priority, deadline });
        setTask("");
        setPriority("Medium");
        setDeadline("");
    };

    return (
        <Card className="mt-4 p-4 shadow-sm">
            <Card.Title className="mb-3 text-center">Add a New Task</Card.Title>
            <Form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-4">
                        <Form.Group className="mb-3">
                            <Form.Label>Task</Form.Label>
                            <Form.Control
                                type="text"
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                                placeholder="Enter task name"
                                required
                            />
                        </Form.Group>
                    </div>

                    <div className="col-md-4">
                        <Form.Group className="mb-3">
                            <Form.Label>Priority</Form.Label>
                            <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-md-4">
                        <Form.Group className="mb-3">
                            <Form.Label>Deadline</Form.Label>
                            <Form.Control
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </div>
                </div>
                <div className="text-center">
                    <Button type="submit" variant="primary">➕ Add Task</Button>
                </div>
            </Form>
        </Card>
    );
};

export default AddTaskForm;
