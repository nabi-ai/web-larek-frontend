# Проектная работа "Веб-ларек"
Проект представляет собой интернет-магазин (веб-ларек) с функционалом просмотра товаров, формирования заказа и оформления покупки. Реализован с использованием шаблона проектирования MVP (Model-View-Presenter).

## Используемый стек:

- HTML; 
- SCSS; 
- TS; 
- Webpack;

## Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

## Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды:

- npm install;
- npm run start;
- yarn;
- yarn start;

## Сборка

- npm run build;
- yarn build;

## Архитектура MVP
Приложение построено по архитектуре MVP:
- **Model** (Модель) — отвечает за данные и бизнес-логику.
- **View** (Представление) — отображает пользовательский интерфейс.
- **Presenter** (Презентер) — посредник между Model и View, обрабатывает пользовательские события.

## Базовый код

1. Класс **EventEmitter** - брокер событий. Реализует шаблон издатель-подписчик (Pub/Sub) для управления событиями в приложении. Служит централизованным механизмом взаимодействия компонентов.

   ```
   interface IEvents {
      on<T extends object>(event: EventName, callback: (data: T) => void): void;
      emit<T extends object>(event: string, data?: T): void;
      trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
   }
   ```
   Имеет следующие поля и методы:

   **Поля:**

   - ``events: Map<EventName, Set<Subscriber>>``

   **Методы:**

   - ``on<T extends object>(eventName: EventName, callback: (event: T) => void)`` - Подписаться на событие
   - ``off(eventName: EventName, callback: Subscriber)`` - Отписаться от события
   - ``emit<T extends object>(eventName: string, data?: T)`` - Вызвать событие
   - ``onAll(callback: (event: EmitterEvent) => void)`` - Подписаться на все события
   - ``offAll()`` - Отписаться от всех событий
   - ``trigger<T extends object>(eventName: string, context?: Partial<T>)`` - Создать триггер события

   **Использование:**
 - Для межкомпонентного взаимодействия
 - При обновлении состояния приложения
 - Для обработки пользовательских действий

2. Класс **Api** - Базовый класс для работы с API. Инкапсулирует общую логику HTTP-запросов

   **Особенности:**
 - Базовый класс для API-взаимодействий
 - Обработка ошибок и трансформация ответов
 - Поддержка различных HTTP-методов

   Имеет следующие поля и методы:

   **Поля:**

   - ``baseUrl:string)``
   - ``options:RequestInit``

   **Методы:**

   - ``handleResponse(response: Response): Promise<object>`` - Обрабатывает HTTP-ответ. Успешный ответ - парсим JSON. Ошибочный ответ - пытаемся извлечь сообщение об ошибке
   - ``get(uri: string)`` - Выполняет GET-запрос
   - ``post(uri: string, data: object, method: ApiPostMethods = 'POST')`` - Выполняет запрос с отправкой данных (POST, PUT, DELETE)

3. Класс **Component<T>** - Абстрактный базовый класс для UI-компонентов. Template T - Тип данных, используемых компонентом.
   
    Предоставляет базовые методы для:
     - Управления DOM-элементами
     - Обновления состояния компонента
     - Работы с классами, текстом, изображениями и атрибутами

   От этого класса наследуют все классы отображения(View): 

   - **Page**; 
   - **Card**; 
   - **OrderCart**;
   - **Modal**;
   - **Form**;
   - **SuccessfulForm**;

   Имеет следующие методы:

   **Методы:**

   - ``toggleClass(element: HTMLElement, className: string, force?: boolean)`` - Переключает CSS-класс на элементе
   - ``setText(element: HTMLElement, value: unknown)`` - Устанавливает текстовое содержимое элемента
   - ``setDisabled(element: HTMLElement, state: boolean)`` - Устанавливает состояние disabled для элемента
   - ``setHidden(element: HTMLElement)`` - Скрывает элемент (устанавливает display: none)
   - ``setVisible(element: HTMLElement)`` - Показывает элемент (удаляет display: none)
   - ``setImage(element: HTMLImageElement, src: string, alt?: string)`` - Устанавливает изображение для элемента <img>
   - ``render(data?: Partial): HTMLElement`` - Обновляет состояние компонента и возвращает корневой элемент
   ````````````
    1. Обновляет внутреннее состояние компонента через Object.assign
    2. Возвращает корневой элемент для возможной цепочки вызовов
   ````````````

