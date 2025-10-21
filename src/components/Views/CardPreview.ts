import { EVENTS } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { CatalogCard, ICatalogCard } from "./CatalogCard";

interface ICardPreview extends ICatalogCard {
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export class CardPreview extends CatalogCard<ICardPreview> {
  descriptionElement: HTMLElement;
  buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, eventBus: IEvents) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );

    this.buttonElement.addEventListener("click", () => {
      eventBus.emit(EVENTS.PRODUCT_ADD);
    });
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value
  }
}
