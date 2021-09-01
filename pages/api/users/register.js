import nc from "next-connect";
import bcrypt from 'bcryptjs';
import db from '../../../utils/db';
import User from '../../../models/User';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {
  const { name, email, password } = req.body;
  const user = {
    name: name,
    email: email,
    password: bcrypt.hashSync(password),
    isAdmin: false,
  };
  await db.connect();
  const newUser = new User(user);
  await newUser.save(function(err) {
    db.disconnect();
    if (err) {
      res.status(500).send({ message: 'Error registering user', error: err });
    } else {
      const token = signToken(user);
      res.status(200).send({ message: 'User registered successfully', data: {...user, token} });
    }
  });
});

export default handler;
