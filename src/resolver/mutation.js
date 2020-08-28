import {v4 as uuid} from "uuid"
import {COMMENT_ADDED, POST} from "./constants"
import post from "./post";

export default {
  createUser(parent, {data: args}, {db}, info) {
    let emailTaken = db.users.some(user => user.email === args.email)
    if (emailTaken) {
      throw new Error('Email already exists.')
    }
    let user = {
      id: uuid(),
      ...args
    }
    db.users.push(user)
    return user
  },
  deleteUser(parent, args, ctx, info) {
    let userIndex = db.users.findIndex(user => user.id === args.id)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    const deletedUsers = db.users.splice(userIndex, 1)

    db.posts = db.posts.filter(post => {
      let match = post.author === args.id

      if (match) {
        db.comments = db.comments.filter(comment => comment.author !== args.id || comment.post !== post.id)
      }

      return !match
    })

    return deletedUsers[0]
  },
  updateUser(parent, {id, data}, {db}, info) {
    console.log(db.users)
    const user = db.users.find(user => user.id === id)
    console.log(user)
    if (!user) {
      throw new Error('User not found')
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.find(user => user.email === data.email)

      if (emailTaken) {
        throw new Error('Email already taken')
      }

      user.email = data.email
    }

    if (typeof data.user === 'string') {
      user.name = data.name
    }

    if (typeof data.password === 'string')
      user.password = data.password

    return user
  },
  createPost(parent, {data: args}, {db, pubSub}, info) {
    let userExists = db.users.some(user => user.id === args.author)
    if (!userExists) {
      throw new Error('User does not exist')
    }
    let post = {
      id: uuid(),
      ...args
    }
    db.posts.push(post)

    if (post.isPublished) {
      pubSub.publish(POST, {
        post: {
          mutation: 'CREATED',
          data: post
        }
      })
    }

    return post
  },
  deletePost(parent, args, {db, pubSub}, info) {
    let postIndex = db.posts.findIndex(post => post.id === args.id)

    if (postIndex === -1) {
      throw new Error("Post not found")
    }

    const [post] = db.posts.splice(postIndex, 1)

    db.comments = db.comments.filter(comment => comment.id !== args.id)

    if (post.isPublished) {
      pubSub.publish(POST, {
        post: {
          mutation: 'DELETED',
          data: post
        }
      })
    }
    
    return post
  },
  updatePost(parent, {id, data}, {db}, info) {
    let post = db.posts.find(post => post.id === id)

    if (!post) {
      throw new Error('Post not found')
    }

    if (typeof data.title === 'string') {
      post.title = data.title
    }
    if (typeof data.body === 'string') {
      post.body = data.body
    }
    if (typeof data.isPublished === 'boolean') {
      post.isPublished = data.isPublished
    }

    return post
  },
  createComment(parent, {data: args}, {db, pubSub}, info) {
    let userExists = db.users.some(user => user.id === args.author)
    if (!userExists) {
      throw new Error('User does not exist')
    }
    let postExists = db.posts.some(post => post.id === args.post)
    if (!postExists) {
      throw new Error('Post does not exist')
    }
    let comment = {
      id: uuid(),
      ...args
    }
    db.comments.push(comment)

    pubSub.publish(`${COMMENT_ADDED}${args.post}`, {
      comment
    })
    return comment
  },
  deleteComment(parent, args, {db}, info) {
    let commentIndex = db.comments.findIndex(comment => comment.id === args.id)

    if (commentIndex === -1) {
      throw new Error("Comment not found")
    }

    const deletedComments = db.comments.splice(commentIndex, 1)

    return deletedComments[0]
  },
  updateComment(parent, {id, data}, {db}, info) {
    let comment = db.comments.find(comment => comment.id === id)

    if (!comment) {
      throw new Error('Comment not found')
    }

    if (typeof data.comment === 'string') {
      comment.comment = data.comment
    }

    return comment
  }
}
