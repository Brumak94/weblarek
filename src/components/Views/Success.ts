import { EVENTS } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface ISuccess {
  count: number;
}

export class Success extends Component<ISuccess> {
  descriptionElement: HTMLElement;
  buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, eventBus: IEvents) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container
    );

    this.buttonElement.addEventListener("click", () => {
      eventBus.emit(EVENTS.SUCCESS_FORM_ACCEPT)
    });
  }

  set count(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