4. Класс **Model** - Абстрактный базовый класс для моделей данных. Генерирует событие через систему событий приложения. Используется для уведомления других частей приложения об изменениях состояния модели.
   
    Предоставляет базовую функциональность для:
     - Инициализации модели данными
     - Оповещения об изменениях через систему событий
     - Управления состоянием модели

     **Методы:**

 - ``emitChanges(event: string, payload?: object)`` - Оповещает об изменениях в модели

5. Класс **AppState** - Класс состояния приложения. Управляет основным состоянием приложения: каталогом, корзиной, заказом и ошибками форм

   ```
   interface IAppState {
      cardList: ICardItem[];
      basket: string[];
      order: IOrder | null;
      currentCardId: Optional<Guid>;
      formErrors: FormErrors;
   }
   ```
   Имеет следующие поля и методы:

   **Поля:**

   - ``_cardList`` - ICardItem[];
   - ``_basket``- ICardItem[];
   - ``_order``- IOrder;
   - ``currentCardId``- Optional<Guid>;
   - ``_formErrors``- FormErrors;

   **Методы:**
    - ``clearAllOrderData`` - Чистим order
   - ``setOrderField`` - Вывести данные введенные в поле доставки
   - ``setContactsField`` - Вывести данные введенные в поле контакты
   - ``setCatalog`` - Устанавливает каталог товаров и уведомляет об изменении
   - ``showCard`` - Отобразить контент карточки
   - ``addCardToBasket`` - Добавляет товар в заказ (по ID)
   - ``setCardToBasket`` - Вывести карточку в список окна корзины
   - ``get basketList()`` - Возвращает список товаров в корзине
   - ``get statusBasket()`` - Проверяет пуста ли корзина
   - ``set total`` - Устанавливает общую сумму заказа
   - ``getTotal`` - Рассчитывает общую сумму товаров в корзине
   - ``deleteCardToBasket`` - Удаляет товар из корзины
   - ``clearBasket`` - Очищает корзину и сбрасывает список товаров в заказе
   - ``setOrderField`` - Устанавливает значение поля доставки и валидирует форму
   - ``setContactsField`` - Устанавливает значение поля контактов и валидирует форму
   - ``validateOrder`` - Валидирует форму доставки
   - ``validateContacts`` - Валидирует форму контактов
   - ``clearAllOrderData`` - Сбрасывает данные заказа

  Ключевые операции:
   - Добавление/удаление товаров из корзины
   - Валидация данных заказа
   - Управление текущим просматриваемым товаром
   - Расчет итоговой суммы

## Класс WebLarekApi

Класс API для работы с сервером Larek. Расширяет базовый класс Api и реализует специфичный интерфейс IWebLarekApi

**Поля:**

- ``cdn(string)`` - Базовый URL CDN для изображений

**Конструктор:**

constructor(cdn: string, baseUrl: string, options?: RequestInit) //Создает экземпляр API для работы с сервером Larek

**Методы:**

- ``getCardList(): Promise<ICard[]>`` - Получает список всех карточек товаров.
  ````   
     1. Выполняет GET-запрос к /product
     2. Модифицирует URL изображений, добавляя CDN-префикс
     3. Возвращает полный объект ответа с модифицированными карточками
   ````

- ``getCardItem(id: string): Promise<ICard>`` - Получает детальную информацию о карточке товара по ID
   ``````  
      1. Выполняет GET-запрос к /product/{id}
      2. Модифицирует URL изображения, добавляя CDN-префикс
      3. Возвращает модифицированный объект карточки
  ``````
- ``orderCard(order: IOrder): Promise<IOrderResult>`` - Отправляет заказ на сервер
  ````    
     1. Выполняет POST-запрос к /order
     2. Передает данные заказа в теле запроса
     3. Возвращает ответ сервера без модификаций
   ````


## Компоненты(View)

1. Класс **Page** - Класс для управления основной страницей приложения.

  Отвечает за:
   - Отображение каталога товаров
   - Управление корзиной
   - Блокировку прокрутки
   - Индикацию загрузки

     ```
     interface IPage {
        cardList: HTMLElement[];
     }
     ```
     Имеет следующие поля и методы:

     **Поля:**

     - ``basketCounter`` - HTMLElement;
     - ``cardListContainer``- HTMLElement;
     - ``pageWrapper``- HTMLImageElement;
     - ``basketButton``- HTMLElement;
   
     **Конструктор:**

     constructor(container: HTMLElement, events: IEvents) //Создает экземпляр страницы

     **Методы:**

     - ``set counter(value: number | null)`` - Устанавливает количество товаров в корзине
     - ``set catalog(items: HTMLElement[])`` - Обновляет отображение каталога товаров
     - ``set locked(value: boolean)`` - Блокирует/разблокирует прокрутку страницы
     - ``showPageLoading()`` - Показывает состояние загрузки

