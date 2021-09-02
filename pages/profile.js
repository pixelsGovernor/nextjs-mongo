import React, { useContext, useEffect } from 'react';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import { PolarArea } from 'react-chartjs-2';
import db from '../utils/db';
import nookies from 'nookies';
import Task from '../models/Task';
import HistoryTask from '../models/HistoryTask';

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
      historyTasksUsers[task.id] = (historyTasksUsers[task.id] || 0) + task.completed
    })
  })

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
  },[]);

  const data = {
    datasets: [{
      data: Object.keys(historyTasksUsers).map((key) => historyTasksUsers[key]),
      backgroundColor: tasks.map(() => getRandomColor()),
      label: 'My dataset' // for legend
    }],
    labels: tasks.map(task => task.title)
  };

  return (
    <>
      <div>PROFILE PAGE IN PROGRESS</div>
      <div style={{ width: 800 }}>
        <PolarArea
          data={data}
        />
      </div>
    </>
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
