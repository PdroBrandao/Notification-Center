import { PartialType } from '@nestjs/swagger';
import { CreateSendRemimberDto } from './create-send-remimber.dto';

export class UpdateSendRemimberDto extends PartialType(CreateSendRemimberDto) {}
