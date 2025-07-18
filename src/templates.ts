import { ensureElement } from './utils/utils';

// темплейт состояния загрузки контента модалки
const modalContentLoadingTemplate = ensureElement<HTMLTemplateElement>('#modal-content-is-loading');
// темплейт каталога
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
// темплейт карточки
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
// темплейт корзины
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
// темплейт карточек внутри корзины
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
// темплейт контактов
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
// темплейт формы заказа
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
// темплейт успешного заказа
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

export {
  modalContentLoadingTemplate,
  cardCatalogTemplate,
  cardPreviewTemplate,
  basketTemplate,
  cardBasketTemplate,
  contactsTemplate,
  orderTemplate,
  successTemplate,
};
