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
— презентер, отвечает за связь слоя данных и слоя представления\
Взаимодействия внутри приложения происходят через события.\
Модели инициализируют события,слушатели событий в основном коде
выполняют передачу данных компонентам отображения,а также вычислениями\
между этой передачей, и еще они меняют значения в моделях.

### Базовый код

#### Класс BaseForm
Абстрактный класс для работы с формой, наследуется от класса EventEmmiter,\
имплиментирует интерфейс `IRenderable`\
поля:\
— `_el: HTMLElement`— Хранит HTML элемент, который является клоном\
переданного шаблона (template)\
— `HTMLButtonElement | null` — Хранит кнопку, найденную внутри HTML\
элемента (_el). Если кнопка не найдена, будет null.\
— `formData: T` — Хранит данные формы. Тип T указывает,\
что это обобщенный тип, который определяется при создании экземпляра класса.

Конструктор принимает такие аргументы:\
— `template: HTMLTemplateElement` — темплейт формы\
Методы:\
— `render` — Возвращает HTML элемент _el, представляющий форму.\
— `abstract validate()`- метод для реализации классами наследниками валидации

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый\
адрес сервера и опциональный объект с заголовками запросов.\

поля:\
— `baseUrl` — Базовый URL для API запросов\
— `options: RequestInit` — Опции для настройки запросов.\

Конструктор принимает аргументы:\
— `baseUrl` — Базовый URL для API запросов\
— `options: RequestInit` — Опции для настройки запросов.\
Методы:\
— `handleResponse` - Обрабатывает ответ от API. Если ответ успешный (response.ok равно true), метод возвращает результат в формате JSON. В случае ошибки, метод пытается извлечь сообщение об ошибке из тела ответа (если доступно) и отклоняет промис с этой ошибкой или со статусным текстом ответа.\
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

#### class AppState
Класс является моделью данных в целом, содержит все основные группы данных и методы для работы с ними

поля:\
— `cardCatalog: CardComponent[]` — массив каточек товара\
— `basket: IBasket` — данные хранящихся в корзине\
— `order: IOrder` — данные для отправки на сервер\
— `formErrors: FormErrors` — данные ошибок заполнения форм\

Конструктор принимает аргументы:\??????


методы:\
— `setCardCatalog(item: CardComponent): void` — Добавить карточеку товара\
— `addToBasket(item: CardComponent): void` — Добавить товар в корзину\
— `removeFromBasket(id: string): void` — удалить карточку из корзины\
— `clearBasket(): void` — очистить корзину\
— `getBasketList(): CardComponent[]` — получить список товаров в корзине\
— `getTotalPrice():number` — получить общую стоимость товаров в корзине\
— `getBasketQuantity(): number` — получить колиечтво товаров в корзине\
— `setOrderInfo(order:IOrder): void` — добавить данные заказа\
— `validateDeliveryForm(): boolean` — валидация формы заказа\
— `validateContactForm(): boolean` — валидация формы данных покупателя\
— `clearOrder(): void` — очистка данных заказа\

### Слой представления

#### class ModalComponent + 

Создает модальное окно, на вход принимает HTMLELement контента\
Имплиментирует интерфейс `IRenderable`\
поля:\
— `closeButton:HTMLButtonElement` — кнопка закрытия модального окна\
— `content:HTMLElement` — контент модального окна\

Конструктор принимает аргументы:\
— `container: HTMLElement` — место где модальное окно будет реализовываться\
— `events: IEvents` — объект для работы с событиями

методы:\
— `open(): void` — открытие модального окна\
— `close(): void` — закрытие модального окна
— `setcontent(): void` — метод помещения контента в модальное окно

#### class PageComponent +

Отвечает за отображение элементов на странице: каталог, корзина, счетчик товаров в корзине
Имплиментирует интерфейс `IRenderable`\
поля:\
— `catalog:string` — место куда будет выводиться каталог карточек товара\
— `basket:string` — место куда будет выводиться корзина\
— `basketcounter:string` — место куда будет выводиться колиечтво товара в корзине

Конструктор принимает аргументы:\
— `container:HTMLElement` — место куда будет выводиться колиечтво товара в корзине
— `events: IEvents` — объект для работы с событиями

#### class ProductListComponent 

Создает список превью карточек товаров, отображается на главной странице, на вход принимает массив карт  товара\
Имплиментирует интерфейс `IRenderable`\
поля:\
— `items: CardComponent[]` — массив с карточками товара

Конструктор принимает аргументы:
— `template: HTMLTemplateElement` — темплейт превью карточки
— `events: IEvents` — объект для работы с событиями

методы:\
— `render(data:CardComponent): HTMLElement` — рендер превью карточки\

#### class CardComponent

Принимает item реализующий интерфейс `IProductCard`\
Имплиментирует интерфейс `IRenderable`\
создает базовое представления одной карточки товара\
поля:\
— `title` — заголовок карточки\
— `description` — описание\
— `price` — цена\
— `image` — ссылка на картинку\
— `category` — категория товара

Конструктор принимает аргументы:\??????


#### class BasketComponent

Отвечает за отображение данных списка покупок в модальном окне.\
Имеет возможность удаления позиции из списка.\
Имплиментирует интерфейс `IRenderable`\
поля:\
— `basketitems[]` — массив из карточек товара добавленых в корзину\
— `totalPrice` — итоговая стоимость\

Конструктор принимает аргументы:\??????

методы:\
— `remove` — удаление элемента из массива с покупками\
— `clear` — полная очистка массива с покупками

