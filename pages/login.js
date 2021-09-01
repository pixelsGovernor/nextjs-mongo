import React, { useContext, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Layout from '../components/Layout';
import { Button, List, ListItem, TextField } from '@material-ui/core';
import useStyles from '../utils/styles';
import axios from 'axios';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function Login() {
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch} = useContext(Store);
  const { userInfo} = state;
  if (userInfo) {
    router.push('/');
  }
  const [isRegistered, setIsRegistered ] = useState(true);
  const [name, setName ] = useState('');
  const [email, setEmail ] = useState('');
  const [password, setPassword ] = useState('');
  const classes = useStyles();

  const checkValidFormHandler = () => email.length > 0 && password.length > 0 && (isRegistered || (!isRegistered && name.length > 0));

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const  { data } = await axios.post(`/api/users/${isRegistered ? 'login' : 'register'}`, { email, name, password });
      dispatch({ type: 'USER_LOGIN', payload: data.data });
      Cookies.set('userInfo', JSON.stringify(data.data));
      router.push(redirect || '/');
    } catch (err) {
      alert(err.response.data ? err.response.data.message :err.message);
    }
  }

  return (
    <Layout title="Login">
      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">Login</Typography>
        <List>
          {!isRegistered && (
            <ListItem>
              <TextField variant="outlined" fullWidth id="name" label="Name" inputProps={{type: 'text'}} onChange={e => setName(e.target.value)}></TextField>
            </ListItem>
          )}
          <ListItem>
            <TextField variant="outlined" fullWidth id="email" label="Email" inputProps={{type: 'email'}} onChange={e => setEmail(e.target.value)}></TextField>
          </ListItem>
          <ListItem>
            <TextField variant="outlined" fullWidth id="password" label="Password" inputProps={{type: 'password'}} onChange={e => setPassword(e.target.value)}></TextField>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary" disabled={!checkValidFormHandler()}>{ isRegistered ? 'Login' : 'Register' }</Button>
          </ListItem>
          <ListItem>
            Don&apos;t have an account? &nbsp; <Button color="primary" onClick={() => setIsRegistered(!isRegistered)}>{ isRegistered ? 'Register' : 'Login' }</Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
