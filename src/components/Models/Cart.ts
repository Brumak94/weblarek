import { IProduct } from '../../types'; 
import { EVENTS } from '../../utils/constants';
import { BaseModel } from './BaseModel';

export class Cart extends BaseModel {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    if (product.price === null || product.price === undefined) {
      return;
    }
    this.items.push(product);
    this.eventBus.emit(EVENTS.CART_CHANGED)
  }

  removeItem(product: IProduct): void {
    const index = this.items.findIndex(item => item.id === product.id);
    if(index !== -1) {
      this.items.splice(index, 1)
    }
    this.eventBus.emit(EVENTS.CART_CHANGED)
  }

  clear(): void {
    this.items = [];
    this.eventBus.emit(EVENTS.CART_CHANGED)
  }

  getTotal(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }

  getItemIds(): string[] {
    return this.items.map(item => item.id);
  }
}