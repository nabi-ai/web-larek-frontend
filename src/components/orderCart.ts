import { Component } from './base/component';
import { createElement, ensureElement } from './../utils/utils';
import { IOrderCart } from '../types';
import { EventEmitter } from './base/events';

//Класс корзины для управления списком товаров и отображением общей суммы
export class OrderCart extends Component<IOrderCart> {
  protected listContainer: HTMLElement;
  button: HTMLButtonElement;
  protected totalPrice: HTMLElement;

  //Создает экземпляр корзины
  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    this.listContainer = ensureElement<HTMLElement>('.basket__list', this.container);
    this.button = this.container.querySelector('.basket__button');
    this.totalPrice = this.container.querySelector('.basket__price');
    if (this.button) this.button.addEventListener('click', () => events.emit('delivery:open-form'));

    this.items = [];
  }

  // Обновляет список товаров в корзине
  set items(items: HTMLElement[]) {
    if (items.length) {
      this.listContainer.replaceChildren(...items);
      this.setDisabled(this.button, false);
    } else {
      this.listContainer.replaceChildren(
        createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' })
      );
    }
  }

  // Обновляет общую сумму корзины
  set total(total: number) {
    this.setText(this.totalPrice, `${total.toString()} синапсов`);
  }
}
