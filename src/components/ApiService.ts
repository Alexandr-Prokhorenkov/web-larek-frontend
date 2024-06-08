import { Api, ApiListResponse } from './base/Api';
import {
	IProductItem,
	OrderRequestModel,
	OrderResponseModel,
} from '../types/index';

export class ProductApi extends Api {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProductItem[]> {
		return this.get<ApiListResponse<IProductItem>>('/product').then((data) => {
			const response = data;
			return response.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}));
		});
	}

	getProductItem(id: string): Promise<IProductItem> {
		return this.get<IProductItem>(`/product/${id}`).then((data) => {
			const item = data;
			return {
				...item,
				image: this.cdn + item.image,
			};
		});
	}
}

export class OrderApi extends Api {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	orderProduct(order: OrderRequestModel): Promise<OrderResponseModel> {
		return this.post<OrderResponseModel>('/order', order);
	}
}
