import { Component } from './base/component';
import { ICard, ICartEvents, ICardPreview, ICardBasket, Optional, CardCategory } from '../types';
import { ensureElement } from '../utils/utils';
import { categoryStyles } from '../utils/constants';

//Базовый класс карточки товара
export class Card<T> extends Component<ICard> {
  protected categoryElement: HTMLElement;
  protected titleElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected priceElement: HTMLElement;

  //Соответствие категорий их CSS-классам
  private readonly categoryStyles: Record<CardCategory, string> = categoryStyles;

  //Создает экземпляр карточки товара
  constructor(container: HTMLElement, actions?: ICartEvents) {
    super(container);
    this.categoryElement = container.querySelector('.card__category');
    this.titleElement = ensureElement<HTMLElement>('.card__title', container);
    this.imageElement = container.querySelector('.card__image');
    this.priceElement = ensureElement<HTMLElement>('.card__price', container);

    this.setupEventHandlers(actions);
  }

  private setupEventHandlers(actions?: ICartEvents): void {
    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  //Устанавливает категорию товара
  set category(value: CardCategory) {
    this.setText(this.categoryElement, value);
    const styleClass = this.categoryStyles[value] || '';
    this.categoryElement.className = `card__category card__category_${styleClass}`;
  }

  //Устанавливает название товара
  set title(value: string) {
    this.setText(this.titleElement, value);
  }

  //Устанавливает изображение товара
  set image(value: string) {
    this.setImage(this.imageElement, value, this.titleElement.textContent || '');
  }

  //Устанавливает цену товара
  set price(value: Optional<number>) {
    const priceText = value ? `${value} синапсов` : 'Бесценно';
    this.setText(this.priceElement, priceText);
  }
}

//Класс карточки товара для предпросмотра
//Наследует базовую карточку и добавляет описание и кнопку
export class CardPreview extends Card<ICardPreview> {
  protected descriptionElement: HTMLElement;
  protected actionButton: HTMLElement;

  constructor(container: HTMLElement, actions?: ICartEvents) {
    super(container, actions);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
    this.actionButton = container.querySelector('.card__button');

    this.adjustEventHandlers(actions);
  }

  private adjustEventHandlers(actions?: ICartEvents): void {
    if (actions?.onClick && this.actionButton) {
      this.container.removeEventListener('click', actions.onClick);
      this.actionButton.addEventListener('click', actions.onClick);
    }
  }

  //Устанавливает описание товара
  set text(value: string) {
    this.setText(this.descriptionElement, value);
  }

  set actionButtonDisabled(value: boolean) {
    this.setDisabled(this.actionButton, value);
  }
}

//Класс карточки товара в корзине
//Отображает товар в корзине с возможностью удаления
export class CardBasket extends Component<ICardBasket> {
  protected indexElement: HTMLElement;
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected removeButton: HTMLElement;

  //Создает экземпляр карточки товара в корзине
  constructor(container: HTMLElement, actions?: ICartEvents) {
    super(container);
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
    this.titleElement = ensureElement<HTMLElement>('.card__title', container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', container);
    this.removeButton = container.querySelector('.card__button');

    this.setupButtonHandler(actions);
  }

  private setupButtonHandler(actions?: ICartEvents): void {
    if (actions?.onClick && this.removeButton) {
      this.container.removeEventListener('click', actions.onClick);
      this.removeButton.addEventListener('click', actions.onClick);
    }
  }

  //Устанавливает индекс товара в корзине
  set index(value: number) {
    this.setText(this.indexElement, value.toString());
  }

  //Устанавливает название товара
  set title(value: string) {
    this.setText(this.titleElement, value);
  }

  //Устанавливает цену товара
  set price(value: Optional<number>) {
    const priceText = value ? `${value} синапсов` : 'Бесценно';
    this.setText(this.priceElement, priceText);
  }
}
