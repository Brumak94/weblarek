import { TPayment } from "../../types";
import { EVENTS } from "../../utils/constants";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { BaseForm, IBaseForm } from "./BaseForm";

interface IOrderForm extends IBaseForm {
  payment: TPayment;
}

export class OrderForm extends BaseForm<IOrderForm> {
  buttonElement: HTMLButtonElement;
  cardButton: HTMLButtonElement;
  cashButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    eventBus: IEvents
  ) {
    super(container, eventBus);

    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".modal__actions .button",
      this.container
    );
    this.cardButton = ensureElement<HTMLButtonElement>(
      ".order__buttons [name=card]",
      this.container
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      ".order__buttons [name=cash]",
      this.container
    );
    
    const paymentButtons = ensureAllElements<HTMLButtonElement>(
      ".order__buttons .button",
      this.container
    );

    this.buttonElement.addEventListener('click',(e) =>{
      e.preventDefault()
      eventBus.emit(EVENTS.ORDER_FORM_ACCEPT)
    })

    paymentButtons.forEach((el) =>
      el.addEventListener("click", (e) => {
        eventBus.emit(EVENTS.ORDER_PAYMENT_CHANGED, {
          value: (e.target as HTMLButtonElement).name,
        });
      })
    );
  }

  set payment(value: TPayment) {
    this.cashButton.classList.remove("button_alt-active");
    this.cardButton.classList.remove("button_alt-active");
    
    if (value === "card") {
      this.cardButton.classList.add("button_alt-active");
    }
    if (value === "cash") {
      this.cashButton.classList.add("button_alt-active");
    }
  }
}
