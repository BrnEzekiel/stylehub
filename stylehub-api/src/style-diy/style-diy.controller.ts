// src/style-diy/style-diy.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nest-lab/fastify-multer';
import { StyleDIYService } from './style-diy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';

@Controller('style-diy')
export class StyleDIYController {
  constructor(private readonly styleDIYService: StyleDIYService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  createPost(
    @Request() req,
    @Body() dto: CreatePostDto,
    @UploadedFiles() files: { image?: any[]; video?: any[] },
  ) {
    const imageFile = files?.image?.[0];
    const videoFile = files?.video?.[0];
    return this.styleDIYService.createPost(req.user.sub, dto, imageFile, videoFile);
  }

  @Get()
  getAllPosts(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.styleDIYService.getAllPosts(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get(':id')
  getPostById(@Param('id', ParseUUIDPipe) id: string) {
    return this.styleDIYService.getPostById(id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  likePost(@Param('id', ParseUUIDPipe) id: string) {
    return this.styleDIYService.likePost(id);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  addComment(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.styleDIYService.addComment(id, req.user.sub, dto);
  }

  @Post(':id/recommendations')
  @UseGuards(JwtAuthGuard)
  addRecommendation(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateRecommendationDto,
  ) {
    return this.styleDIYService.addRecommendation(id, req.user.sub, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deletePost(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.styleDIYService.deletePost(id, req.user.sub);
  }
}

