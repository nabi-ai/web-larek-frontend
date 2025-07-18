import { Form } from './form';
import { IOrderForm } from '../types';
import { ensureAllElements } from '../utils/utils';
import { IEvents } from './base/events';

// Класс для работы с формой заказа
export class Order extends Form<IOrderForm> {
  protected paymentButtons: HTMLButtonElement[]; //Массив кнопок выбора способа оплаты
  private addressInput: HTMLInputElement; //Поле ввода адреса доставки

  //Создает экземпляр формы заказа
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);
    this.addressInput = this.getInputElement('address');

    this.setupPaymentButtons(events);
  }

  //Настраивает обработчики событий для кнопок оплаты
  private setupPaymentButtons(events: IEvents): void {
    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.payment = button.name;
        events.emit('payment:change', {
          name: button.name,
          element: button,
        });
      });
    });
  }

  //Получает элемент input по имени
  private getInputElement(name: string): HTMLInputElement {
    const element = this.container.elements.namedItem(name);
    if (!(element instanceof HTMLInputElement)) {
      throw new Error(`Element ${name} is not an input or not found`);
    }
    return element;
  }

  //Устанавливает выбранный способ оплаты
  set payment(name: string) {
    this.paymentButtons.forEach((button) => {
      const isActive = button.name === name;
      this.toggleClass(button, 'button_alt-active', isActive);

      // Добавляем ARIA-атрибуты для доступности
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  //Получает выбранный способ оплаты
  get payment(): string | undefined {
    const activeButton = this.paymentButtons.find((button) =>
      button.classList.contains('button_alt-active')
    );
    return activeButton?.name;
  }

  // Устанавливает адрес доставки
  set address(value: string) {
    this.addressInput.value = value;
  }

  //Получает текущий адрес доставки
  get address(): string {
    return this.addressInput.value;
  }
}
