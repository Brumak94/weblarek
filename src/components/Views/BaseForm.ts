import { EVENTS } from "../../utils/constants";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IBaseForm {
  errors: string;
  buttonDisabled: boolean;
}

export abstract class BaseForm<T extends IBaseForm = IBaseForm> extends Component<T> {
  errorsElement: HTMLElement;
  inputElements: HTMLInputElement[];
  buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, eventBus: IEvents) {
    super(container);

    this.errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container
    );

    this.inputElements = ensureAllElements<HTMLInputElement>(
      ".form input",
      this.container
    );

    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".modal__actions .button",
      this.container
    );

    this.inputElements.forEach((input) => {
      input.addEventListener("input", (e) => {
        const target = e.target as HTMLInputElement;

        eventBus.emit(EVENTS.FORM_CHANGED, { [target.name]: target.value });
      });
    });
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  }

}
