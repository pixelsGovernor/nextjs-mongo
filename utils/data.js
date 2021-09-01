import bcrypt from 'bcryptjs';
const data = {
  historyTasks: [
    {
      date: '27-08-2021',
      tasks: [{ id: '61288c2d20c0aa0d4ce3dc5a', completed: 100 }],
      user: 'zaquiel1619@gmail.com'
    }
  ],
  products: [
    {
      name: 'Free Shirt',
      category: 'Shirts',
      image: '/images/shirt1.jpg',
      price: 70,
      slug: 'free-shirt',
      brand: 'Nike',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular shirt'
    },
    {
      name: 'Fit Shirt',
      category: 'Shirts',
      image: '/images/shirt2.jpg',
      price: 80,
      slug: 'fit-shirt',
      brand: 'Adidas',
      rating: 4.2,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular shirt'
    },
    {
      name: 'Slim Shirt',
      category: 'Shirts',
      image: '/images/shirt3.jpg',
      price: 90,
      slug: 'slim-shirt',
      brand: 'Raymond',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular shirt'
    },
    {
      name: 'Golf Pants',
      category: 'Pants',
      image: '/images/pants1.jpg',
      price: 70,
      slug: 'golf-pants',
      brand: 'Oliver',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'Smart looking pants'
    },
    {
      name: 'Fit Pants',
      category: 'Pants',
      image: '/images/pants2.jpg',
      price: 95,
      slug: 'fit-pants',
      brand: 'Zara',
      rating: 3,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular pants'
    },
    {
      name: 'Classic Pants',
      category: 'Pants',
      image: '/images/pants3.jpg',
      price: 95,
      slug: 'classic-pants',
      brand: 'Casely',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular pants'
    },
  ],
  tasks: [{
    title: 'Exercise',
    image: 'https://media2.giphy.com/media/NSodIu91KDWCs/giphy.gif?cid=ecf05e47lclkeps0d5txjvykyck0xycbirufr17lukacc2r6&rid=giphy.gif&ct=g',
    description: 'Exercise with the body'
  },
  {
    title: 'Work',
    image: 'https://media3.giphy.com/media/bAplZhiLAsNnG/giphy.gif?cid=ecf05e47r1zcmhht6cqvp47nocn2dal7v7nxb0whorrjr3em&rid=giphy.gif&ct=g',
    description: 'Work in personal projects to learn new things'
  },
  {
    title: 'Meditation',
    image: 'https://media2.giphy.com/media/H7kfFDvD9HSYGRbvid/giphy.gif?cid=790b76119bb13f62f368c1054d7b67794db1e1d33f1237c4&rid=giphy.gif&ct=g',
    description: 'Meditation'
  },
  {
    title: 'Read',
    image: 'https://media4.giphy.com/media/SiMcadhDEZDm93GmTL/giphy.webp?cid=ecf05e47s001q0qf42d3w1t4uadd8eekoqkuua7p1sjzjpus&rid=giphy.webp&ct=g',
    description: 'Read books'
  }],
  users: [{
    name: 'Zaquiel',
    email: 'zaquiel1619@gmail.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: true,
  }],
}

export default data;
