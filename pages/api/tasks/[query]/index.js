import nc from "next-connect";
import db from '../../../../utils/db';
import Task from '../../../../models/Task';
import HistoryTask from '../../../../models/HistoryTask';
import { getToday } from '../../../../utils/date';

const handler = nc();

handler.delete(async (req, res) => {
  const { query } = req.query;
  const filter = {};
  const fields = query.split(';');
  fields.forEach((field) => {
    const [key, value] = field.split('=');
    filter[key] = value;
  });
  const { id, user } = filter;
  await db.connect();
  const taskToDelete = await Task.findById(id);
  const historyDates = await HistoryTask.find({ date: getToday(), user });
  historyDates.forEach(async (historyDate) => {
    const dateContainsTaskDeleted = historyDate.tasks.find((task) => task.id === id);
    if (dateContainsTaskDeleted) {
      historyDate.tasks = historyDate.tasks.filter((task) => task.id !== id)
      await historyDate.save();
    }
  });
  await taskToDelete.remove();
  await db.disconnect();
  res.status(200).send({ message: 'Task deleted successfully' });
});

export default handler;
