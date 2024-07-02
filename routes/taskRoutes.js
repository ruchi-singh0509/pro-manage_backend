const express = require('express');
const {
    createTaskController,
    getTaskByIdController,
    getAlltask,
    editTaskController,
    deleteTaskController,
    updateTaskStateController,
    filterTasksController,
    checkListController,
} = require('../controllers/TaskController');
const { isLoggedIn } = require('../middleware/auth');

const router = express.Router();

router.post('/createtask', isLoggedIn, createTaskController);

router.get('/gettaskbyid/:id', getTaskByIdController);

router.get('/getalltask', isLoggedIn, getAlltask);

router.put('/edit-task/:id', isLoggedIn, editTaskController);

router.delete('/delete-task/:id', isLoggedIn, deleteTaskController);

router.put('/update-state/:id', isLoggedIn, updateTaskStateController);

router.get('/get-filter', isLoggedIn, filterTasksController);

router.put(
    '/tasks/:taskId/checklists/:checklistId',
    isLoggedIn,
    checkListController.updateIsCheck
);

module.exports = router;