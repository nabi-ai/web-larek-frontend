# Проектная работа "Веб-ларек"

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

## Сборка:
 - npm run build;
 - yarn build;

## Реализация
Данное приложение было реализовано с помощью архитектуры MVP:
 - **Model** - модель данных;
 - **View** - модель отображения интерфейса;
 - **Presenter** - связующая модель;

## Базовый код

1. Класс **EventEmitter** - брокер событий. Данный класс выполняет роль Presenterа в системе MVP.

    ```
    interface IEvents {
        on<T extends object>(event: EventName, callback: (data: T) => void): void;
        emit<T extends object>(event: string, data?: T): void;
        trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
    }
    ```

    Имеет следующие *поля* и *методы*:

    **Поля:**
    - ``events: Map<EventName, Set<Subscriber>>``

    **Методы:**
    - ``on<T extends object>(eventName: EventName, callback: (event: T) => void)`` - принимает событие и колбек функцию, если событие нет создает его.
    - ``off(eventName: EventName, callback: Subscriber)`` - принимает событие и колбек функцию, удаляет подписку на событие. Если подписки нет, удаляет событие.
    - ``emit<T extends object>(eventName: string, data?: T)`` - принимает событие и данные, инициирует событие с данными.
    - ``onAll(callback: (event: EmitterEvent) => void)`` - принимает колбек, подписывает на все событие.
    - ``offAll()`` - сбрасывает все обработчики.
    - ``trigger<T extends object>(eventName: string, context?: Partial<T>)`` - принимает событие, возвращает функцию триггера генерирующий событие при вызове.

2. Класс **Api** - класс по работе с Апи. Это абстрактный класс (не имеющий экземпляров), его наследником является класс WebLarekApi.

    Имеет следующие *поля* и *методы*:

    **Поля:**
     - ``baseUrl:string``
     - ``options:RequestInit``

    **Методы:**
    - ``handleResponse(response: Response): Promise<object>`` - обработчик ответа сервера. Принимает ответ и возвращает его, если ответа нет возвращает ошибку.
    - ``get(uri: string)`` - примает путь и возвращает ответ сервера.
    - ``post(uri: string, data: object, method: ApiPostMethods = 'POST')`` - принимает путь и данные, возвращает ответ сервера.

    Класс **WebLarekApi** - класс отправляет информацию на сервер и возвращает ответ сервера. Наследуется от класса Api и имеет следующие поля и методы.

    **Поля:**
     - ``cdn(string)`` - Базовый URL

    **Конструктор:**
     - ``constructor(cdn: string, baseUrl: string, options?: RequestInit)``

    **Методы:**
    - ``getCardList(): Promise<ICard[]>`` - получение списка всех карточек с сервера
    - ``getCardItem(id: string): Promise<ICard>`` - получение данных карточки по id
    - ``orderCard(order: IOrder): Promise<IOrderResult>`` - возврат данных по заказу

3. Класс **Component** - абстрактный класс, нужен для работы с DOM элементами.

    От этого класса наследуют все классы отображения(View):
    - ``Page;``
    - ``Card;``
    - ``Basket;``
    - ``Modal;``
    - ``Form;``
    - ``SuccessfulForm;``

    Имеет следующие *методы*:

    - ``toggleClass(element: HTMLElement, className: string, force?: boolean)`` - переключает классы.
    - ``setText(element: HTMLElement, value: unknown)`` - устанавливает текстовое поле.
    - ``setDisabled(element: HTMLElement, state: boolean)`` - меняет статус блокировки.
    - ``setHidden(element: HTMLElement)`` - скрывает элемент.
    - ``setVisible(element: HTMLElement)`` - показывает элемент.
    - ``setImage(element: HTMLImageElement, src: string, alt?: string)`` - устанавливает изображение с альтернативным текстом.
    - ``render(data?: Partial): HTMLElement`` - возвращает корневой DOM элемент.

