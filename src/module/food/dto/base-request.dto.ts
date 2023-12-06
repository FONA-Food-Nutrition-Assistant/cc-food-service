import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { OrderType } from 'src/common/enum/request.enum';

export class BaseRequestDto {
	@IsOptional()
	@IsInt()
	@Transform(o => parseInt(o.value))
	page: number = 1;

	@IsOptional()
	@IsInt()
	@Transform(o => parseInt(o.value))
	limit: number = 0;

	offset: number;

	@IsOptional()
	@IsString()
	search: string;

	@IsOptional()
	@IsString()
	sort: string = 'id';

	@IsOptional()
	@IsEnum(OrderType)
	order: OrderType = OrderType.ASC;

	prepParams() {
		this.offset = (this.page - 1) * this.limit;
	}
}
