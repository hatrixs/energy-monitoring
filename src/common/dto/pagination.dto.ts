import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(2000)
  @Type(() => Number)
  limit: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
