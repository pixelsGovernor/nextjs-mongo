import nc from "next-connect";
import db from '../../../utils/db';
import HistoryTask from '../../../models/HistoryTask';

const handler = nc();



handler.post(async (req, res) => {
  const { idHistoryTask, tasks } = req.body;
  await db.connect();
  const historyToday = await HistoryTask.findById(idHistoryTask);
  historyToday.tasks = tasks;
  await historyToday.save(async function (err) {
    await db.disconnect();
    if (err) res.status(500).send({ message: 'Error updating history task'});
    else {
      res.status(200).send({message: 'History task updated successfully'});
    }
  })
});

export default handler;
