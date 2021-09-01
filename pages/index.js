import React, { useContext, useEffect, useRef , useState } from 'react';
import Layout from '../components/Layout';
import nookies from 'nookies';
import { Button, Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@material-ui/core';
import db from '../utils/db';
import Task from '../models/Task';
import axios from 'axios';
import HistoryTask from '../models/HistoryTask';
import useStyles, { percentFromHex } from '../utils/styles';
import { Store } from '../utils/Store';
import { getToday } from '../utils/date';
import CheckAuthentication from '../components/CheckAuthentication';
import DialogCreationTask from '../components/DialogCreationTask';
import AddIcon from '@material-ui/icons/AddBox';
import Container from '@material-ui/core/Container';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Slider from '@material-ui/core/Slider';

const marks = [0, 10, 20, 30, 40, 50, 60, 70, 80 ,90, 100];

let sliderTouched = false;

export default function Home({ historyTodayProps, tasks: tasksProps = [] }) {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [ showCreationDialog, setCreationDialog] = useState(false);
  const [ loadingTaskId, setLoadingTaskId] = useState(null);
  const [ tasks, setTasks] = useState(tasksProps);
  const [ historyToday, setHistoryToday] = useState(historyTodayProps);
  const [sliderValues, setSliderValues] = useState({});
  const classes = useStyles();

  let refSlider = useRef(null);

  useEffect(() => {
    if (!historyToday) {
      setHistoryToday({ date: getToday(), tasks: [], user: userInfo && userInfo.email});
    }
  }, [])

  const cardHandler = async (id, newValueCompleted) => {
    setLoadingTaskId(id);
    const completed = sliderTouched ? sliderValues[id] : newValueCompleted;
    let tasks = [...historyToday.tasks];
    const existTask = historyToday.tasks.findIndex((taskSaved) => taskSaved.id === id);
    if (existTask >= 0) {
      tasks[existTask] ={ ...tasks[existTask], completed };
    } else {
      tasks.push({ completed, id, user: userInfo.email });
    }
    const { status } = await axios.post(`/api/tasks/${historyTodayProps ? 'updateHistoryTasks' :'createHistoryTasks'}`, { idHistoryTask: historyTodayProps && historyTodayProps._id, id, tasks, user: userInfo.email });
    if (status === 200) {
      if (!sliderTouched) {
        const newSliderValues = {...sliderValues};
        newSliderValues[id] = completed;
        setSliderValues(newSliderValues);
      }
      setHistoryToday({ ...historyToday, tasks });
    }
    sliderTouched = false;
    setLoadingTaskId(null);
  }

  const deleteTaskHandler = async (id) => {
    const { status } = await axios.delete(`/api/tasks/id=${id};user=${userInfo.email}`, { user: userInfo.email });
    if ( status === 200) {
      setTasks(tasks.filter((taskInfo) => taskInfo._id !== id));
    }
  }

  return (
    <Layout>
      <DialogCreationTask addTask={(newTask) => {
        setTasks([...tasks, newTask]);
      }} handleClose={() => setCreationDialog(false)} open={showCreationDialog} />
      <CheckAuthentication />
      <Container className={classes.root}>
        <Button
          className={classes.button}
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => setCreationDialog(true)}
        >
          Add new task
        </Button>
      </Container>
      <Grid container spacing={3}>
        {tasks.map((task) => {
          let taskHistory = historyToday && historyToday.tasks && historyToday.tasks.filter((taskSaved) => taskSaved.id === task._id);
          if (taskHistory && taskHistory.length === 1) taskHistory = taskHistory[0];
          else taskHistory = null;
          const taskCompleted = taskHistory && taskHistory.completed;
          const opacity = taskCompleted ? percentFromHex(taskCompleted) : '00';
          if (taskHistory && sliderValues[task._id] === undefined) {
            const newSliderValues = {...sliderValues };
            newSliderValues[task._id] = taskHistory.completed;
            setSliderValues(newSliderValues);
          }
          return (
          <Grid item md={4} key={task.title}>
            <Card style={{ backgroundColor: taskCompleted ? `#3cb371${opacity}` : '',position: 'relative' }}>
              <DeleteForeverIcon onClick={() => deleteTaskHandler(task._id)} style={{ position: 'absolute', right: 5, top: 5, zIndex: 1, cursor: 'pointer' }} />
              <CardActionArea onClick={() => {
                cardHandler(task._id, taskCompleted === 100 ? 0 : 100);
              }} disabled={loadingTaskId === task._id}>
                <CardContent>
                  <Typography variant="h2">
                    {task.title}
                  </Typography>
                  <Container>
                    <Typography id="non-linear-slider" gutterBottom>
                      Percentage completed
                    </Typography>
                    <Slider
                      aria-labelledby="discrete-slider-custom"
                      value={sliderValues[task._id]}
                      marks={marks.map((value) => ({ label: `${value}`, value: value }))}
                      onChange={(_, value) => {
                        if(value !== sliderValues[task._id]) {
                          sliderTouched = true;
                          const newSliderValues = {...sliderValues};
                          newSliderValues[task._id] = value;
                          setSliderValues(newSliderValues);
                        }
                      }}
                      ref={refSlider}
                      step={10}
                      style={{ marginRight: '25px' }}
                      valueLabelDisplay="auto"
                    />
                  </Container>
                <CardMedia component="img" height={362} image={task.image} title={task.title} />
                </CardContent>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">{task.description}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        )})}
      </Grid>
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  await db.connect();
  const cookies = nookies.get(ctx);
  const userInfoCookie = cookies.userInfo;
  if (userInfoCookie) {
    const userInfo = JSON.parse(userInfoCookie);
    const tasks = await Task.find({ user: userInfo.email }).lean();
    const historyTaskToday = await HistoryTask.findOne({ date: getToday(), user: userInfo.email }).lean();
    await db.disconnect();
    return {
      props: {
        historyTodayProps: historyTaskToday ? db.convertDocToObj(historyTaskToday) : null,
        tasks: tasks.map(db.convertDocToObj)
      }
    }
  }
  await db.disconnect();
  return {
    props: {}
  }
}