4. Класс **Model** - абстрактный класс модели данных, его наследником является класс AppState.

    **Методы:**
     - ``emitChanges(event: string, payload?: object)`` - сообщает, что модель изменилась.

    Класс **AppState** - класс управления состоянием проекта (списка карточек, корзины, заказов и форм). Наследуется от класса Model

    ```
    interface IAppState {
        cardList: ICardItem[];
        basket: string[];
        order: IOrder | null;
        preview: string | null;
        formErrors: FormErrors;
    }
    ```

    Имеет следующие *методы*:

    **Поля:**
     - ``_cardList - ICardItem[];``
     - ``_basket- ICardItem[];``
     - ``_order- IOrder;``
     - ``_preview- string | null;``
     - ``_formErrors- FormErrors;``

    **Методы:**
     - ``setCatalog`` - устанавливает список карточек.
     - ``setPreview`` - устанавливает предпросомотр карточек.
     - ``addCardToBasket`` - добавляет товар в заказ.
     - ``setCardToBasket`` - добавляет товар в корзину.
     - ``basketList`` - вернуть список товара в корзине.
     - ``statusBasket`` - вернуть информацию по составу в корзине.
     - ``total`` - вывести сумму заказа.
     - ``getTotal`` - вернуть общую сумму заказов.
     - ``deleteCardToBasket`` - удалить товар из корзины.
     - ``setOrderField`` - Вывести данные введенные в поле доставки.
     - ``setContactsField`` - Вывести данные введенные в поле контакты.
     - ``validateOrder`` - Валидация введенных данных.
     - ``validateContacts`` - Валидация введенных формы котактов.
     - ``clearOrder`` - отчистка заказа.

    ```
    interface ICardItem {
        id: string;
        title: string;
        description: string;
        category: string;
        image: string;
        price: number | null;
    }
    ```

## Компоненты

1. Класс **Page** - формирование главной страницы. Наследуется от класса *Component*

    ```
    interface IPage {
        cardList: HTMLElement[];
    }
    ```

    Имеет следующие *поля* и *методы*:

    **Поля:**
     - ``_counterBasket`` - HTMLElement;
     - ``_cardList``- HTMLElement;
     - ``_wrapper``- HTMLImageElement;
     - ``_basket``- HTMLElement;

    **Конструктор:**
     - ``constructor(container: HTMLElement, events: IEvents)``

    **Методы:**
     - ``set counter(value: number | null)`` - изменить счетчик товара в корзине на главной странице.
     - ``set catalog(items: HTMLElement[])`` - вывести список карточек.
     - ``set locked(value: boolean)`` - установка или снятие блока прокрутки страницы.

2. Класс **Card** - описание карточки товара. Наследуется от класса *Component*. Имеет двух наследников *CardPreview* и *CardBasket*

    ```
    interface ICard {
        category: string;
        title: string;
        description: string;
        image: string;
        price: number;
    }
    ```

    Имеет следующие *поля* и *методы*:

    **Поля:**
     - ``_category`` - HTMLElement;
     - ``_title``- HTMLElement;
     - ``_image``- HTMLImageElement;
     - ``_price``- HTMLElement;
     - ``_colors``- <Record<string, string>

    **Конструктор:**
     - ``constructor(container: HTMLElement, actions?: IActions)``

    **Методы:**
     - ``set category(value: string)`` - принимает строку с сервера, устанавливает категорию.
     - ``set title(value: string)`` - принимает строку с сервера, устанавливает заголовок.
     - ``set image(value: string)`` - принимает строку с сервера, устанавливает изображение.
     - ``set price(value: number)`` - принимает номер с сервера, устанавливает цену.

3. Класс **CardPreview** - описание карточки товара в превью . Наследуется от класса *Card*.

    ```
    interface ICardPreview {
        text: string;
    }  
    ```

    Имеет следующие *поля* и *методы*:

    **Поля:**
     - ``_text`` - HTMLElement;
     - ``_button`` - HTMLElement;

    **Конструктор:**
     - ``constructor(container: HTMLElement, actions?: IActions)``

    **Методы:**
     - ``set text(value: string)`` - принимает строку с сервера, устанавливает текст.

4. Класс **CardBasket** - описание карточки товара в превью . Наследуется от класса *Card*.

    ```
    interface ICardBasket {
        index: number;
        title: string;
        price: number;
    }   
    ```

    Имеет следующие *поля* и *методы*:

    **Поля:**
     - ``_index`` - HTMLElement;
     - ``_title`` - HTMLElement;
     - ``_price`` - HTMLElement;
     - ``_button`` - HTMLElement;

    **Конструктор:**
     - ``constructor(container: HTMLElement, actions?: IActions)``

    **Методы:**
     - ``set index(value: number)`` - принимает номер, устанавливает индекс.
     - ``set title(value: string)`` - принимает строку, устанавливает текст.
     - ``set price(value: number | null)`` - принимает номер, устанавливает цену.

