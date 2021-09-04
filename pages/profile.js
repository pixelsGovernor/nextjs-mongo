import React, { useContext, useEffect } from 'react';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import { Line, PolarArea } from 'react-chartjs-2';
import db from '../utils/db';
import nookies from 'nookies';
import Task from '../models/Task';
import HistoryTask from '../models/HistoryTask';
import Layout from '../components/Layout';
import { Card, Typography } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';

export default function Profile({ tasks = [], historyTasks = [] }) {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo} = state;

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const tasksUsers = {};
  tasks.forEach((task) => {
    tasksUsers[task._id] = task.title;
  });

  const historyTasksUsers = {};
  historyTasks.forEach((historyTaskDay) => {
    historyTaskDay.tasks.forEach((task) => {
      const taskUser = historyTasksUsers[task.id] ? historyTasksUsers[task.id] : {};
      taskUser.total = (taskUser.total || 0) + task.completed;
      taskUser[historyTaskDay.date] = task.completed
      historyTasksUsers[task.id] = taskUser
    })
  })

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
  },[]);

  const data = {
    datasets: [{
      data: Object.keys(historyTasksUsers).map((key) => historyTasksUsers[key].total),
      backgroundColor: tasks.map(() => getRandomColor()),
      label: 'My dataset' // for legend
    }],
    labels: tasks.map(task => task.title)
  };

  const dataLine = {
    labels: historyTasks.map((historyTask) => historyTask.date),
    datasets: tasks.map((task) => {
      const color = getRandomColor();
      return ({
        label: task.title,
        data: historyTasks.map((historyTask) => historyTasksUsers[task._id][historyTask.date] || 0),
        fill: false,
        backgroundColor: color,
        borderColor: color,
      });
    })
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <Layout style={{ display: 'flex', flexWrap: 'wrap'}}>
      <Card style={{ minWidth: 400 , width: 600, maxWidth: 800, marginTop: '15px' }}>
        <CardContent>
          <Typography variant="h2">
            TASKS COMPARATOR
          </Typography>
        </CardContent>
        <CardContent>
          <PolarArea
            data={data}
          />
        </CardContent>
      </Card>
      <Card style={{ minWidth: 400 , width: 600, maxWidth: 800, marginLeft: '15px', marginTop: '15px' }}>
        <CardContent>
          <Typography variant="h2">
            COMPLETED TASKS BY DAY
          </Typography>
        </CardContent>
        <CardContent>
          <Line data={dataLine} options={options} />
        </CardContent>
      </Card>
    </Layout>
  );
}

export const getServerSideProps = async (ctx) => {
  await db.connect();
  const cookies = nookies.get(ctx);
  const userInfoCookie = cookies.userInfo;
  if (userInfoCookie) {
    const userInfo = JSON.parse(userInfoCookie);
    const tasks = await Task.find({ user: userInfo.email }).lean();
    const historyTasks = await HistoryTask.find({ user: userInfo.email }).lean();
    await db.disconnect();
    return {
      props: {
        historyTasks: historyTasks ? historyTasks.map(db.convertDocToObj) : null,
        tasks: tasks.map(db.convertDocToObj)
      }
    }
  }
  await db.disconnect();
  return {
    props: {}
  }
}
