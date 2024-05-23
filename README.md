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
  closeButton:HTMLButtonElement
  content:HTMLElement
  open(): void
  close(): void
  setcontent(): void
  render():void
}

```

Интерфейс для размещения контента

```
export interface PageComponent {
  catalog: HTMLElement
  basket: HTMLElement
  basketCounter: HTMLElement
  render(): void
}

```

Интерфейс для списка карточек товаров

```
export interface CardsListComponent {
  category: HTMLElement
  title: HTMLElement
  image: HTMLElement
  totalPrice: HTMLElement
}
```

Интерфейс для списка карточки товара

```
export interface CardComponent extends CardsListComponent {
  description: HTMLElement
  button: HTMLElement
}


```
Интерфейс корзины товаров

```
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

```
Интерфейс модального окна доставки

```
export interface DeliveryFormComponent {
  formDelivery: HTMLFormElement;
  buttonAll: HTMLButtonElement[];
  paymentSelection: String;
  formErrors: HTMLElement;
  render(): HTMLElement;
}

```
Интерфейс модального окна контактов покупателя

```
export interface ContactFormComponent {
 formContacts: HTMLFormElement;
  inputAll: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;
  render(): HTMLElement;
}

```

Интерфейс моадльного окна успешного завершения покупки 

```
export interface SuccessComponent {
  total: HTMLElement
  container: HTMLElement
}

```

Интерфейс описывающий данные карточки

```
export interface IProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}


```

Интерфейс описывающий корзину

```
export interface IBasket {
  total:number
  items: IProductItem[]
}

```

Интерфейс описывающий данные для отправки заказа на сервер

```
export interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number
  items: IProductItem[]
}

```

Интерфейс данных формы доставки

```
export interface IDeliveryForm {
   payment: TPayment
   deliveryAdress:string;
}

