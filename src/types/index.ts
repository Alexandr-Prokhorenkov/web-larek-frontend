export type TPayment = 'Online' | 'Receipt';

export type CategoryType = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';



//Интерфейс модального окна

export interface ModalComponent {
  closeButton:HTMLButtonElement
  content:HTMLElement
  open(): void
  close(): void
  setcontent(): void
  render():void
}

//Интерфейс для размещения контента

export interface PageComponent {
  catalog: HTMLElement
  basket: HTMLElement
  basketCounter: HTMLElement
  render(): void
}

//Интерфейс для списка карточек товаров

export interface CardsListComponent {
  category: HTMLElement
  title: HTMLElement
  image: HTMLElement
  totalPrice: HTMLElement
}

//Интерфейс для одной карточки товара

export interface CardComponent extends CardsListComponent {
  description: HTMLElement
  button: HTMLElement
}

//Интерфейс корзины товаров

export interface BasketComponent {
  basketList: HTMLElement
  title: HTMLElement
  total:HTMLElement
  button:HTMLButtonElement
  container: HTMLElement  
  render(): void
  remove(): void
  clear(): void
}


//Интерфейс модального окна доставки

export interface DeliveryFormComponent {
  formDelivery: HTMLFormElement;
  buttonAll: HTMLButtonElement[];
  paymentSelection: String;
  formErrors: HTMLElement;
  render(): HTMLElement;
}

//Интерфейс модального окна контактов покупателя

export interface ContactFormComponent {
 formContacts: HTMLFormElement;
  inputAll: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;
  render(): HTMLElement;
}


//Интерфейс моадльного окна успешного завершения покупки 
export interface SuccessComponent {
  total: HTMLElement
  container: HTMLElement
}


export interface IProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

//Интерфейс описывающий корзину
export interface IBasket {
  total:number
  items: IProductItem[]
}


//Интерфейс описывающий данные для отправки заказа на сервер
export interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number
  items: IProductItem[]
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
