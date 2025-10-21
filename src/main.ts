import "./scss/styles.scss";
import { Cart, Catalog, Buyer } from "./components/Models";
import { IBuyer, IProduct, TPayment, IOrder } from "./types";
import { ApiService } from "./components/Services/ApiService";
import { API_URL, EVENTS } from "./utils/constants";
import { CatalogCard } from "./components/Views/CatalogCard";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Gallery } from "./components/Views/Gallery";
import { EventEmitter } from "./components/base/Events";
import { CardPreview } from "./components/Views/CardPreview";
import { Modal } from "./components/Views/Modal";
import { Header } from "./components/Views/Header";
import { Basket } from "./components/Views/Basket";
import { CardBasket } from "./components/Views/CardBasket";
import { OrderForm } from "./components/Views/OrderForm";
import { ContactForm } from "./components/Views/ContactForm";
import { Success } from "./components/Views/Success";

const apiService = new ApiService(API_URL);
const eventBus = new EventEmitter();
const catalog = new Catalog(eventBus);
const cart = new Cart(eventBus);
const buyer = new Buyer(eventBus);

// Вспомогательная функция для создания элементов корзины
function createBasketItems(products: IProduct[]): HTMLElement[] {
  return products.map((product, index) =>
    new CardBasket(cloneTemplate("#card-basket"), {
      onClick: () => {
        eventBus.emit(EVENTS.BASKET_REMOVE_ITEM, product);
      },
    }).render({ ...product, index: index + 1 })
  );
}

// Вспомогательная функция для определения состояния кнопки товара
function getProductButtonState(product: IProduct, isInCart: boolean): { buttonText: string; buttonDisabled: boolean } {
  if (!product.price) {
    return { buttonText: "Недоступно", buttonDisabled: true };
  }
  if (isInCart) {
    return { buttonText: "Удалить из корзины", buttonDisabled: false };
  }
  return { buttonText: "Купить", buttonDisabled: false };
}

const headerComponent = new Header(ensureElement(".header"), eventBus);
headerComponent.render({
  counter: cart.getCount(),
});

const galleryComponent = new Gallery(document.body);
galleryComponent.render({ catalog: [] });

const modalComponent = new Modal(ensureElement("#modal-container"), eventBus);
eventBus.on(EVENTS.MODAL_CLOSE, () => {
  modalComponent.render({ visible: false });
});

const cardPreviewComponent = new CardPreview(cloneTemplate("#card-preview"), eventBus);

const basketComponent = new Basket(cloneTemplate("#basket"), eventBus);

const orderFormComponent = new OrderForm(cloneTemplate("#order"), eventBus);
const contactFormComponent = new ContactForm(
  cloneTemplate("#contacts"),
  eventBus
);

const successComponent = new Success(cloneTemplate("#success"), eventBus);

// Загружаем товары с сервера
apiService
  .getProducts()
  .then((products) => {
    catalog.setProducts(products);
  })
  .catch((error) => {
    console.error("Ошибка при загрузке товаров:", error);
  });

eventBus.on(EVENTS.CATALOG_CHANGED, () => {
  const products = catalog.getProducts();
  const productCards = products.map((product) => {
    const card = new CatalogCard(cloneTemplate("#card-catalog"), {
      onClick: () => {
        eventBus.emit(EVENTS.PRODUCT_OPEN, { id: product.id });
      },
    });
    return card.render(product);
  });
  galleryComponent.render({ catalog: productCards });
});

eventBus.on<{ id: string }>(EVENTS.PRODUCT_OPEN, ({ id }) => {
  const product = catalog.getProductById(id);
  if (!product) {
    return;
  }
  catalog.setProductDetails(product);
});

eventBus.on(EVENTS.PRODUCT_DETAILS_CHANGED, () => {
  const product = catalog.getProductDetails();
  if (!product) {
    return;
  }
  const { buttonText, buttonDisabled } = getProductButtonState(
    product,
    cart.hasItem(product.id)
  );
  
  modalComponent.render({
    visible: true,
    content: cardPreviewComponent.render({
      ...product,
      buttonDisabled,
      buttonText,
    }),
  });
});