```
Интерфейс данных формы контактов

```
export interface IContactForm {
    email:string
    phone: string
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

Интерфейс того приходит с сервера после отправки заказа в случае успеха

```
export interface OrderResponseModel {
  id: string
  total: number
}

```

Интерфейс того что мы отправляем на сервер заказ

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
Интерфейс данных приложения

```
export interface AppState {
  Products: IProductItem[];
  basket: IBasket;
  order:OrderResponseModel
  formError: IFormError;
  setCardCatalog(items:IProductItem[]):void;
  addItemToBasket(item:IProductItem):void;
  removeFromBasket(id:string):void;
  clearBasket(): void;
  getBasketList():IProductItem[];
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
  getList: () => Promise<IProductItem[]>
  getItem: () => Promise<IProductItem>
  addItemToBasket(item:IProductItem):void;
}

```

Интерфейс для получения данных от Форм и корзины, служит посредником между слоем отображения и слоем данных

```
export interface IOrderService {
  addBasket():void
  addDelivery(): void
  addContacts():void
  getBasket(): string[]
  getDelivery(): IDeliveryForm
  getContacts(): IContactForm
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

1. Загружаются данные в AppSate из procuctService
2. создаем класс Апстейт 
3. Создаем класс который отрисовывает страницу в него передаем апстейт что бы он выхывал какие то методы


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
— `render()` — Возвращает HTML элемент _el, представляющий форму.\
— `abstract validate()`- метод для реализации классами наследниками валидации

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый\
адрес сервера и опциональный объект с заголовками запросов.\

поля:\
— `baseUrl:string` — Базовый URL для API запросов\
— `options: RequestInit` — Опции для настройки запросов.\

Конструктор принимает аргументы:\
— `baseUrl:string` — Базовый URL для API запросов\
— `options: RequestInit` — Опции для настройки запросов.\
Методы:\
— `handleResponse(response: Response): Promise<object>` - Обрабатывает ответ от API. Если ответ успешный (response.ok равно true), метод возвращает результат в формате JSON. В случае ошибки, метод пытается извлечь сообщение об ошибке из тела ответа (если доступно) и отклоняет промис с этой ошибкой или со статусным текстом ответа.\
— `get(uri: string)` - выполняет GET запрос на переданный в парметрах ендпоинт и возвращает 
промис с объектом, которым ответил сервер\
— `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - принимает объект с данными, которые будут переданы в JSON в теле запроса,и отправляет эти данные на эндпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST`запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе.\
Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.\
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

— `on` - для подписки на событие.\
— `off` - для отписки от события.\
— `emit` - уведомления подписчиков о наступлении события соответственно.\
— `onAll` - для подписки на все события.\
— `offAll` - сброса всех подписчиков.\
— `trigger` - генерирует заданное событие с заданными аргументами. Это позволяет\
передавать его в качестве обработчика события в другие классы.\
Эти классы будут генерировать события, не будучи при этом напрямую\
зависимыми от класса EventEmitter.

### Слой данных

#### class AppState
Класс является моделью данных в целом, содержит все основные группы данных и методы для работы с ними

поля:\
— `cardCatalog: IProductItem[]` — массив каточек товара\
— `basket: IBasket` — данные хранящихся в корзине\
— `order: OrderRequestModel` — данные для отправки на сервер\
— `formErrors: FormErrors` — данные ошибок заполнения форм\

Конструктор принимает аргументы:\
— `products: IProductItem[]` — Базовый URL для API запросов\
— `events: IEvents` — объект для работы с событиями


методы:\
— `setCardCatalog(item: IProductItem): void` — Добавить карточеку товара\
— `addToBasket(item: IProductItem): void` — Добавить товар в корзину\
— `removeFromBasket(id: string): void` — удалить карточку из корзины\
— `clearBasket(): void` — очистить корзину\
— `getBasketList(): IProductItem[]` — получить список товаров в корзине\
— `getTotalPrice():number` — получить общую стоимость товаров в корзине\
— `getBasketQuantity(): number` — получить колиечтво товаров в корзине\
— `setOrderInfo(order:OrderRequestModel): void` — добавить данные заказа\
— `validateDeliveryForm(): boolean` — валидация формы заказа\
— `validateContactForm(): boolean` — валидация формы данных покупателя\
— `clearOrder(): void` — очистка данных заказа

### Слой представления

#### class ModalComponent

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

#### class PageComponent

Отвечает за отображение элементов на странице: каталог, корзина, счетчик товаров в корзине
Имплиментирует интерфейс `IRenderable`\
поля:\
— `catalog: HTMLElement` — место куда будет выводиться каталог карточек товара\
— `basket: HTMLElement` — место куда будет выводиться корзина\
— `basketCounter: HTMLElement` — место куда будет выводиться колиечтво товара в корзине

Конструктор принимает аргументы:\
— `container:HTMLElement` — место где будет реализован сам Page
— `events: IEvents` — объект для работы с событиями

методы:
— `set counter(value: number): void ` — устанавливает значение в счетчике товаров корзины
— `set catalog(items:HTMLElement[])` — устанавливает каталог

#### class CardsListComponent 

Создает список превью карточек товаров, отображается на главной странице, на вход принимает массив карт  товара\
Имплиментирует интерфейс `IRenderable`\
поля:\
  `category: HTMLElement` — разметка категории карточки товара
  `title: HTMLElement` — разметка заголовка карточки товара
  `image: HTMLElement` — разметка изображения товара
  `totalPrice: HTMLElement` — разметка итоговой стоимость

Конструктор принимает аргументы:
— `template: HTMLTemplateElement` — Шаблон карточки карточки, на основе которого будет создан новый элемент.
— `events: IEvents` — объект для работы с событиями

методы:\
— `render(data:CardComponent): HTMLElement` — рендер превью карточки\
— `set catelory(value:CategoryType): void` — устанавливает содердимое категории
— `set title(value: string): void` — устанавливает содержимое заголовка
— `set image(value: string): void` — устанавливает содержимое картинки
— `set totalPrice(value: string): void` — устанавливает содержимое итоговой стоимости

#### class CardComponent
Наследует класс CardsListComponent
Создает базовое представление одной карточки товара.
Имплиментирует интерфейс `IRenderable`\
поля:\
— `description: HTMLElement` — разметка описания\
— `button: HTMLButtonElement` — разметка для кнопки \

Конструктор принимает аргументы:
— `template: HTMLTemplateElement` — Шаблон карточки товара, на основе которого будет создан новый элемент.
— `events: IEvents` — объект для работы с событиями

методы:\
— `set description(value: string): void` — рендер превью карточки\
— `addItemToBasket(value: string): void` — рендер превью карточки\

#### class CardBasket

Отвечает за отображение данных списка покупок в корзине
Имплиментирует интерфейс `IRenderable`\
поля:\

— `basketItem: HTMLElement` — Хранит элемент корзины покупок
— `index: HTMLElement` — Хранит разметку порядкового номера
— `title: HTMLElement` — разметка заголовка\
— `buttonDelete: HTMLButtonElement` — разметка для кнопки удаления\
— `price: HTMLElement` — разметка цены\


Конструктор принимает аргументы:
— `template: HTMLTemplateElement` — Шаблон элемента корзины, на основе которого будет создан новый элемент.
— `events: IEvents` — объект для работы с событиями

методы:\
— `set title(value: string): void` — установка заголовка\
— `set index(value: number): void` — установка порядкового номера\
— `set price(value: number): void` — установка цены \

#### class Basket

Отвечает за отображение корзины в модальном окне. 
Имплиментирует интерфейс `IRenderable`\

поля:\
— `basket: HTMLElement` — корневой элемент корзины, клонированный из шаблона.
— `basketlist: HTMLElement` — разметку обертки списка товаров
— `total: HTMLElement` — хранит разметку для суммы товаров
— `button: HTMLButtonElement` — хранит разметку кнопки перехода на шаг оформления заказа
— `headerBasketButton: HTMLButtonElement` — хранит список товаров в корзине
— `headerBasketCounter: HTMLElement;` — Счетчик количества товаров в заголовке страницы.

Конструктор принимает аргументы:
— `template: HTMLTemplateElement` — темплейт превью корзины
— `events: IEvents` — объект для работы с событиями

методы:\
— `set items(items: HTMLElement[]): void` — Обновляет список товаров в корзине
— `renderHeaderBasketCounter(value: number): void` — установка значения суммы товаров
— `renderSumAllProducts(sumAll: number)` — Обновляет текстовое содержимое общей стоимости товаров в корзине


#### class DeliveryFormComponent

Наследует класс BaseForm с интерфейсом formData: DeliveryFormComponent\
Создает элемент формы для модального окна доствки\
поля:\
— `formDelivery: HTMLFormElement` — HTML-элемент формы заказа, клонированный из переданного шаблона.
— `buttonAll: HTMLButtonElement[]` — Массив всех кнопок выбора способа оплаты
— `buttonSubmit: HTMLButtonElement` — Кнопка отправки формы заказа.
— `formErrors: HTMLElement` — Элемент для отображения ошибок формы.

Конструктор принимает аргументы:
— `template: HTMLTemplateElement` — темплейт с формой
— `events: IEvents` — объект для работы с событиями

методы:\
— `set payment(payment:TPayment)` — устанавливает класс активности на кнопку
— `set address(value:string): void` — устанавливает класс активности на кнопку

#### class ContactFormComponent

Наследует класс BaseForm с интерфейсом formData: IContactForm\
Создает элемент формы для модального окна контактов покупателя\
поля:\
  — `formContacts: HTMLFormElement` — HTML-элемент формы контактов, клонированный из переданного шаблона.
  — `inputAll: HTMLInputElement[]` — Массив всех полей ввода
  — `buttonSubmit: HTMLButtonElement` — Кнопка отправки формы.
  — `formErrors: HTMLElement` — Элемент для отображения ошибок формы.

Конструктор принимает аргументы:
— `template: HTMLTemplateElement` — темплейт с формой 
— `events: IEvents` — объект для работы с событиями

методы:\
— `set phone(value: string): void` — устанавливает значение телефона
— `set address(value:string): void` — устанавливает значение адреса


#### class SuccessComponent
Наследует класс BaseForm с интерфейсом formData: ISuccess\
Имплиментирует интерфейс `IRenderable`\
Отвечает за отображение успешного офрмления покупок в модальном окне\
поля:\
— `total: HTMLElement` — разметка общей суммы товаров в заказе
— `close: HTMLElement` — разметка кнопки закрытия окна

Конструктор принимает аргументы:
— `container: HTMLElement` — темплейт превью корзины
— `events: IEvents` — объект для работы с событиями

методы:\
— ` set total(value: string): void` —  установка значения общей суммы


### Презентер

#### class ProductService

Получает данные от Апи, служит посредником между слоем отображения и слоем данных\

поля:\
— `products: IProductItem[]` —  список карточек товаров\

основные методы:\
— `getList():IProductItem[]` —  метод получения списка товаров с сервера и передачи его в AppState\
— `getItem():IProductItem` —  метод получения карточки товара с сервера и передачи её в AppState\
— `addItemToBasket(id:string):void` — метод передающий в AppState товар добавленый в корзину

#### class OrderService

Получает данные от Форм и корзины, служит посредником между слоем отображения и слоем данных\

поля:\
— `order: IOrder` —  список карточек товаров\

основные методы:\
— `addBasket(basket: IBasket): void` —  добавление данных из корзины\
— `addDevilery(delivery:IDeliveryForm): void` —  добавление данных формы доставки\
— `addContact(constacts: IContactForm): void` —  добавление данных из формы контактов\
— `getBasket(): IBasket` —  получение данных из корзины\
— `getDelivery(): IDeliveryForm` —  получение данных из формы доставки\
— `getContacts(): IContactForm` —  получение данных из формы контактов\
— `request(order: OrderRequestModel)` —  отправка данных на сервер

### Дополнительные классы

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
— `getProductCardList():Promise<IProductItem[]>` —  Выполняет GET-запрос для получения списка продуктов,\
используя метод get базового класса Api. Затем обрабатывает ответ, который ожидается в формате\
ApiListResponse<IProductItem>, и возвращает массив продуктов (`IProductItem[]`).\
— `getProductItem(id:string):Promise<IProductItem>` — Выполняет GET-запрос для получения карточки товара,\
используя метод get базового класса Api.Аргументом передается id запрашиваемой карточки. Затем обрабатывает\
ответ, который ожидается в формате ApiListResponse<IProductItem>, и возвращает запрашиваемую карточку (`IProductItem`).

#### Класс OrderApi

Наследует класс Api, реализует отправки заказа на сервер и взимодействует с сервисом из слоя презентер
поля:
— `cdn` — хранит входящий url

Конструктор принимает аргументы:\
— `cdn:string` — хранит входящий url\
— `baseUrl:string` — базовый URL для API запросов.\
— `options?: RequestInit` — опции для настройки запросов\
(необязательный параметр, передается в конструктор базового класса Api).

методы:\
— `orderProducts(order: IOrder):Promise<OrderResponseModel>` —  Выполняет POST-запрос для создания заказа, 
отправляя данные заказа взятые из слоя представления.
Обрабатывает ответ, который ожидается в формате `OrderResponseModel`, и возвращает этот результат.

Описание взаимодействия:\
Метод orderProducts получает данные заказа из слоя представления, что означает, что он не связан с моделями API напрямую. 
Вместо этого он принимает объект типа IOrder, который формируется и предоставляется слоем представления (view layer).
Это отделяет логику представления от логики API, обеспечивая более чистую архитектуру и разделение ответственности.

#### Класс OrderRequestModel

Модель которая описывает Body для Post запроса / Order на сервер и взимодействует с сервисом из слоя презентер

поля:\
— `payment: TPayment` — способ оплаты товара\
— `email: string` — Email покупателя\
— `phone: string` — Телефон покупателя\
— `address: string` — Адрес покупателя\
— `total: number` — Итоговая стоимость\
— `items: string[]` — Массив id купленых товаров


#### Класс OrderResponseModel

Модель которая описывает ответ сервера

поля:\
— `id: string` — id\
— `total: number` — итоговая стоимость


#### Класс ProdutctItemResponseModel

Модель которая описывает ответ сервера возвращающего карточку

поля:\
— `id: string` — id карточки\
— `description: string` — описание товара\
— `image: string` — ссылка\ 
— `title: string` — описание товара\
— `category: CategoryType` — описание товара\
— `price: number | null` — описание товара

#### Описание событий

`items:changed` —  Инициируется при изменении списка товаров и вызывает перерисовку
списка товаров на странице.\
`card:toBasket` — Инициируется при клике на кнопку "В корзину" на карточке CardComponent
В AppState добавляет товар в корзину, обновляет счётчик на корзине в классе Page\
`basket:open` — Инициируется при клике на кнопку "корзина" и открывает модальное окно
с классом Basket, где отображаются товары добавленные в корзину\
`basket:delete` — Инициируется при клике на кнопку удаления товара в корзине\ 
— Удаляет товар из массива basket в классе AppState\
— Обновляет счётчик корзины на странице\
— Обновляет сумму заказа в корзине\
— Обвновляет порядковые номера в списке корзины\
`basket:order` — Инициируется при клике на кнопку "Оформить" в корзине открывает окно с формой для
заполнения адреса и способа оплаты\
`order:submit` —  Инициируется при нажатии на кнопку "Оплатить" на стадии заполнения телефона
    и электронной почты в окошке ContactFormComponent\
`orderInput:change` — Инициируется при вводе данных в форму окошка DeliveryFormComponent и совершает
    процесс валидации формы, возвращает ошибки формы\
`orderFormErrors:change` —  Инициируется при вводе данных в форму окошка ContactFormComponent и совершает
    процесс валидации формы, возвращает ошибки формы\
`order:success` — Инициируется при успешном ответе сервера при оплате товара
    Открывает модальное окно сообщающее об успешной оплате\
`modal:close` — Инициируется при клике на кнопку закрытия модального окна
    или при клике на свободное место вокруг модального окна




  


















