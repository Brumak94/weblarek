import { IProduct } from '../../types'; 

export class Cart {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
  }

  removeItem(product: IProduct): void {
    const index = this.items.findIndex(item => item.id === product.id);
    if(index !== -1) {
      this.items.splice(index, 1)
    }
  }

  clear(): void {
    this.items = [];
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