import { Api } from './base/api';
import {
  ApiListResponse,
  Guid,
  ICardItem,
  IOrder,
  IOrderSuccessResponse,
  IWebLarekApi,
} from '../types';

export class WebLarekApi extends Api implements IWebLarekApi {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  // метод для получения данных всех карточек
  async getCardList() {
    const data = await this.get<ApiListResponse<ICardItem>>('/product');

    return {
      ...data,
      items: data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      })),
    };
  }

  // метод для получения данных карточки по id карточки
  async getCardItem(id: Guid) {
    const item = await this.get<ICardItem>(`/product/${id}`);

    return {
      ...item,
      image: this.cdn + item.image,
    };
  }

  // метод для отправки заказа
  async orderCard(order: IOrder) {
    return await this.post<IOrderSuccessResponse>(`/order`, order);
  }
}
