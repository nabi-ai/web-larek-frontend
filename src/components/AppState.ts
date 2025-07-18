import { Model } from './base/Model';
import { FormErrors, Guid, IAppState, ICardItem, IOrder, IOrderForm, Optional } from '../types';
import { DELIVERY_ADDRESS_REGEX, EMAIL_REGEX, PHONE_REGEX } from '../utils/constants';

// Общая функция для обработки ошибок
const handleErrors = (errors: any, events: any, formErrors: any) => {
  formErrors = errors;
  events.emit('validation-errors:change', formErrors);
  return Object.keys(errors).length === 0;
};

export class AppState extends Model<IAppState> {
  order: IOrder = { address: '', payment: '', email: '', total: 0, phone: '', items: [] };
  currentCardId: Optional<Guid>;
  cardList: ICardItem[];
  basket: ICardItem[] = [];
  formErrors: FormErrors = {};

  // Чистим order
  clearAllOrderData() {
    this.order = {
      total: 0,
      email: '',
      address: '',
      phone: '',
      items: [],
      payment: '',
    };
  }

  //Вывести данные введенные в поле доставки
  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;
    if (this.validateOrder()) {
      this.events.emit('order:ready', this.order);
    }
  }

  //Вывести данные введенные в поле контакты
  setContactsField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;

    if (this.validateContacts()) {
      this.events.emit('order:ready', this.order);
    }
  }

  // Валидация данных заказа
  validateOrder() {
    const errors: typeof this.formErrors = {};
    const { address, payment } = this.order;

    if (!address) {
      errors.address = 'Необходимо указать адрес';
    } else if (!DELIVERY_ADDRESS_REGEX.test(address)) {
      errors.address = 'Укажите настоящий адрес';
    }

    if (!payment && !errors.address) {
      errors.payment = 'Выберите способ оплаты';
    }

    return handleErrors(errors, this.events, this.formErrors);
  }

  // Валидация контактных данных
  validateContacts() {
    const errors: typeof this.formErrors = {};
    const { email, phone } = this.order;

    if (phone?.startsWith('8')) {
      this.order.phone = `+7${phone.slice(1)}`;
    }

    if (!email) {
      errors.email = 'Необходимо указать email';
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = 'Некорректный адрес электронной почты';
    }

    if (!phone) {
      errors.phone = 'Необходимо указать телефон';
    } else if (!PHONE_REGEX.test(phone)) {
      errors.phone = 'Некорректный формат номера телефона';
    }

    return handleErrors(errors, this.events, this.formErrors);
  }

  //Вывести каталог
  setCatalog(items: ICardItem[]) {
    this.cardList = items;
    this.emitChanges('catalog:update', this.cardList);
  }

  //Отобразить контент карточки
  showCard(item: ICardItem) {
    this.currentCardId = item.id;
    this.emitChanges('card:show-content', item);
  }

  //Добавить товар в заказ
  addCardToBasket(itemId: Guid) {
    this.order.items.push(itemId);
  }

  //Вывести карточку в список окна корзины
  setCardToBasket(item: ICardItem) {
    this.basket.push(item);
  }

  //Вернуть список товара в корзине
  get basketList(): ICardItem[] {
    return this.basket;
  }

  //Вернуть информацию по составу в корзине
  get statusBasket(): boolean {
    return this.basket.length === 0;
  }

  //Вывести сумму заказа
  set total(value: number) {
    this.order.total = value;
  }

  //Вернуть общую сумму заказов
  getTotal() {
    return this.basket.reduce((acc, item) => acc + item.price, 0);
  }

  //Удалить товар из корзины
  deleteCardToBasket(item: ICardItem): void {
    const index = this.basket.findIndex((basketItem) => basketItem.id === item.id);
    if (index >= 0) {
      this.basket.splice(index, 1);
      this.order.items = this.order.items.filter((id) => id !== item.id);
    }
  }

  //Отчистка корзины
  clearBasket() {
    this.basket = [];
    this.order.items = [];
  }
}
