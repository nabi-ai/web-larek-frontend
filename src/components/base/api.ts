export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

//Базовый класс для работы с API
export class Api {
  readonly baseUrl: string;
  protected options: RequestInit;

  //Создает экземпляр API клиента
  constructor(baseUrl: string, options: RequestInit = {}) {
    this.baseUrl = baseUrl;
    this.options = {
      headers: {
        'Content-Type': 'application/json',
        ...((options.headers as object) ?? {}),
      },
    };
  }

  //Обрабатывает HTTP-ответ
  protected handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) return response.json();
    else return response.json().then((data) => Promise.reject(data.error ?? response.statusText));
  }

  //Выполняет GET-запрос
  get<T>(uri: string) {
    return fetch(this.baseUrl + uri, {
      ...this.options,
      method: 'GET',
    }).then<T>(this.handleResponse);
  }

  //Выполняет запрос с отправкой данных (POST, PUT, DELETE)
  post<T>(uri: string, data: object, method: ApiPostMethods = 'POST') {
    return fetch(this.baseUrl + uri, {
      ...this.options,
      method,
      body: JSON.stringify(data),
    }).then<T>(this.handleResponse);
  }
}
