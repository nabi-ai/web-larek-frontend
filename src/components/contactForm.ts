import { Form } from './form';
import { IOrderForm } from '../types';
import { IEvents } from './base/events';

//Класс для управления формой контактов
export class Contacts extends Form<IOrderForm> {
  //Создает экземпляр формы контактов
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  //Устанавливает значение для поля телефона
  set phone(value: string) {
    const phoneInput = this.container.elements.namedItem('phone') as HTMLInputElement;
    phoneInput.value = value;
  }

  //Устанавливает значение для поля email
  set email(value: string) {
    const emailInput = this.container.elements.namedItem('email') as HTMLInputElement;
    emailInput.value = value;
  }

  //Получает текущее значение поля телефона
  get phone(): string {
    return (this.container.elements.namedItem('phone') as HTMLInputElement).value;
  }

  //Получает текущее значение поля email
  get email(): string {
    return (this.container.elements.namedItem('email') as HTMLInputElement).value;
  }
}
