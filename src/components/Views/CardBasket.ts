import { ensureElement } from "../../utils/utils";
import { Card, ICard } from "./Card";

export interface ICardBasket extends ICard {
  index: number;
}

interface ICardBasketActions {
  onClick: (ev: Event) => void;
}

export class CardBasket extends Card<ICardBasket> {
  indexElement: HTMLElement;
  removeBtnElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ICardBasketActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container
    );
    this.removeBtnElement = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );

    this.removeBtnElement.addEventListener("click", actions.onClick);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
