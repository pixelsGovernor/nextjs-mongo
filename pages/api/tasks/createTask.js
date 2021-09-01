import nc from "next-connect";
import db from '../../../utils/db';
import Task from '../../../models/Task';

const handler = nc();

handler.post(async (req, res) => {
  const { data } = req.body;
  await db.connect();
  const newTask = new Task(data);
  await newTask.save(async function(err, task) {
    await db.disconnect();
    if (err) {
      res.status(500).send({ message: 'Error creating taskHistory', error: err })
    } else {
      res.status(200).send({ message: 'tashHistory created successfully', data: task })
    }
  });
});

export default handler;
