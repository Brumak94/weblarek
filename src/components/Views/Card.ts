import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface ICard {
  title: string;
  price: number | null;
}

export class Card<T extends ICard> extends Component<T> {
  titleElement: HTMLElement;
  priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container
    );
  }

  set title(value:string) {
    this.titleElement.textContent = value
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      value === null || value === undefined ? "Бесценно" : `${value} синапсов`;
  }
}
