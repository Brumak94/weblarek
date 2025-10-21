import { EVENTS } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { BaseForm, IBaseForm } from "./BaseForm";

interface IContactForm extends IBaseForm {

}

export class ContactForm extends BaseForm<IContactForm> {
  buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, eventBus: IEvents) {
    super(container, eventBus);

    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".modal__actions .button",
      this.container
    );

    this.buttonElement.addEventListener("click", (e) => {
      e.preventDefault()
      eventBus.emit(EVENTS.CONTACT_FORM_ACCEPT)
    });
  }
}
