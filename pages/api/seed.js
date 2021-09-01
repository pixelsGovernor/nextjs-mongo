import nc from "next-connect";
import db from '../../utils/db';
import Product from '../../models/Product';
import data from '../../utils/data';
import User from '../../models/User';
import Task from '../../models/Task';
import HistoryTask from '../../models/HistoryTask';
const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  await Product.deleteMany();
  await Product.insertMany(data.products);

  await User.deleteMany();
  await User.insertMany(data.users);

  await Task.deleteMany();
  await Task.insertMany(data.tasks);

  await HistoryTask.deleteMany();
  await HistoryTask.insertMany(data.historyTasks);

  await db.disconnect();
  res.send({ message: 'seeded successfully'});
});

export default handler;
