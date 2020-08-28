export default {
  users(parent, args, {db}, info) {
    if (!args.query) {
      return db.users
    }
    return db.users.filter(user => {
      return user.name.toLowerCase().includes(args.query.toLowerCase())
    })
  },
  posts(parent, args, {db}, info) {
    if (!args.query) {
      return db.posts
    }
    return db.posts.filter(post => {
      const isTitleMatch = post.title.toLocaleLowerCase().includes(args.query.toLowerCase())
      const isBodyMatch = post.body.toLocaleLowerCase().includes(args.query.toLowerCase())
      return isTitleMatch || isBodyMatch
    })
  }
}