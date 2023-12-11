import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
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
	@IsArray()
	@IsString({ each: true })
	@Transform(o => o.value.split(','))
	search: any = [];

	@IsOptional()
	@IsString()
	sort: string = 'id';

	@IsOptional()
	@IsEnum(OrderType)
	order: OrderType = OrderType.ASC;

	uid: string;

	prepParams(uid: string) {
		this.offset = (this.page - 1) * this.limit;
		this.uid = uid;
	}
}
