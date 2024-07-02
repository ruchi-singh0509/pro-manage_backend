const taskModel = require('../models/taskModel');
const moment = require('moment');

const createTaskController = async (req, res) => {
    try {
        const { title, priority, dueDate, user, checklist, state } = req.body;

        // Create a new task
        const newTask = new taskModel({
            title,
            priority,
            dueDate,
            user,
            checklist,
            state,
        });

        // Save the new task to the database
        await newTask.save();

        // Return the new task
        res.status(201).json({
            status: 'Success',
            message: 'Task created successfully',
            newTask,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTaskByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the task by ID
        const task = await taskModel.findById(id);

        if (task) {
            // Return the task
            res.status(200).json(task);
        } else {
            // Return a 404 error if the task is not found
            res.status(404).json({
                status: 'Failed',
                message: 'Task not found',
            });
        }
    } catch (error) {
        // Return a 500 error if there is a server error
        res.status(500).json({
            status: 'Failed',
            message: 'Something went wrong!',
            error: error.message,
        });
    }
};

const getAlltask = async (req, res) => {
    try {
        const id = req.user._id;
        const alltasks = await taskModel.find({ user: id });
        if (alltasks) {
            res.json(alltasks);
        } else {
            res.status(404).json({
                status: 'Failed',
                message: 'Task not found',
            });
        }
    } catch (error) {
        // Return a 500 error if there is a server error
        res.status(500).json({
            status: 'Failed',
            message: 'Something went wrong!',
            error: error.message,
        });
    }
};
const editTaskController = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = req.body;

        // Find the task by ID and update it
        const task = await taskModel.findByIdAndUpdate(id, updatedTask, {
            new: true,
        });

        if (task) {
            // Return the updated task
            res.status(200).json({
                status: 'Success',
                message: 'Task updated successfully',
                task,
            });
        } else {
            // Return a 404 error if the task is not found
            res.status(404).json({
                status: 'Failed',
                message: 'Task not found',
            });
        }
    } catch (error) {
        // Return a 500 error if there is a server error
        res.status(500).json({
            status: 'Failed',
            message: 'Something went wrong!',
            error: error.message,
        });
    }
};
const deleteTaskController = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the task by ID and delete it
        const task = await taskModel.findByIdAndDelete(id);

        if (task) {
            // Return a 204 status code if the task is deleted
            res.status(204).json({
                status: 'Success',
                message: 'Task deleted successfully',
            });
        } else {
            // Return a 404 error if the task is not found
            res.status(404).json({
                status: 'Failed',
                message: 'Task not found',
            });
        }
    } catch (error) {
        // Return a 500 error if there is a server error
        res.status(500).json({
            status: 'Failed',
            message: 'Something went wrong!',
            error: error.message,
        });
    }
};

const updateTaskStateController = async (req, res) => {
    try {
        const { id } = req.params;
        const { state } = req.body;

        // Find the task by ID and update its state
        const task = await taskModel.findByIdAndUpdate(
            id,
            { state },
            { new: true }
        );

        if (task) {
            // Return the updated task
            res.status(200).json(task);
        } else {
            // Return a 404 error if the task is not found
            res.status(404).json({
                status: 'Failed',
                message: 'Task not found',
            });
        }
    } catch (error) {
        // Return a 500 error if there is a server error
        res.status(500).json({
            status: 'Failed',
            message: 'Something went wrong!',
            error: error.message,
        });
    }
};

const filterTasksController = async (req, res) => {
    try {
        const { filter } = req.query;

        let startOfWeek, endOfWeek, startOfMonth, endOfMonth;

        switch (filter) {
            case 'today':
                startOfWeek = moment().startOf('day');
                endOfWeek = moment().endOf('day');
                break;
            case 'thisWeek':
                startOfWeek = moment().startOf('week');
                endOfWeek = moment().endOf('week');
                break;
            case 'thisMonth':
                startOfMonth = moment().startOf('month');
                endOfMonth = moment().endOf('month');
                break;
            default:
                startOfWeek = moment().startOf('week');
                endOfWeek = moment().endOf('week');
        }

        let tasks;

        if (filter === 'today') {
            tasks = await taskModel.find({
                dueDate: {
                    $gte: startOfWeek.toDate(),
                    $lte: endOfWeek.toDate(),
                },
            });
        } else {
            tasks = await taskModel.find({
                dueDate: {
                    $gte:
                        filter === 'thisWeek'
                            ? startOfWeek.toDate()
                            : startOfMonth.toDate(),
                    $lte:
                        filter === 'thisWeek' ? endOfWeek.toDate() : endOfMonth.toDate(),
                },
            });
        }

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Something went wrong!',
            error: error.message,
        });
    }
};

const checkListController = {};

checkListController.updateIsCheck = async (req, res) => {
    try {
        const { taskId, checklistId } = req.params;
        const { ischeck } = req.body;

        const task = await taskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const checklistIndex = task.checklist.findIndex(
            (checklistItem) => checklistItem._id.toString() === checklistId
        );

        if (checklistIndex >= 0 && checklistIndex < task.checklist.length) {
            task.checklist[checklistIndex].ischeck = ischeck;
            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(400).json({ message: 'Invalid checklist id' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTaskController,
    getTaskByIdController,
    getAlltask,
    editTaskController,
    deleteTaskController,
    updateTaskStateController,
    filterTasksController,
    checkListController,
};