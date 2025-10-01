import { IBuyer, ValidationErrors } from '../../types';

export class Buyer {
  private data: Partial<IBuyer> = {};

  setData(data: Partial<IBuyer>): void {
    this.data = { ...this.data, ...data };
  }

  getData(): Partial<IBuyer> {
    return this.data;
  }

  clear(): void {
    this.data = {};
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