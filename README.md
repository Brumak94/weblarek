# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
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
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

#### Данные
В данном разделе описаны интерфейсы данных и их назначение.

Интерфейсы:

Интерфейс карточки с товаром нужен для учета товаров, которые будут использоваться в приложении.

export interface IProduct {
  id: string;           // Уникальный идентификатор
  description: string;  // Подробное описание товара
  image: string;        // URL изображения
  title: string;        // Название товара
  category: string;     // Категория для фильтрации
  price: number | null; // Цена (может быть null если нет в наличии)
}

Интерфейс покупателя необходим для ввода данных при оформлении заказа товара.

export interface IBuyer {
  payment: TPayment; //Способ оплаты
  email: string;   //Почта покупателя 
  phone: string;   //Номер телефона покупателя 
  address: string; //Адрес доставки покупателя
}

Тип для заказа (для API)
export interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

Ответ от API при успешном заказе
export interface IOrderResult {
  id: string;
  total: number;
}

Тип для оплаты

export type TPayment = 'card' | 'cash' | '';

Тип для ошибок валидации

export type ValidationErrors = Partial<Record<keyof IBuyer, string>>;

#### Модель данных
В данном разделе описаны классы и их методы реализации интерфейсов

Объявление класса для управления корзиной для покупок
export class Cart {
  private items: IProduct[];

  Получаем товары в корзине
  getItems(): IProduct[] {
    return this.items;
  }

  Добавляем товар в корзину
  addItem(product: IProduct): void {
    this.items.push(product);
  }

  Удаляем товар из корзины
  removeItem(product: IProduct): void {
    const index = this.items.findIndex(item => item.id === product.id);
    if(index !== -1) {
      this.items.splice(index, 1)
    }
  }

  Очистка корзины
  clear(): void {
    this.items = [];
  }

  Получение общей стоимости товаров в корзине
  getTotal(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }

  Получаем количество товаров в корзине
  getCount(): number {
    return this.items.length;
  }

  Проверка наличия товара в корзине по его id
  hasItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }

  Метод для получения ID товаров (для API)
  getItemIds(): string[] {
    return this.items.map(item => item.id);
  }
}

Объявление класса для управления каталогом товаров
export class Catalog {
  private products: IProduct[] = [];

  Выбранный товар для подробного рассмотрения
  private selectedProduct: IProduct | null = null;

  Сохранение массива товаров в каталог
  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  Получаем все товары из каталога
  getProducts(): IProduct[] {
    return this.products;
  }

  Поиск товара по ID
  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }

  Сохранение товара при подробном рассмотрении
  setProductDetails(product: IProduct): void {
    this.selectedProduct = product;
  }

  Получение товара при подробном рассмотрении
  getProductDetails(): IProduct | null {
    return this.selectedProduct;
  }
}

Объявление класса для получения данных покупателя
export class Buyer {
  Приватное поле data для хранения данных покупателя
  Partial<IBuyer> означает, что все поля IBuyer являются необязательными
  private data: Partial<IBuyer> = {};

  Сохраняем данные покупателя
  setData(data: Partial<IBuyer>): void {
    this.data = { ...this.data, ...data };
  }

  Получаем все данные покупателя
  getData(): Partial<IBuyer> {
    return this.data;
  }

  Очистка данных покупателя
  clear(): void {
    this.data = {};
  }

  Валидация данных покупателя
  validate(): ValidationErrors {
    Создаем пустой объект для ошибок
    const errors: ValidationErrors = {};

    Проверка поля payment (вид оплаты)
    if (!this.data.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }

    Проверка поля email
    if (!this.data.email || this.data.email.trim() === '') {
      errors.email = 'Укажите email';
    }

    Проверка поля phone
    if (!this.data.phone || this.data.phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }

    Проверка поля address
    if (!this.data.address || this.data.address.trim() === '') {
      errors.address = 'Укажите адрес';
    }

    Возвращаем объект с ошибками
    return errors;
  }

  Проверка на валидность всех данных
  isValid(): boolean {
    return Object.keys(this.validate()).length === 0;
  }
}

#### Слой коммуникации

export class ApiService {
  private api: IApi;

  Конструктор принимает базовый URL и настройки запроса
  constructor(baseUrl: string, options: RequestInit = {}) {
    Создание экземпляра Api с переданными параметрами
    this.api = new Api(baseUrl, options);
  }

  Получение списка товаров с сервера
  async getProducts(): Promise<IProduct[]> {
    Используем метод get из Api для получения товаров
    const response: IProductsResponse = await this.api.get('/product/');
    Возвращаем массив товаров из ответа
    return response.items;
  }

  Отправление заказа на сервер
  async createOrder(order: IOrder): Promise<IOrderResult> {
    Используем метод post из Api для отправки заказа
    const response: IOrderResult = await this.api.post('/order/', order);
    Возвращаем ответ от сервера
    return response;
  }
}