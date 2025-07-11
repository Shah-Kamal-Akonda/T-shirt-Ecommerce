import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './Uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body('name') name: string,
    @Body('price') price: string,
    @Body('description') description: string,
    @Body('discount') discount: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('categoryIds') categoryIds: string,
  ) {
    const imagePaths = files.map((file) => `/Uploads/${file.filename}`);
    const parsedCategoryIds = JSON.parse(categoryIds);
    const parsedPrice = parseFloat(price);
    const parsedDiscount = discount ? parseFloat(discount) : null;
    return this.productService.createProduct(name, parsedPrice, description, imagePaths, parsedDiscount, parsedCategoryIds);
  }

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  

  @Get('category/:id')
  async findByCategory(@Param('id') categoryId: number) {
    return this.productService.findByCategory(categoryId);
  }


     @Get('search')
  async search(@Query('name') name: string) {
    return this.productService.searchProducts(name);
  }


  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

 

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './Uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('price') price: string,
    @Body('description') description: string,
    @Body('discount') discount: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('categoryIds') categoryIds: string,
  ) {
    const imagePaths = files.map((file) => `/Uploads/${file.filename}`);
    const parsedCategoryIds = JSON.parse(categoryIds);
    const parsedPrice = parseFloat(price);
    const parsedDiscount = discount ? parseFloat(discount) : null;
    return this.productService.updateProduct(id, name, parsedPrice, description, imagePaths, parsedDiscount, parsedCategoryIds);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }
}