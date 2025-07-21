import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude
} from "class-validator";
import { Transform } from 'class-transformer';

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(new Date(Date.now()).getFullYear() + 1)
  year: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;
}