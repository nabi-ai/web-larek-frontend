import { Component } from './base/component';
import { IEvents } from './base/events';
import { IFormValid } from '../types';
import { ensureElement } from '../utils/utils';

//Базовый класс для работы с формами
export class Form<T> extends Component<IFormValid> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  //Создает экземпляр формы
  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.InInputChange(field, value);
    });

    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });
  }

  //Обрабатывает изменение значения в поле ввода
  protected InInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.container.name}.${String(field)}:change`, {
      field,
      value,
    });
  }

  //Устанавливает состояние валидности формы
  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  //Устанавливает текст ошибок формы
  set errors(value: string) {
    this.setText(this._errors, value);
  }

  //Обновляет состояние формы
  render(state: Partial<T> & IFormValid) {
    const { valid, errors, ...inputs } = state;
    super.render({ valid, errors });
    Object.assign(this, inputs);
    return this.container;
  }
}
