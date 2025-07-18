import { Component } from './base/component';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { IModalData } from '../types';

//Класс для управления модальными окнами
export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected _contentLoading: HTMLElement;

  //Создает экземпляр модального окна
  constructor(
    container: HTMLElement,
    contentLoadingTemplate: HTMLTemplateElement,
    protected events: IEvents
  ) {
    super(container);

    // Инициализация элементов модального окна
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this._content = ensureElement<HTMLElement>('.modal__content', container);
    this._contentLoading = cloneTemplate(contentLoadingTemplate);

    this._closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));
    this._content.addEventListener('click', (event) => event.stopPropagation());
  }

  //Устанавливает контент в модальное окно
  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  //Открывает модальное окно
  open() {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  //Закрывает модальное окно
  close() {
    this.container.classList.remove('modal_active');
    this.content = null;
    this.events.emit('modal:close');
  }

  //Обновляет и открывает модальное окно с указанным контентом
  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }

  //Отображает состояние загрузки в модальном окне
  renderContentLoading() {
    super.render({ content: this._contentLoading });
    this.open();
    return this.container;
  }
}
