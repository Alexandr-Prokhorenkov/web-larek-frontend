import './scss/styles.scss';

import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { OrderApi, ProductApi } from './components/ApiService';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrderForm, OrderRequestModel} from './types/index';
import { EventEmitter } from './components/base/events';
import { AppState, Product } from './components/model/AppState';
import { Page } from './components/view/Page';
import { Modal } from './components/view/Modal';
import { Card, CardPreview } from './components/view/Card';
import { CardBasket, Basket } from './components/view/Basket';
import { FormOrder } from './components/view/FormOrder';
import { FormContacts } from './components/view/FormContacts';
import { ApiListResponse } from './components/base/api';
import { Success } from './components/view/Success'

// Все шаблоны

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const formOrderTempalte = ensureElement<HTMLTemplateElement>('#order');
const formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Генератор событий

const events = new EventEmitter();

// Глобальные контейнеры

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса

const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new FormOrder(cloneTemplate(formOrderTempalte), events);
const contactsForm = new FormContacts(
	cloneTemplate(formContactsTemplate),
	events
);
const success = new Success(cloneTemplate(successTemplate), events);

//получаем данные с сервера

const api = new ProductApi(CDN_URL, API_URL);
const appData = new AppState({}, events);
api.getProductList().then((response) => {
	appData.setCatalog(response);
});

//для отправления заказа на сервер

const orderApi = new OrderApi(CDN_URL, API_URL);

//отображаем карточки товара на странице

events.on('items:changed', () => {
	page.catalog = appData.getCatalog().map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), events, {
			onClick: () => events.emit('carditem:open', item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
			id: item.id,
		});
	});
});

//отображаем отдну карточку при клике

events.on('carditem:open', (data) => {
	const carditem = data as Card;
	const item = appData.getCatalog().find((item) => item.id === carditem.id);
	const cardPreview = new CardPreview(
		cloneTemplate(cardPreviewTemplate),
		events
	);
	modal.render({ content: cardPreview.render(item) });
	page.locked = true;
});

//добавление товара в корзину

events.on('card:addtobasket', (data) => {
	const carditem = data as Card; //вытаскиваем id карточки которую добавили в корзину
	const orderitem = appData
		.getCatalog()
		.find((item) => item.id === carditem.id); //получаем полную информацию о карточке
	orderitem.selected = true;
	appData.addItemToBasket(orderitem as Product); //добавляем карточку в заказ ордер
	page.counter = appData.getBasketList().length;
	modal.close();
});

//открытие модального окна с корзиной

events.on('basket:open', () => {
	const basketArray = appData.getBasketList();
	const cardBasketElements = basketArray.map((item, index) => {
		const cardBasketElement = cloneTemplate(cardBasketTemplate);
		const cardBasket = new CardBasket('card', cardBasketElement, {
			onClick: () => events.emit('basket:delete', item),
		});
		cardBasket.index = index + 1;
		cardBasket.title = item.title;
		cardBasket.price = item.price;
		return cardBasketElement;
	});
	basket.items = cardBasketElements;
	basket.totalPrice = basketArray.reduce(
		(total, item) => total + (item.price || 0),
		0
	);
	modal.render({ content: basket.getContainer() });
	page.locked = true;
});

// удаление товара из корзины

events.on('basket:delete', (item: Product) => {
	appData.removeFromBasket(item.id);
	item.selected = false;
	page.counter = appData.getBasketList().length;
	const basketArray = appData.getBasketList();
	console.log(basketArray);
	basket.totalPrice = basketArray.reduce(
		(total, item) => total + (item.price || 0),
		0
	);
	events.emit('basket:open');
});

// открытие модального окна с формой выбора оплаты и адресом доставки

events.on('orderform:open', () => {
	modal.render({
		content: orderForm.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось состояние валидации форм

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone, address, payment } = errors;
	orderForm.valid = !address && !payment;
	contactsForm.valid = !email && !phone;
	orderForm.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	contactsForm.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей заказа - сохраняем данные об этом

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

// нажимаем на кнопку далее в модальном окне с заполнением способа оплаты и адреса

events.on('order:submit', () => {
	appData.order.total = appData.getTotalPrice();
	modal.render({
		content: contactsForm.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// нажимаем на кнопку оплатить в модальном окне с заполнением email и телефона

events.on('contacts:submit', () => {
	appData.order.items = appData.getBasketList().map((item) => item.id);
	orderApi.orderProduct(appData.order as OrderRequestModel)
	.then((response:any) => {
		events.emit('order:success', response)
		appData.clearBasket()
		appData.clearOrder()
		page.counter = 0
		appData.getCatalog().forEach((item) => {
		if(item.price===null) {
			item.selected = true;
		}
		else {
			item.selected = false;
		}
        
        });
	}).catch(error => console.log(error));
});

// вывод модального окна ушпешной покупки

events.on('order:success', (response: ApiListResponse<string>) => {
	modal.render({
		content: success.render({
			total: response.total
		})
	})
})

events.on('sucess:close', () => {
	modal.close()
})

events.on('modal:close', () => {
	page.locked = false;
});


