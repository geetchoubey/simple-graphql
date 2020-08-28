
const users = [
  {
    id: '1',
    email: 'test@gmail.com',
    name: 'Test',
    password: 'password'
  },
  {
    id: '2',
    email: 'test2@gmail.com',
    name: 'Test2',
    password: 'password2'
  },
  {
    id: '3',
    email: 'test3@gmail.com',
    name: 'Test3',
    password: 'password3'
  }
]

const posts = [
  {
    id: '1',
    title: 'Post101',
    body: 'Body 101',
    isPublished: true,
    author: '1'
  },
  {
    id: '2',
    title: 'Post102',
    body: 'Body 102',
    isPublished: false,
    author: '1'
  },
  {
    id: '3',
    title: 'Post103',
    body: 'Body 103',
    isPublished: true,
    author: '2'
  }
];

const comments = [
  {
    id: '1',
    comment: 'Comment 101',
    post: '1',
    author: '1'
  },
  {
    id: '2',
    comment: 'Comment 102',
    post: '1',
    author: '2'
  },
  {
    id: '3',
    comment: 'Comment 103',
    post: '1',
    author: '2'
  },
  {
    id: '4',
    comment: 'Comment 104',
    post: '2',
    author: '3'
  }
];

const db = {
  users,
  posts,
  comments
}

export {db as default}