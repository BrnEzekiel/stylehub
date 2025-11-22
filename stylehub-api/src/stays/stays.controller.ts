import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Put,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { StaysService } from './stays.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateStayDto } from './dto/create-stay.dto';
import { UpdateStayDto } from './dto/update-stay.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { StayType } from '@prisma/client'; // <-- FIX: Import StayType

@ApiTags('stays')
@Controller('stays')
export class StaysController {
  constructor(private readonly staysService: StaysService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new stay listing' })
  @ApiResponse({ status: 201, description: 'Stay created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Req() req: Request,
    @Body() createStayDto: CreateStayDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }
    // @ts-ignore // You can add this line if TypeScript still complains about 'sub'
    return this.staysService.create(req.user.sub, createStayDto, files); // <-- FIX: Use .sub
  }

  @Get()
  @ApiOperation({ summary: 'Get all stays with optional filters' })
  @ApiResponse({ status: 200, description: 'Returns list of stays' })
  async findAll(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('type') type?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.staysService.findAll({
      city,
      minPrice,
      maxPrice,
      type: type as StayType,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get('search')
  @ApiOperation({ summary: 'Search stays by location' })
  @ApiResponse({ status: 200, description: 'Returns search results' })
  async search(
    @Query('query') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    if (!query) {
      throw new BadRequestException('Search query is required');
    }
    return this.staysService.search(query, Number(page), Number(limit));
  }

  @Get('my-stays')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get stays owned by the current user' })
  @ApiResponse({ status: 200, description: 'Returns user\'s stays' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findUserStays(
    @Req() req: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    // @ts-ignore
    return this.staysService.findByOwner(req.user.sub, Number(page), Number(limit)); // <-- FIX: Use .sub
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get stay by ID' })
  @ApiResponse({ status: 200, description: 'Returns the stay' })
  @ApiResponse({ status: 404, description: 'Stay not found' })
  async findOne(@Param('id') id: string) {
    return this.staysService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a stay' })
  @ApiResponse({ status: 200, description: 'Stay updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the owner' })
  @ApiResponse({ status: 404, description: 'Stay not found' })
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateStayDto: UpdateStayDto,
  ) {
    // @ts-ignore
    return this.staysService.update(req.user.sub, id, updateStayDto); // <-- FIX: Use .sub
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a stay' })
  @ApiResponse({ status: 200, description: 'Stay deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the owner' })
  @ApiResponse({ status: 404, description: 'Stay not found' })
  async remove(@Req() req: Request, @Param('id') id: string) {
    // @ts-ignore
    return this.staysService.remove(req.user.sub, id); // <-- FIX: Use .sub
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add images to a stay' })
  @ApiResponse({ status: 201, description: 'Images added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the owner' })
  @ApiResponse({ status: 404, description: 'Stay not found' })
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  async addImages(
    @Req() req: Request,
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }
    // @ts-ignore
    return this.staysService.addImages(req.user.sub, id, files); // <-- FIX: Use .sub
  }

  @Put(':id/images/:imageId/primary')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set primary image for a stay' })
  @ApiResponse({ status: 200, description: 'Primary image set successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the owner' })
  @ApiResponse({ status: 404, description: 'Stay or image not found' })
  async setPrimaryImage(
    @Req() req: Request,
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ) {
    // @ts-ignore
    return this.staysService.setPrimaryImage(req.user.sub, id, imageId); // <-- FIX: Use .sub
  }

  @Delete(':id/images/:imageId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an image from a stay' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the owner' })
  @ApiResponse({ status: 404, description: 'Stay or image not found' })
  async removeImage(
    @Req() req: Request,
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ) {
    // @ts-ignore
    return this.staysService.removeImage(req.user.sub, id, imageId); // <-- FIX: Use .sub
  }
}