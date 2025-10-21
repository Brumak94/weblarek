import { IBuyer, ValidationErrors } from '../../types';
import { EVENTS } from '../../utils/constants';
import { BaseModel } from './BaseModel';

export class Buyer extends BaseModel {
  private data: Partial<IBuyer> = {};

  setData(data: Partial<IBuyer>): void {
    const changed: Partial<IBuyer> = {};
    
    (Object.keys(data) as Array<keyof IBuyer>).forEach((key) => {
      if (data[key] !== this.data[key]) {
        changed[key] = data[key] as never;
      }
    });
    
    this.data = { ...this.data, ...data };
    this.eventBus.emit(EVENTS.BUYER_DATA_CHANGED, changed);
  }

  getData(): Partial<IBuyer> {
    return this.data;
  }

  clear(): void {
    const prev = this.data
    this.data = {};
    this.eventBus.emit(EVENTS.BUYER_DATA_CHANGED, prev)
  }

  validate(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!this.data.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }

    if (!this.data.email || this.data.email.trim() === '') {
      errors.email = 'Укажите email';
    }

    if (!this.data.phone || this.data.phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }

    if (!this.data.address || this.data.address.trim() === '') {
      errors.address = 'Укажите адрес';
    }
    return errors;
  }

  isValid(): boolean {
    return Object.keys(this.validate()).length === 0;
  }
}