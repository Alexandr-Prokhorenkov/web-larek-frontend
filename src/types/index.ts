export type TPayment = 'Online' | 'Receipt';

export type CategoryType = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';


//Интерфейс описывающий данные карточки 
export interface IProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  selected: boolean
}

//Интерфейс карточек добавленых в корзину
export interface ICardBasket {
	index: number;
	title: string;
	price: string | null;
}

//Интерфейс событий
export interface IActions {
	onClick: (event: MouseEvent) => void;
}

//интерфейс для данных форм 
export interface IOrderForm {
  payment?: TPayment;
  address?: string;
  email?: string;
  phone?: string;
  total?: string | number;
}

//интерфейс данных заказа для AppState
export interface IOrder extends IOrderForm {
  items: string[];
}

//то что мы отправляем на сервер заказ
export interface OrderRequestModel extends IOrderForm {
  items: string[];
  total: number
}

//Интерфейс ошибок заполнения формы !
export interface IFormError {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Интерфейс того приходит с сервера после отправки заказа в случае успеха
export interface OrderResponseModel {
  id: string
  total: number
}

// Интерфейс данных приложения 
export interface IAppState {
  setCatalog(items:IProductItem[]):void;
  getCatalog(): IProductItem[];
  getProduct(id:number): IProductItem;
  addItemToBasket(item:IProductItem):void;
  removeFromBasket(id:string):void;
  clearBasket(): void;
  getTotalPrice():number;
  getBasketQuantity(): number;
  getBasketList():IProductItem[];
  setOrderField(field: keyof IOrderForm, value: string): void;
  validateOrder(): boolean;
  clearOrder(): void;
}

