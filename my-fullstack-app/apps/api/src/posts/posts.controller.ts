import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostsService } from './posts.service';

@Controller('posts') // All routes in this controller will start with /posts
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Protected by JWT. Returns all posts sorted by newest first.
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.postsService.findAll();
  }

  // Protected by JWT. Creates a new post for the logged-in user.
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body('content') content: string, @Req() req) {
    // req.user is added by the JWT strategy after token validation
    return this.postsService.create(content, req.user.id);
  }
}
