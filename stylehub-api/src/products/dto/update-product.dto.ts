// src/products/dto/update-product.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// PartialType makes all fields of CreateProductDto optional
export class UpdateProductDto extends PartialType(CreateProductDto) {}