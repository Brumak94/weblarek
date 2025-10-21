import { EVENTS } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  basketButton: HTMLButtonElement;
  counterElement: HTMLElement;

  constructor(container: HTMLElement, protected eventBus: IEvents) {
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container
    );
    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container
    );

    this.basketButton.addEventListener("click", () => {
      this.eventBus.emit(EVENTS.BASKET_OPEN);
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
