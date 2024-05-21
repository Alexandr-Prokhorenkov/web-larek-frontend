# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

![UML Shema](https://github.com/Alexandr-Prokhorenkov/web-larek-frontend/blob/main/webLarek.jpg)

## Данные и типы данных, используемые в приложении

Типы для выбора способа оплаты

```
export type TPayment = 'Online' | 'Receipt';

```
Типы для категории товаров

```
export type CategoryType = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';

```

Интерфейс модального окна

```
export interface ModalComponent {
  content: string
  open(): void
  close(): void
  render():void
}

```

Интерфейс для размещения контента

```
export interface PageComponent {
  catalog: string
  basket: string
  basketCounter: number
  render(): void
}

```

Интерфейс для одной карточки товара

```
export interface CardComponent {
  id: string;
  description: string
  image: string;
  title: string;
  category: CategoryType;
  price: number | null;
}

```

Интерфейс для списка карточек товаров

```
export interface ProductListComponent {
  items: CardComponent[];
}

```
Интерфейс корзины товаров

```
export interface BasketComponent {
  basketItems: IOrder
  render(): void
  remove(): void
  clear(): void
}

```
Интерфейс показа количества товаров в корзине на главной странице

```
export interface BasketPreviewComponent {
  quanity: number
  render(): void
}

```
Интерфейс модального окна доставки

```
export interface DeliveryFormComponent {
  payment: TPayment
  deliveryAdress:string;
}

```
Интерфейс модального окна контактов покупателя

```
export interface ContactFormComponent {
  email:string
  phone: string
}

```

Интерфейс моадльного окна успешного завершения покупки 

```
export interface SuccessComponent {
  isSuccess: boolean
  render(): void
}

```

Интерфейс описывающий поля заказа товара

```
export interface IOrder {
  id: string
  total:number
  items: CardComponent[]
}

```

Интерфейс ошибок заполнения формы

```
export interface IFormError {
  payment?: TPayment;
  email?: string;
  phone?: string;
  address?: string;
}

```

Модель того что приходит с сервера после отправки заказа в случае успеха

```
export interface OrderResponseModel {
  id: string
  total: number
}

```

Модель заказа который мы отправляем на сервер

```
export interface OrderRequestModel {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

```
Интерфейс общих данных приложения

```
export interface AppState {
  cardCatalog: CardComponent[];
  basket: IOrder;
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

```

Интерфейс для метода рендер

```
export interface IRenderable { render: () => HTMLElement}

```

Интерфейс для получения списка карточек товаров

```
export interface ProcuctApi {
  cdn: string
  getProductCardsList: () => Promise<CardComponent[]>
}

```

Интерфейс для отправки заказа на сервер

```
export interface IOrderApi {
  cdn: string
  orderProducts: (order:OrderRequestModel) => Promise<OrderResponseModel>
}

```
Интерфейс для получения данных от Апи, служит посредником между слоем отображения и слоем данных

```
export interface IProductService {
  getList: () => Promise<CardComponent[]>
  getItem: () => Promise<CardComponent>
  addItemToBasket(item:CardComponent):void;
}

```

Интерфейс для получения данных от Форм и корзины, служит посредником между слоем отображения и слоем данных

```
export interface IOrderService {
  addBasket():void
  addDelivery(): void
  addContacts():void
  getBasket(): string[]
  getDelivery(): DeliveryFormComponent
  getContacts(): ContactFormComponent
  request(): OrderResponseModel
}

```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:\
— слой представления, отвечает за отображение данных на странице\
— слой данных, отвечает за хранение и изменение данных\
— презентер, отвечает за связь слоя данных и слоя представления

### Базовый код

#### Класс BaseForm
Абстрактный класс управляющий сабмитом форм
- abstract 'submit'\
Создает форму, регистрирует event submit, интерфейс формы\
наследует Evenemitter
Имплиментирует интерфейс `IRenderable`
— `abstract validate()`- метод для реализации классами наследниками валидации

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый\
адрес сервера и опциональный объект с заголовками запросов.\
Методы:\
— `get` - выполняет GET запрос на переданный в парметрах ендпоинт и возвращает 
промис с объектом, которым ответил сервер\
— `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса,и отправляет
эти данные на эндпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST`
запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе.
Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
— `on` - подписка на событие
— `emit` - инициализация события
— `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс ProductApi

Наследует класс Api, реализует метод получения карточек товара и взимодействует с сервисом из слоя презентер
основыне поля:
— `cdn` — хранит входящий url
основные методы:
— `getProductCardList` —  метод получения списка товаров с сервера
— `getProductItem` —  метод получения одной карточки товара с сервера

#### Класс OrderApi

Наследует класс Api, реализует отправки заказа на сервер и взимодействует с сервисом из слоя презентер
основыне поля:
— `cdn` — хранит входящий url
основные методы:
— `orderProducts` —  метод отправки данных заказа на сервер

#### Класс OrderRequestModel

Модель которая описывает Body для Post запроса / Order сервер и взимодействует с сервисом из слоя презентер

#### Класс OrderResponseModel

Модель которая описывает ответ сервера

#### Класс ProdutctItemResponseModel

Модель которая описывает ответ сервера возвращающего карточку


#### class AppState
Класс является моделью данных в целом, содержит все основные группы данных и методы для работы с ними
основыне поля:\
— `cardCatalog` — массив каточек товара\
— `basket` — массив карточек хранящихся в корзине\
— `order` — данные для отправки на сервер\
— `formErrors` — данные ошибок заполнения форм\
основные методы:\
— `setCardCatalog` — Добавить карточеку товара\
— `addToBasket` — Добавить товар в корзину\
— `removeFromBasket` — установить карточку из корзины\
— `clearBasket` — очистить корзину\
— `getBasketList` — получить список товаров в корзине\
— `getTotalPrice` — получить общую стоимость товаров в корзине\
— `getBasketQuantity` — получить колиечтво товаров в корзине\
— `setOrderInfo` — добавить данные заказа\
— `validateDeliveryForm` — валидация формы заказа\
— `validateContactForm` — валидация формы данных покупателя\
— `clearOrder` — очистка данных заказа\

### Слой представления

#### class ModalComponent

Создает модальное окно, на вход принимает HTMLELement контента\
Имплиментирует интерфейс `IRenderable`\
основыне поля:\
— `content` — место где модальное окно будет реализовываться\
основные методы:\
— `open()` — открытие модального окна\
— `close()` — закрытие модального окна

#### class PageComponent

Отвечает за отображение элементов на странице: каталог, корзина, счетчик товаров в корзине
Имплиментирует интерфейс `IRenderable`\
основыне поля:\
— `catalog` — место куда будет выводиться каталог карточек товара\
— `basket` — место куда будет выводиться корзина\
— `basketcounter` — место куда будет выводиться колиечтво товара в корзине

#### class ProductListComponent

Создает список превью карточек товаров, отображается на главной странице, на вход принимает массив карт  товара\
Имплиментирует интерфейс `IRenderable`\
основыне поля:\
— `items[]` — массив с карточками товара

#### class CardComponent

Принимает item реализующий интерфейс `IProductCard`\
Имплиментирует интерфейс `IRenderable`\
создает базовое представления одной карточки товара\
основные поля:\
— `title` — заголовок карточки\
— `description` — описание\
— `price` — цена\
— `image` — ссылка на картинку\
— `category` — категория товара


#### class BasketComponent

Отвечает за отображение данных списка покупок в модальном окне.\
Имеет возможность удаления позиции из списка.\
Имплиментирует интерфейс `IRenderable`\
основные поля:\
— `basketitems[]` — массив из карточек товара добавленых в корзину\
— `totalPrice` — итоговая стоимость\
основные методы:\
— `remove` — удаление элемента из массива с покупками\
— `clear` — полная очистка массива с покупками

#### class BasketPreviewComponent

Отвечает за отображение количества товаров в корзине\
Имплиментирует интерфейс `IRenderable`\
основные поля:\
— `quantity` — число товаров лежащих в корзине

#### class DeliveryFormComponent

Наследует класс BaseForm с интерфейсом formData: IDeliveryForm\
Создает элемент формы для модального окна доствки\
основные поля:\
— `payment` — выбор способа оплаты\
— `deliveryAdress` — поле ввода адреса доставки\
основные методы:\
— `validation` — валидация вводимых данных

#### class ContactFormComponent

Наследует класс BaseForm с интерфейсом formData: IContactForm\
Создает элемент формы для модального окна контактов покупателя\
основные поля:\
— `email` — поле ввода Email покупателя\
— `phone` — поле ввода телефона покупателя\
основные методы:\
— `validation` — валидация вводимых данных

#### class SuccessComponent
Наследует класс BaseForm с интерфейсом formData: ISuccess\
Имплиментирует интерфейс `IRenderable`\
Отвечает за отображение успешного офрмления покупок в модальном окне\
основные поля:\
— `isSuccess` — отмечает успешность покупки

### Презентер

#### class ProductService

Получает данные от Апи, служит посредником между слоем отображения и слоем данных\
основные методы:\
— `getList` —  метод получения списка товаров с сервера и передачи его в AppState\
— `getItem` —  метод получения карточки товара с сервера и передачи её в AppState\
— `addItemToBasket` — метод передающий в AppState товар добавленый в корзину

#### class OrderService

Получает данные от Форм и корзины, служит посредником между слоем отображения и слоем данных\
основные методы:\
— `addBasket` —  добавление данных из корзины\
— `addDevilery` —  добавление данных формы доставки\
— `addContact` —  добавление данных из формы контактов\
— `getBasket` —  получение данных из корзины\
— `getDelivery` —  получение данных из формы доставки\
— `getContacts` —  получение данных из формы контактов\
— `request` —  отправка данных на сервер
















