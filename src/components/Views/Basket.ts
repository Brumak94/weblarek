import { EVENTS } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
  list: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {
  listElement: HTMLElement;
  totalElement: HTMLElement;
  buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, eventBus: IEvents) {
    super(container);

    this.listElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container
    );
    this.totalElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );

    this.buttonElement.addEventListener("click", () => {
      eventBus.emit(EVENTS.BASKET_ACCEPT)
    });
  }

  set list(value: HTMLElement[]) {
    if (value.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'Корзина пуста';
      emptyMessage.style.textAlign = 'center';
      emptyMessage.style.color = '#888';
      emptyMessage.style.padding = '2rem';
      this.listElement.replaceChildren(emptyMessage);
    } else {
      this.listElement.replaceChildren(...value);
    }
    this.buttonElement.disabled = !value.length
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }
}
