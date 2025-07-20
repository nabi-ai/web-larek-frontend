import { EventEmitter } from './components/base/events';
import { WebLarekApi } from './components/WebLarekApi';
import { AppState } from './components/AppState';
import { Page } from './components/page';
import { Modal } from './components/modal';
import { OrderCart } from './components/orderCart';
import { Order } from './components/orderForm';
import { Contacts } from './components/contactForm';
import { OrderSuccess } from './components/orderSuccess';
import { Card, CardPreview, CardBasket } from './components/card';

import { IOrderForm, ICardItem, Guid } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';

import {
  modalContentLoadingTemplate,
  cardCatalogTemplate,
  cardPreviewTemplate,
  basketTemplate,
  cardBasketTemplate,
  contactsTemplate,
  orderTemplate,
  successTemplate,
} from './templates';
import './scss/styles.scss';

// Инициализация основных компонентов
const eventBus = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);
const appState = new AppState({}, eventBus);
const page = new Page(document.body, eventBus);

// Инициализация UI компонентов
const modal = new Modal(
  ensureElement<HTMLElement>('#modal-container'),
  modalContentLoadingTemplate,
  eventBus
);
const basket = new OrderCart(cloneTemplate(basketTemplate), eventBus);
const delivery = new Order(cloneTemplate(orderTemplate), eventBus);
const contact = new Contacts(cloneTemplate(contactsTemplate), eventBus);
const success = new OrderSuccess(cloneTemplate(successTemplate), {
  onClick: () => modal.close(),
});

// Обработчики UI событий
eventBus.on('modal:open', () => (page.locked = true));
eventBus.on('modal:close', () => (page.locked = false));

// Обработчики данных приложения
eventBus.on('catalog:update', () => {
  page.catalog = appState.cardList.map((item) => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
      onClick: () => eventBus.emit('product:select', { item }),
    });
    return card.render({
      category: item.category,
      title: item.title,
      image: item.image,
      price: item.price,
    });
  });
});

eventBus.on('product:select', ({ item }: { item: ICardItem }) => {
  appState.showCard(item);
});

eventBus.on('card:show-content', (item: ICardItem) => {
  const preview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      eventBus.emit('product:add', item);
    },
  });
  preview.actionButtonDisabled = item.price === null;
  modal.render({
    content: preview.render({
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category,
    }),
  });
});

// Обработчики корзины
eventBus.on('product:add', (item: ICardItem) => {
  if (!appState.basket.some((basketItem) => basketItem.id === item.id)) {
    appState.addCardToBasket(item.id);
    appState.setCardToBasket(item);
    page.counter = appState.basketList.length;
  }

  modal.close();
});

eventBus.on('cart:open-modal', () => {
  basket.setDisabled(basket.button, appState.statusBasket);
  basket.total = appState.getTotal();

  basket.items = appState.basketList.map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => eventBus.emit('cart:remove-item', item),
    });
    return card.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  modal.render({ content: basket.render() });
});

eventBus.on('cart:remove-item', (item: ICardItem) => {
  appState.deleteCardToBasket(item);
  page.counter = appState.basketList.length;

  basket.setDisabled(basket.button, appState.statusBasket);
  basket.total = appState.getTotal();

  basket.items = appState.basketList.map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => eventBus.emit('cart:remove-item', item),
    });
    return card.render({
      index: index + 1,
      title: item.title,
      price: item.price,
    });
  });

  modal.render({ content: basket.render() });
});

// Обработчики оформления заказа
eventBus.on('delivery:open-form', () => {
  modal.render({
    content: delivery.render({
      payment: '',
      address: '',
      valid: false,
      errors: [],
    }),
  });
  appState.order.items = appState.basket.map((item) => item.id);
});

eventBus.on('payment:change', (item: HTMLButtonElement) => {
  appState.order.payment = item.name;
  appState.validateOrder();
});

eventBus.on(/^delivery\..*:change/, (data: { field: keyof IOrderForm; value: string }) => {
  appState.setOrderField(data.field, data.value);
});

// чистим все поля order при закрытии модалки
eventBus.on('modal:close', () => {
  appState.clearAllOrderData();
});

eventBus.on('validation-errors:change', (errors: Partial<IOrderForm>) => {
  const { email, phone, address, payment } = errors;
  delivery.valid = !address && !payment;
  contact.valid = !email && !phone;
  delivery.errors = Object.values({ address, payment }).filter(Boolean).join('; ');
  contact.errors = Object.values({ phone, email }).filter(Boolean).join('; ');
});

eventBus.on('delivery:submit', () => {
  appState.order.total = appState.getTotal();
  modal.render({
    content: contact.render({
      email: '',
      phone: '',
      valid: false,
      errors: [],
    }),
  });
});

eventBus.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm; value: string }) => {
  appState.setContactsField(data.field, data.value);
});

eventBus.on('contacts:submit', () => {
  const resetBasket = () => {
    appState.clearBasket();
    page.counter = appState.basketList.length;
    eventBus.off('modal:close', resetBasket);
  };

  eventBus.on('modal:close', resetBasket);

  api
    .orderCard(appState.order)
    .then(() => {
      modal.render({
        content: success.render({ total: appState.getTotal() }),
      });
    })
    .catch(console.error);
});

// Инициализация приложения
page.showPageLoading();
api
  .getCardList()
  .then((data) => appState.setCatalog(data.items))
  .catch(console.error);
