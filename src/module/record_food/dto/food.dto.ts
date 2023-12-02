import { IsNotEmpty, IsNumber } from 'class-validator';

export class FoodDto {
    @IsNotEmpty()
    @IsNumber()
	food_id: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}