eventBus.on(EVENTS.PRODUCT_ADD, () => {
  const product = catalog.getProductDetails();
  if (!product) {
    return;
  }
  if (cart.hasItem(product.id)) {
    cart.removeItem(product);
  } else {
    cart.addItem(product);
  }
  // Закрываем модальное окно после добавления/удаления товара
  modalComponent.render({ visible: false });
});

eventBus.on(EVENTS.CART_CHANGED, () => {
  headerComponent.render({ counter: cart.getCount() });

  const product = catalog.getProductDetails();
  if (product) {
    const { buttonText, buttonDisabled } = getProductButtonState(
      product,
      cart.hasItem(product.id)
    );
    cardPreviewComponent.render({
      buttonDisabled,
      buttonText,
    });
  }

  const basketProducts = createBasketItems(cart.getItems());

  basketComponent.render({
    list: basketProducts,
    total: cart.getTotal(),
  });
});

eventBus.on(EVENTS.BASKET_OPEN, () => {
  const basketProducts = createBasketItems(cart.getItems());

  const basket = basketComponent.render({
    list: basketProducts,
    total: cart.getTotal(),
  });

  modalComponent.render({ content: basket, visible: true });
});

eventBus.on<IProduct>(EVENTS.BASKET_REMOVE_ITEM, (product) => {
  cart.removeItem(product);
});

eventBus.on(EVENTS.BASKET_ACCEPT, () => {
  const buyerData = buyer.getData();
  const orderForm = orderFormComponent.render({
    buttonDisabled: true,
    payment: buyerData.payment,
  });
  modalComponent.render({ content: orderForm });
});

eventBus.on<{ value: TPayment }>(EVENTS.ORDER_PAYMENT_CHANGED, ({ value }) => {
  const data = buyer.getData();
  buyer.setData({ ...data, payment: value });
});

eventBus.on<Partial<IBuyer>>(EVENTS.BUYER_DATA_CHANGED, (changed) => {
  if (changed.payment !== undefined || changed.address !== undefined) {
    const { payment, address } = buyer.validate();
    orderFormComponent.render({
      payment: changed.payment,
      errors: [payment, address].filter(Boolean).join("; "),
      buttonDisabled: !!payment || !!address,
    });
  }

  if (changed.email !== undefined || changed.phone !== undefined) {
    const { email, phone } = buyer.validate();

    contactFormComponent.render({
      errors: [email, phone].filter(Boolean).join("; "),
      buttonDisabled: !!email || !!phone,
    });
  }
});

eventBus.on<Partial<IBuyer>>(EVENTS.FORM_CHANGED, (data) => {
  const prevData = buyer.getData();
  buyer.setData({ ...prevData, ...data });
});

eventBus.on(EVENTS.ORDER_FORM_ACCEPT, () => {
  modalComponent.render({
    visible: true,
    content: contactFormComponent.render({ buttonDisabled: true }),
  });
});

eventBus.on(EVENTS.CONTACT_FORM_ACCEPT, () => {
  const buyerData = buyer.getData();
  const order: IOrder = {
    payment: buyerData.payment as TPayment,
    email: buyerData.email || '',
    phone: buyerData.phone || '',
    address: buyerData.address || '',
    total: cart.getTotal(),
    items: cart.getItemIds(),
  };

  apiService
    .createOrder(order)
    .then((result) => {
      modalComponent.render({
        visible: true,
        content: successComponent.render({ count: result.total }),
      });
      buyer.clear();
      cart.clear();
    })
    .catch((error) => {
      console.error("Ошибка при оформлении заказа:", error);
      // Можно добавить отображение ошибки пользователю
    });
});

eventBus.on(EVENTS.SUCCESS_FORM_ACCEPT, () => {
  modalComponent.render({ visible: false });
});
