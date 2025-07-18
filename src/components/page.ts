import { Component } from './base/component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IPage } from '../types';

//Класс для управления основной страницей приложения
export class Page extends Component<IPage> {
  //Элемент счетчика товаров в корзине
  protected basketCounter: HTMLElement;

  //Контейнер для списка карточек товаров
  protected cardListContainer: HTMLElement;

  //Основной wrapper страницы для управления прокруткой
  protected pageWrapper: HTMLElement;

  //Кнопка/иконка корзины
  protected basketButton: HTMLElement;

  //Создает экземпляр страницы
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
    this.cardListContainer = ensureElement<HTMLElement>('.gallery');
    this.pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
    this.basketButton = ensureElement<HTMLElement>('.header__basket');

    this.initEventListeners();
  }

  //Инициализирует обработчики событий
  private initEventListeners(): void {
    this.basketButton.addEventListener('click', () => {
      this.events.emit('cart:open-modal');
    });
  }

  //Показывает состояние загрузки
  showPageLoading(): void {
    this.setText(this.cardListContainer, 'Загрузка...');
  }

  //Устанавливает количество товаров в корзине
  set counter(value: number) {
    this.setText(this.basketCounter, String(value));
  }

  //Обновляет отображение каталога товаров
  set catalog(items: HTMLElement[]) {
    this.cardListContainer.replaceChildren(...items);
  }

  //Блокирует/разблокирует прокрутку страницы
  set locked(value: boolean) {
    this.toggleClass(this.pageWrapper, 'page__wrapper_locked', value);
  }
}
