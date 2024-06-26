import { Model } from '../base/Model';
import {
	IAppState,
	IProductItem,
	IFormError,
	TPayment,
	IOrder,
	IOrderForm,
} from '../../types/index';

enum OrderError {
	PAYMENT = 'Необходимо указать способ оплаты',
	ADDRESS = 'Необходимо указать адрес',
}

enum ContactError {
	EMAIL = 'Необходимо указать email',
	PHONE = 'Необходимо указать телефон',
}

export class Product extends Model<IProductItem> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	selected: boolean;
}

export class AppState extends Model<IAppState> {
	//каталог со всеми товарами
	protected catalog: IProductItem[];
	//каталог с купленными товарами
	protected basket: IProductItem[] = [];
	//заказ клиента
	order: IOrder = {
		address: '',
		payment: 'Online',
		email: '',
		total: 0,
		phone: '',
		items: [],
	};

	protected formErrors: IFormError = {};

	setCatalog(items: IProductItem[]) {
		this.catalog = items.map((item) => {
			// Если цена равна null, устанавливаем selected в true
			if (item.price === null) {
				item.selected = true;
			}
			return new Product(item, this.events);
		});
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	//получение каталога
	getCatalog(): IProductItem[] {
		return this.catalog;
	}
	//получение карточки продукта
	getProduct(id: string): IProductItem {
		return this.catalog.find((item) => item.id === id);
	}

	//добавление товара в корзину
	addItemToBasket(item: Product) {
		this.basket.push(item);
		this.emitChanges('basket:changed', { basket: this.basket });
	}

	//удаление товара из корзины
	removeFromBasket(id: string) {
		this.basket = this.basket.filter((item) => item.id !== id);
		this.emitChanges('basket:changed', { basket: this.basket });
	}

	//очистка корзины
	clearBasket() {
		this.basket = [];
		this.emitChanges('basket:changed', { basket: this.basket });
	}

	//вывод итоговой стоимости
	getTotalPrice() {
		return this.basket.reduce((total, item) => {
			return total + (item.price || 0);
		}, 0);
	}

	//вывод количества товаров находящихся в корзине
	getBasketQuantity() {
		return this.basket.length;
	}

	//вывод товаров находящихся в корзине
	getBasketList(): IProductItem[] {
		return this.basket;
	}

	//методы предназначен для установки значений в объекте заказа order и валидации введенных данных.
	setOrderField(field: keyof IOrderForm, value: string) {
		if (field === 'payment') {
			this.order[field] = value as TPayment;
		} else {
			this.order[field] = value;
		}

		if (this.validateForms()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setContactField(field: keyof IOrderForm, value: string) {
		if (field !== 'payment') {
			this.order[field] = value;
		}

		console.log('state emit: ', field, value);
		if (this.validateForms()) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	// валидация форм
	validateForms() {
		const errors: typeof this.formErrors = {};

		if (!this.order.payment) {
			errors.payment = OrderError.PAYMENT;
		}

		if (!this.order.address) {
			errors.address = OrderError.ADDRESS;
		}

		if (!this.order.email) {
			errors.email = ContactError.EMAIL;
		}

		if (!this.order.phone) {
			errors.phone = ContactError.PHONE;
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	//очистка
	clearOrder() {
		this.order = {
			address: '',
			payment: 'Online',
			email: '',
			total: 0,
			phone: '',
			items: [],
		};
	}
}
