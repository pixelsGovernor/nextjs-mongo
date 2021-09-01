import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    description: { type: String, required: false },
    image: { type: String, required: true },
    title: { type: String, required: true },
    user: { type: String, required: true }
  },
  {
    timestamps: true,
  });

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export default Task;
