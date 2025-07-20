type Optional<T> = T | null;

type Guid = string;

interface IAppState {
  cardList: ICardItem[];
  basket: string[];
  order: Optional<IOrder>;
  preview: Optional<string>;
  formErrors: FormErrors;
}

interface IPage {
  cardList: HTMLElement[];
}

/*--Интерфейсы карточки--*/

//Интерфейс карточки товара на главной страницы
type ICard = Omit<ICardItem, 'description'>;

//Интерфейс карточки товара в превью
interface ICardPreview {
  text: string;
}
//Интерфейс карточки в корзине
interface ICardBasket {
  index: number;
  title: string;
  price: number;
}

//Интерфейс события
interface ICartEvents {
  onClick: (event: MouseEvent) => void;
}

/*--Интерфейсы карточки--*/

//Интерфейс корзины
interface IOrderCart {
  items: HTMLElement[];
  total: number;
}

/*--Интерфейсы заказа--*/

//Интерфейс валидации формы
interface IFormValid {
  valid: boolean;
  errors: string[];
}

//Тип ошибки формы
type FormErrors = Partial<Record<keyof IOrder, string>>;

//Интерффейс формы заказа
interface IOrderForm {
  payment?: string;
  address?: string;
  phone?: string;
  email?: string;
}

//Интерфейс заказа
interface IOrder extends IOrderForm {
  items: string[];
  total: number;
}

//Интерфейс формы успешного заказа
interface ISuccess {
  total: number;
}

//Интерфейс события
interface ISuccessActions {
  onClick: () => void;
}

interface IModalData {
  content: HTMLElement;
}

/*--Интерфейсы апи--*/

type ApiListResponse<Type> = {
  total: number;
  items: Type[];
};

// интерфейс класса WebLarekApi
export interface IWebLarekApi {
  getCardList(): Promise<ApiListResponse<ICard>>;
  getCardItem(id: Guid): Promise<ICard>;
  orderCard(order: IOrder): Promise<IOrderSuccessResponse>;
}

//Интерфейс данных карточки с сервера
interface ICardItem {
  id: Guid;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number | null;
}

interface IOrderSuccessResponse {
  id: Guid;
  total: number;
}

//Тип для категорий карточек товаров
type CardCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export {
  Optional,
  Guid,
  IPage,
  ICardItem,
  ICard,
  ICardPreview,
  ICardBasket,
  ICartEvents,
  ApiListResponse,
  IOrder,
  IOrderSuccessResponse,
  IAppState,
  FormErrors,
  IOrderForm,
  IOrderCart,
  IFormValid,
  ISuccessActions,
  IModalData,
  ISuccess,
  CardCategory,
};
