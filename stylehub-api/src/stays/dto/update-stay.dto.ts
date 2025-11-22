import { PartialType } from '@nestjs/swagger';
import { CreateStayDto } from './create-stay.dto';

export class UpdateStayDto extends PartialType(CreateStayDto) {
  // All fields from CreateStayDto are optional in UpdateStayDto
  // due to the use of PartialType
}
