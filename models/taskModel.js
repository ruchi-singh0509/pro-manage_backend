const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkList = new Schema({
    text: { type: String, required: true },
    ischeck: { type: Boolean, required: true, default: false },
});

const TaskSchema = new Schema(
    {
        title: { type: String, required: true },
        priority: {
            type: String,
            required: true,
            enum: ['low', 'moderate', 'high'],
        },
        dueDate: { type: Date },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        checklist: [checkList],
        state: {
            type: String,
            required: true,
            enum: ['backlog', 'todo', 'in-progress', 'done'],
            default: 'todo',
        },
    },
    { timestamps: true }
);

const taskModel = mongoose.model('Task', TaskSchema);
module.exports = taskModel;