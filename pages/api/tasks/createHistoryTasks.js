import nc from "next-connect";
import db from '../../../utils/db';
import HistoryTasks from '../../../models/HistoryTask';
import { getToday } from '../../../utils/date';

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const date = getToday();
  const newHistory = new HistoryTasks({
    date,
    tasks: req.body.tasks,
    user: req.body.user,
  });
  await newHistory.save(function(err, historyTask) {
    db.disconnect();
    if (err) {
      res.status(500).send({ message: 'Error creating taskHistory', error: err })
    } else {
      res.status(200).send({ message: 'tashHistory created successfully', data: historyTask })
    }
  });
});

export default handler;
