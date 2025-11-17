import { PartialType } from '@nestjs/mapped-types';
import { CreateBranchRequestDto } from './create-branch-request.dto';

export class UpdateBranchRequestDto extends PartialType(CreateBranchRequestDto) { }