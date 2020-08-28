import {COMMENT_ADDED, POST} from './constants'

export default {
  comment: {
    subscribe(parent, {postId}, {db, pubSub}, info) {
      let post = db.posts.find(post => post.id === postId && post.isPublished)

      if (!post) {
        throw new Error('Post not found')
      }

      return pubSub.asyncIterator([`${COMMENT_ADDED}${post.id}`])
    }
  },
  post: {
    subscribe(parent, args, {db, pubSub}, info) {
      return pubSub.asyncIterator([POST])
    }
  }
}