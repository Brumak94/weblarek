import { IProduct } from "../../types";
import { EVENTS } from "../../utils/constants";
import { BaseModel } from "./BaseModel";

export class Catalog extends BaseModel{
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.eventBus.emit(EVENTS.CATALOG_CHANGED)
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }

  setProductDetails(product: IProduct): void {
    this.selectedProduct = product;
    this.eventBus.emit(EVENTS.PRODUCT_DETAILS_CHANGED) 
  }

  getProductDetails(): IProduct | null {
    return this.selectedProduct;
  }
}
