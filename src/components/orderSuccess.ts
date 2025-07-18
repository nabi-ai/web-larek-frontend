import { ISuccessActions, ISuccess } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/component';

//Класс для отображения успешного оформления заказа
export class OrderSuccess extends Component<ISuccess> {
  //Кнопка закрытия окна успешного заказа
  protected closeButton: HTMLElement;

  //Элемент для отображения суммы списания/
  protected totalAmountElement: HTMLElement;

  //Создает экземпляр окна успешного заказа
  constructor(container: HTMLElement, actions?: ISuccessActions) {
    super(container);

    this.closeButton = ensureElement<HTMLElement>('.order-success__close', this.container);
    this.totalAmountElement = ensureElement<HTMLElement>(
      '.order-success__description',
      this.container
    );

    this.setupEventListeners(actions);
  }

  //Настраивает обработчики событий
  private setupEventListeners(actions?: ISuccessActions): void {
    if (actions?.onClick) {
      this.closeButton.addEventListener('click', actions.onClick);
    }
  }

  //Устанавливает сумму списания
  set total(amount: number | string) {
    const formattedAmount = typeof amount === 'number' ? amount.toLocaleString('ru-RU') : amount;

    this.setText(this.totalAmountElement, `Списано ${formattedAmount} синапсов`);
  }
}
