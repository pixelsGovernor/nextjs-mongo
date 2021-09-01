import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true},
    tasks: {type: Array, required: true},
    user: { type: String, required: true }
  },
  {
    timestamps: true,
  });

const HistoryTask = mongoose.models.HistoryTask || mongoose.model('HistoryTask', historySchema);

export default HistoryTask;
