import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument, Post } from './schemas/post.schema'; 

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  // Fetch all posts from the database, populate user info, sort newest first
  async findAll() {
    return this.postModel.find().populate('user').sort({ createdAt: -1 }).exec();
  }

  // Create a new post with content and associate it with a user
  async create(content: string, userId: string) {
    const newPost = new this.postModel({ content, user: userId });
    return newPost.save();
  }
}