5. Класс **Basket** - описание корзины. Наследует класс *Component*

    ```
    interface IBasket {
        items: HTMLElement[];
        total: number;
    }
    ```

    Имеет следующие *поля* и *методы*:

    **Поля:**
     - ``_list`` - HTMLElement;
     - ``button`` - HTMLButtonElement;
     - ``_total`` - HTMLElement;

    **Конструктор:**
     - ``constructor(container: HTMLElement, events: EventEmitter)``

    **Методы:**
     - ``set items(items: HTMLElement[])`` - вставить данные в корзину.
     - ``set total(price: number)`` - посчитать общую стоимость товара.

6. Класс **Form<T>** - класс для работы с формами. Наследуется от класса *Component*. Имеет двух наследников *Order* и *Contacts*

    ```
    interface IFormValid {
        valid: boolean;
        errors: string[];
    }
    ```

    Имеет следующие *поля* и *методы*:

    **Поля**:
     - ``_submit`` - HTMLButtonElement;
     - ``_errors ``- HTMLElement;

    **Конструктор**:
     - ``constructor(protected container: HTMLFormElement, protected events: IEvents)``

    **Методы**:
     - ``InInputChange`` - обработчик событий ввода.
     - ``set valid`` - контролирует активность кнопки отправки в зависимости от валидности формы.
     - ``set errors`` - устанавливает и отображает ошибки валидации формы.
     - ``render`` - показывает состояние формы.

7. Класс **Order** - отображение модального окна заполнения адреса. Наследуется от класса *Form*

    ```
    interface IOrderForm {
        payment?: string;
        address?: string;
        phone?: string;
        email?: string;
        total?: string | number;
    }
    ```

    Имеет следующие *поля* и *методы*:

    **Поля:**
     - ``_buttons`` - HTMLButtonElement;

    **Конструктор:**
     - ``constructor(container: HTMLFormElement, events: IEvents)``

    **Методы:**
     - ``set payment(name: string)`` - переключение между кнопками.
     - ``set address`` - ввод адреса доставки.

8. Класс **Contacts** - отображение модального окна заполнения почты и телефона. Наследуется от класса *Form*

    ```
    class Contacts extends Form<IOrderForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	} 
    ```

    **Конструктор:**
     - ``constructor(container: HTMLFormElement, events: IEvents)``

    **Методы:**
     - ``set phone`` - ввод телефона.
     - ``set email`` - ввод почты.

9. Класс **Success** - отображение модального удачного заказа. Наследуется от класс *Component*

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

    Имеет следующие *поля* и *методы*:

    **Поля:**
     - ``_close`` - HTMLElement;
     - ``_total`` - HTMLElement;

    **Конструктор:**
     - ``constructor(container: HTMLElement, actions: ISuccessActions)``

    **Методы:**
     - ``set total`` - устанавливет текст в элемент.

10. Класс **Modal** - класс для работы с модальным окном. Наследуется от класса *Component*

    ```
    interface IModalData {
        content: HTMLElement;
    }
    ```

    Имеет следующие *поля* и *методы*:

    **Поля:**
     - ``_closeButton`` - HTMLButtonElement;
     - ``_content`` - HTMLElement;

    **Конструктор:**
     - ``constructor(container: HTMLElement, events: IEvents)``

    **Методы:**
     - ``set content`` - определяет контент показа в модальном окне.
     - ``open`` - открывает модальное окно.
     - ``close`` - закрывает модальное окно.
     - ``render`` - рендерит модальное окно.

## События:

### Карточка:
- ``items:changed`` - изменение продуктов в каталоге
- ``card:select`` - выбор карточки;
- ``card:add`` - добавление карточки в корзину;
- ``card:remove`` - удаление карточки из корзины;
- ``preview:changed`` - открытие окна карточки;

### Корзина
- ``basket:changed`` - изменение корзины;
- ``counter:changed`` - изменение счетчика;
- ``basket:open`` - открытие модального окна корзины;

### Формы заказа
- ``order:open`` - открытие модального окна адреса доставки;
- ``payment:toggle`` - изменение способа оплаты;
- ``/^order\..*:change/`` - изменение поля формы доставки;
- ``order:submit`` - отправка формы доставки;
- ``contacts:submit`` - отправка формы контактов;
- ``formErrors:change`` - списки ошибок;

### Модальное окно
- ``modal:open`` - открытие модального окна;
- ``modal:close`` - закрытие модального окна;