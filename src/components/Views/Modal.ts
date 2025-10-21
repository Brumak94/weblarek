import { EVENTS } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IModal {
  content: HTMLElement;
  visible?: boolean;
}

export class Modal extends Component<IModal> {
  contentElement: HTMLElement;
  closeBtnElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected eventBus: IEvents) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container
    );
    this.closeBtnElement = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );

    this.closeBtnElement.addEventListener("click", () => {
      eventBus.emit(EVENTS.MODAL_CLOSE)
    });

    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) {
        eventBus.emit(EVENTS.MODAL_CLOSE);
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  set visible(value: boolean) {
    this.container.classList.toggle("modal_active", value);
    document.body.style.overflow = value ? "hidden" : "";
  }
}