2. Класс **Card** - Базовый класс карточки товара.

   Отвечает за:
  - Отображение основной информации о товаре
  - Форматирование цены и категории

    ```
    interface ICard {
     categoryElement: HTMLElement; //Элемент отображения категории товара
     titleElement: HTMLElement; //Элемент отображения названия товара
     imageElement: HTMLImageElement; //Элемент отображения изображения товара
     priceElement: HTMLElement; //Элемент отображения цены товара
    }
    ```

     **Конструктор:**

    constructor(container: HTMLElement, actions?: IActions) //Создает экземпляр карточки товара

    **Методы:**

    - ``set category(value: CardCategory)`` - Устанавливает категорию товара
    - ``set title(value: string)`` - Устанавливает название товара
    - ``set image(value: string)`` - Устанавливает изображение товара
    - ``set price(value: number | null)`` - Устанавливает цену товара

    Класс  **CardPreview** - Класс карточки товара для предпросмотра. Наследует базовую карточку и добавляет описание и кнопку

    ```
    interface ICardPreview {
      text: string;
    }  
    ```

    Имеет следующие поля и методы:

    **Поля:**

    - ``_text`` - HTMLElement; //Элемент отображения описания товара
    - ``_button``- HTMLElement; //Кнопка действия (например, "В корзину")

    **Конструктор:**

    constructor(container: HTMLElement, actions?: IActions) //Создает экземпляр карточки предпросмотра

    **Методы:**

    - ``set text(value: string)`` - Устанавливает описание товара
   
    Класс  **CardBasket** - Класс карточки товара в корзине. Отображает товар в корзине с возможностью удаления

    ```
    interface ICardBasket {
      index: number;
      title: string;
      price: number;
    }   
    ```

    Имеет следующие поля и методы:

    **Поля:**

    - ``indexElement`` - HTMLElement; //Элемент отображения индекса товара
    - ``titleElement`` - HTMLElement; //Элемент отображения названия товара
    - ``priceElement`` - HTMLElement; //Элемент отображения цены товара
    - ``removeButton`` - HTMLElement; //Кнопка удаления товара из корзины

    **Конструктор:**

    constructor(container: HTMLElement, actions?: IActions) //Создает экземпляр карточки товара в корзине

    **Методы:**

    - ``set index(value: number)`` - Устанавливает индекс товара в корзине
    - ``set title(value: string)`` - Устанавливает название товара
    - ``set price(value: number | null)`` - Устанавливает цену товара


3. Класс **OrderCart** - Класс корзины для управления списком товаров и отображением общей суммы

  Отвечает за:
  * - Отображение списка товаров в корзине
  * - Подсчет и отображение общей суммы
  * - Управление состоянием кнопки оформления заказа. 

   ```
   interface IOrderCart {
      items: HTMLElement[];
      total: number;
   }
   ```

   Имеет следующие поля и методы:

   **Поля:**

   - ``listContainer`` - HTMLElement;
   - ``button``- HTMLButtonElement;;
   - ``totalPrice``- HTMLElement;

   **Конструктор:**

   constructor(container: HTMLElement, events: EventEmitter)

   **Методы:**

   - ``set items(items: HTMLElement[])`` - Обновляет список товаров в корзине
   - ``set total(price: number)`` - Обновляет общую сумму корзины


4. Класс **Form<T>** - Базовый класс для работы с формами. Template T - Тип данных формы. Создает экземпляр формы, имеет контейнер для отображения ошибок формы и кнопку отправки формы.
  
  Используется для:
   - Ввода данных доставки
   - Выбора способа оплаты
   - Динамической валидации полей

   ```
   interface IFormValid {
	   valid: boolean;
	   errors: string[];
   }
   ```

   Имеет следующие поля и методы:

   **Поля:**

   - ``_submit`` - HTMLButtonElement;
   - ``_errors``- HTMLElement;

   **Конструктор:**

   constructor(protected container: HTMLFormElement, protected events: IEvents) //Создает экземпляр формы

   **Методы:**

   - ``InInputChange`` - Обрабатывает изменение значения в поле ввода
   - ``set valid(value: boolean) `` - Устанавливает состояние валидности формы
   - ``set errors(value: string)`` - Устанавливает текст ошибок формы
   - ``render(state: Partial<T> & IFormValid): HTMLFormElement `` - Обновляет состояние формы