#### class BasketPreviewComponent

Отвечает за отображение количества товаров в корзине\
Имплиментирует интерфейс `IRenderable`\
поля:\
— `quantity` — число товаров лежащих в корзине

Конструктор принимает аргументы:\??????

#### class DeliveryFormComponent

Наследует класс BaseForm с интерфейсом formData: IDeliveryForm\
Создает элемент формы для модального окна доствки\
поля:\
— `payment` — выбор способа оплаты\
— `deliveryAdress` — поле ввода адреса доставки\

Конструктор принимает аргументы:\??????

методы:\
— `validation` — валидация вводимых данных

#### class ContactFormComponent

Наследует класс BaseForm с интерфейсом formData: IContactForm\
Создает элемент формы для модального окна контактов покупателя\
поля:\
— `email` — поле ввода Email покупателя\
— `phone` — поле ввода телефона покупателя\

Конструктор принимает аргументы:\??????

методы:\
— `validation` — валидация вводимых данных

#### class SuccessComponent
Наследует класс BaseForm с интерфейсом formData: ISuccess\
Имплиментирует интерфейс `IRenderable`\
Отвечает за отображение успешного офрмления покупок в модальном окне\
поля:\
— `isSuccess` — отмечает успешность покупки

Конструктор принимает аргументы:\??????

### Презентер

#### class ProductService

Получает данные от Апи, служит посредником между слоем отображения и слоем данных\

поля:\ ???????????????

Конструктор принимает аргументы:\??????

основные методы:\
— `getList` —  метод получения списка товаров с сервера и передачи его в AppState\
— `getItem` —  метод получения карточки товара с сервера и передачи её в AppState\
— `addItemToBasket` — метод передающий в AppState товар добавленый в корзину

#### class OrderService

поля:\ ???????????????

Конструктор принимает аргументы:\??????

Получает данные от Форм и корзины, служит посредником между слоем отображения и слоем данных\
основные методы:\
— `addBasket` —  добавление данных из корзины\
— `addDevilery` —  добавление данных формы доставки\
— `addContact` —  добавление данных из формы контактов\
— `getBasket` —  получение данных из корзины\
— `getDelivery` —  получение данных из формы доставки\
— `getContacts` —  получение данных из формы контактов\
— `request` —  отправка данных на сервер

#### Класс ProductApi

Наследует класс Api, реализует метод получения карточек товара и взимодействует с сервисом из слоя презентер
основыне поля:
— `cdn:string` — хранит входящий url

Конструктор принимает аргументы:\
— `cdn:string` — хранит входящий url\
— `baseUrl:string` — базовый URL для API запросов.\
— `options?: RequestInit` — опции для настройки запросов\
(необязательный параметр, передается в конструктор базового класса Api).

методы:\
— `getProductCardList():Promise<CardComponent[]>` —  Выполняет GET-запрос для получения списка продуктов,
используя метод get базового класса Api. Затем обрабатывает ответ, который ожидается в формате
ApiListResponse<CardComponent>, и возвращает массив продуктов (`CardComponent[]`).
— `getProductItem(id:string):Promise<CardComponent>` — Выполняет GET-запрос для получения карточки товара,
используя метод get базового класса Api.Аргументом передается id запрашиваемой карточки. Затем обрабатывает 
ответ, который ожидается в формате ApiListResponse<CardComponent>, и возвращает запрашиваемую карточку (`CardComponent`).

#### Класс OrderApi

Наследует класс Api, реализует отправки заказа на сервер и взимодействует с сервисом из слоя презентер
поля:
— `cdn` — хранит входящий url

Конструктор принимает аргументы:\
— `cdn:string` — хранит входящий url\
— `baseUrl:string` — базовый URL для API запросов.\
— `options?: RequestInit` — опции для настройки запросов\
(необязательный параметр, передается в конструктор базового класса Api).

методы:
— `orderProducts(order: IOrder):Promise<OrderResponseModel>` —  Выполняет POST-запрос для создания заказа, 
отправляя данные заказа взятые из слоя представления.
Обрабатывает ответ, который ожидается в формате `OrderResponseModel`, и возвращает этот результат.

Описание взаимодействия:
Метод orderProducts получает данные заказа из слоя представления, что означает, что он не связан с моделями API напрямую. 
Вместо этого он принимает объект типа IOrder, который формируется и предоставляется слоем представления (view layer).
Это отделяет логику представления от логики API, обеспечивая более чистую архитектуру и разделение ответственности.

#### Класс OrderRequestModel

Модель которая описывает Body для Post запроса / Order на сервер и взимодействует с сервисом из слоя презентер

поля:
— `payment: TPayment` — способ оплаты товара
— `email: string` — Email покупателя
— `phone: string` — Телефон покупателя
— `address: string` — Адрес покупателя
— `total: number` — Итоговая стоимость
— `items: string[]` — Массив id купленых товаров

Конструктор принимает аргументы:\??????

#### Класс OrderResponseModel

Модель которая описывает ответ сервера

поля:
— `id: string` — id 
— `total: number` — итоговая стоимость

Конструктор принимает аргументы:\??????

#### Класс ProdutctItemResponseModel

Модель которая описывает ответ сервера возвращающего карточку

поля:
— `id: string` — id карточки
— `description: string` — описание товара
— `image: string` — ссылка 
— `title: string` — описание товара
— `category: CategoryType` — описание товара
— `price: number | null` — описание товара

Конструктор принимает аргументы:\??????

















