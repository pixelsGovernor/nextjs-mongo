import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  List,
  ListItem,
  TextField, Container
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Store } from '../utils/Store';
import { urlGiphy } from '../utils/endpoints';
import axios from 'axios';
import useStyles from '../utils/styles';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';

let timerFunc = null;

export default function  DialogCreationTask({ addTask, handleClose, open = true }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [images, setImages] = useState([]);
  const [taskInfo, setTaskInfo] = useState({title: '', description: '', image: null, user: userInfo && userInfo.email});
  const [searchImage, setSearchImage] = useState('');

  useEffect(async () => {
    const { data } = await axios.get(urlGiphy({token: process.env.TOKEN_GIPHY, endpoint: 'trending'}));
    setImages(data.data.filter((image) => image.embed_url));
  },[]);

  useEffect(async () => {
    const { data } = await axios.get(urlGiphy({token: process.env.TOKEN_GIPHY, endpoint: 'search', search: searchImage}));
    setImages(data.data.filter((image) => image.embed_url));
  },[searchImage]);

  const checkForm = () => {
    const { description, image, title } = taskInfo;
    if (title.length === 0 || description.length === 0 || !image) return false;
    return true;
  }

  const createTaskHandler = async () => {
    taskInfo.image = taskInfo.image.images.original.url;
    const { data, status } = await axios.post(`/api/tasks/createTask`, { data: taskInfo });
    if ( status === 200) {
      addTask(data.data);
      handleClose();
    }
  }

  const classes = useStyles();
  return(
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} fullScreen>
      <AppBar className={classes.relative}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            ADD A NEW TASK
          </Typography>
        </Toolbar>
      </AppBar>
      <List fullWidth>
        <ListItem fullWidth>
          <TextField variant="outlined" fullWidth id="title" label="Title" inputProps={{type: 'text'}} onChange={e => setTaskInfo({ ...taskInfo, title: e.target.value})} value={taskInfo.title} ></TextField>
        </ListItem>
        <ListItem>
          <TextField variant="outlined" fullWidth id="description" label="Description" inputProps={{type: 'text'}} onChange={e => setTaskInfo({ ...taskInfo, description: e.target.value})} value={taskInfo.description}></TextField>
        </ListItem>
        <ListItem>
          <TextField
            variant="outlined"
            fullWidth
            id="search"
            label="Search image..."
            inputProps={{type: 'text'}}
            onChange={(e) => {
              clearTimeout(timerFunc);
              timerFunc = setTimeout(() => {
                setSearchImage(e.target.value);
              }, 1000);
            }}
          ></TextField>
        </ListItem>
        <Container style={{ margin: 0, maxWidth: '100%', maxHeight: '50vh', overflow: 'scroll' }}>
          {taskInfo.image && taskInfo.image.images && (
            <img
              component="img"
              src={taskInfo.image.images.original.url}
              title={taskInfo.image.title} width='50%'
              height="50%"
              style={{ maxWidth: "250px", maxHeight: "250px", border: '5px solid mediumseagreen' }} />
            )}
          {images && images.map((image) => {
            const { url } = image.images.original
            return (
              <img key={image.title} component="img" src={url} title={image.title} width='50%' height="50%" style={{ maxWidth: "250px", maxHeight: "250px" }} onClick={() => {setTaskInfo({...taskInfo, image});}} />
            );
          })}
        </Container>
        <ListItem className={classes.footer}>
          <Button
            color="primary"
            disabled={!checkForm()}
            fullWidth
            onClick={createTaskHandler}
            type="submit"
            variant="contained"
          >
            CREATE TASK
          </Button>
        </ListItem>
      </List>
    </Dialog>
  );
}