5. Класс **Order** - Класс для работы с формой заказа. Обрабатывает выбор способа оплаты и ввод адреса

   ```
   interface IOrderForm {
	   payment?: string;
	   address?: string;
	   phone?: string;
	   email?: string;
   }
   ```

   Имеет следующие поля и методы:

   **Поля:**

   - ``_buttons`` - HTMLButtonElement;

   **Конструктор:**

   constructor(container: HTMLFormElement, events: IEvents) //Создает экземпляр формы заказа

   **Методы:**

   - ``set payment(name: string)`` - Устанавливает выбранный способ оплаты
   - ``set address`` - Устанавливает адрес доставки
   - ``get payment`` - Получает выбранный способ оплаты
   - ``get address`` - Получает текущий адрес доставки
     
6. Класс **Contacts** - Класс для управления формой контактов. Наследует базовую функциональность формы и добавляет специфичные поля для контактной информации (телефон и email). Используются get и set для получения текущих значений полей

    Используется для:
     - Ввод данных доставки
     - Выбор способа оплаты
     - Динамическая валидация полей

   **Конструктор:**

   constructor(container: HTMLFormElement, events: IEvents) //Создает экземпляр формы контактов

   **Методы:**

   - ``set phone(value: string)`` - Устанавливает значение для поля телефона
   - ``set email(value: string)`` - Устанавливает значение для поля email
   - ``get phone()`` - Получает текущее значение поля телефона
   - ``get email()`` - Получает текущее значение поля email

7. Класс **OrderSuccess** - Класс для отображения успешного оформления заказа. Отображает информацию о списанных средствах и предоставляет кнопку закрытия окна успешного заказа

   ```
   interface ISuccess {
	   total: number;
   }
   ```

    ```
   interface ISuccessActions {
	   onClick: () => void;
   }
   ```
   Имеет следующие поля и методы:

   **Поля:**

   - ``closeButton`` - HTMLElement; - Кнопка закрытия окна успешного заказа
   - ``totalAmountElement``- HTMLElement; - Элемент для отображения суммы списания

   **Конструктор:**

   constructor(container: HTMLElement, actions: ISuccessActions) //Создает экземпляр окна успешного заказа

   **Методы:**

   - ``set total`` - Устанавливает сумму списания

8. Класс **Modal** - Класс для управления модальными окнами. Обеспечивает функциональность открытия/закрытия, отображение контента и состояния загрузки

   ```
   interface IModalData {
	   content: HTMLElement;
   }
   ```

   Имеет следующие поля и методы:
   
   **Поля:**

   - ``_closeButton`` -  HTMLButtonElement;
   - ``_content``- HTMLElement;
   - ``_contentLoading`` - HTMLElement;

   **Конструктор:**

   constructor(container: HTMLElement, events: IEvents)

   **Методы:**

   - ``set content`` - Устанавливает контент в модальное окно
   - ``open`` - Открывает модальное окно
   - ``close`` - Закрывает модальное окно
   - ``render`` - Обновляет и открывает модальное окно с указанным контентом
   - ``renderContentLoading`` - Отображает состояние загрузки в модальном окне

## События:

**Продукты**
---
- ``catalog:update`` - изменение продуктов в каталоге;
- ``product:select`` - выбор карточки;
- ``product:add`` - добавление товара в корзину;
- ``cart:remove-item`` - удаление товара из корзины;
- ``product:preview`` - просмотр деталей товара;

**Корзина**
---
- ``cart:update`` - обновление состояния корзины;
- ``cart:counter-update`` - изменение счетчика товаров;
- ``cart:open-modal`` - открытие окна корзины;

**Оформление**
---
- ``delivery:open-form`` - открытие формы доставки;
- ``payment:method-change`` - смена способа оплаты;
- ``/^delivery\..*:change/`` - изменение данных в форме;
- ``delivery:submit`` - подтверждение доставки;
- ``contacts:submit`` - отправка контактных данных;
- ``validation-errors:change`` - ошибки заполнения форм;

**Модалка**
---
- ``modal:open`` - отображение модального окна;
- ``modal:close`` - скрытие модального окна;
