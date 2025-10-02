import {  
  IProduct, 
  IOrder, 
  IOrderResult, 
  IProductsResponse 
} from '../../types';
import { Api } from '../base/Api';

export class ApiService extends Api {
  constructor(baseUrl: string, options: RequestInit = {}) {
    super(baseUrl, options);
  }

  async getProducts(): Promise<IProduct[]> {
    const response: IProductsResponse = await this.get('/product/');
    return response.items;
  }

  async createOrder(order: IOrder): Promise<IOrderResult> {
    const response: IOrderResult = await this.post('/order/', order);
    return response;
  }
}