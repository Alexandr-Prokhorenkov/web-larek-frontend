export type TPayment = 'Online' | 'Receipt';

export type CategoryType = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';



//Интерфейс модального окна

export interface ModalComponent {
  content: string
  open(): void
  close(): void
  render():void
}

//Интерфейс для размещения контента

export interface PageComponent {
  catalog: string
  basket: string
  basketCounter: number
  render(): void
}

//Интерфейс для списка карточек товаров

export interface CardComponent {
  id: string;
  description: string
  image: string;
  title: string;
  category: CategoryType;
  price: number | null;
}

//Интерфейс для одной карточки товара

export interface ProductListComponent {
  items: CardComponent[];
}


//Интерфейс корзины товаров

export interface BasketComponent {
  basketItems: IOrder
  render(): void
  remove(): void
  clear(): void
}

//Интерфейс показа количества товаров в корзине на главной странице

export interface BasketPreviewComponent {
  basketCounter: HTMLElement
  render(): void
}

//Интерфейс модального окна доставки

export interface DeliveryFormComponent {
  payment: TPayment
  deliveryAdress:string;
}


//Интерфейс модального окна контактов покупателя

export interface ContactFormComponent {
  email:string
  phone: string
}



//Интерфейс моадльного окна успешного завершения покупки 
export interface SuccessComponent {
  isSuccess: boolean
  render(): void
}


//Интерфейс описывающий корзину
export interface IBasket {
  total:number
  items: CardComponent[]
}


//Интерфейс описывающий данные для отправки заказа на сервер
export interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number
  items: CardComponent[]
}

//Интерфейс ошибок заполнения формы

export interface IFormError {
  payment?: TPayment;
  email?: string;
  phone?: string;
  address?: string;
}

// Интерфейс того приходит с сервера после отправки заказа в случае успеха
export interface OrderResponseModel {
  id: string
  total: number
}

//то что мы отправляем на сервер заказ
export interface OrderRequestModel {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}


// Интерфейс данных приложения

export interface AppState {
  cardCatalog: CardComponent[];
  basket: IBasket;
  order:OrderResponseModel
  formError: IFormError;
  setCardCatalog(items:CardComponent[]):void;
  addItemToBasket(item:CardComponent):void;
  removeFromBasket(id:string):void;
  clearBasket(): void;
  getBasketList():CardComponent[];
  getTotalPrice():number;
  getBasketQuantity(): number;
  setOrderInfo():OrderRequestModel
  ValidateDeliveryForm(): boolean;
  ValidateDataForm(): boolean;
  clearOrder(): void;
}

//Интерфейс для метода рендер

export interface IRenderable { render: () => HTMLElement}

//Интерфейс для получения списка карточек товаров

export interface ProcuctApi {
  cdn: string
  getProductCardsList: () => Promise<CardComponent[]>
}

//Интерфейс для отправки заказа на сервер

export interface IOrderApi {
  cdn: string
  orderProducts: (order:OrderRequestModel) => Promise<OrderResponseModel>
}


// Интерфейс для получения данных от Апи, служит посредником между слоем отображения и слоем данных
export interface IProductService {
  getList: () => Promise<CardComponent[]>
  getItem: () => Promise<CardComponent>
  addItemToBasket(item:CardComponent):void;
}

// Интерфейс для получения данных от Форм и корзины, служит посредником между слоем отображения и слоем данных
export interface IOrderService {
  addBasket():void
  addDelivery(): void
  addContacts():void
  getBasket(): string[]
  getDelivery(): DeliveryFormComponent
  getContacts(): ContactFormComponent
  request(): OrderResponseModel
}
