/* Константа для получения полного пути для сервера. Для выполнения запроса 
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`; 
/* Константа для формирования полного пути к изображениям карточек. 
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

export const categoryMap: Record<string, string> = {
  "софт-скил": "soft",
  другое: "other",
  дополнительное: "additional",
  кнопка: "button",
  "хард-скил": "hard",
};

export const settings = {

};

export const EVENTS = {
  PRODUCT_OPEN: "product:open",
  PRODUCT_ADD: "product:add",
  PRODUCT_DETAILS_CHANGED: "product_details:changed",
  BASKET_OPEN: "basket:open",
  BASKET_REMOVE_ITEM: "basket:remove_item",
  BASKET_ACCEPT: "basket:accept",
  FORM_CHANGED: "form:changed",
  CART_CHANGED: "cart:changed",
  CATALOG_CHANGED: "catalog:changed",
  ORDER_PAYMENT_CHANGED: "order:payment_changed",
  ORDER_FORM_ACCEPT: "order:form_accept",
  CONTACT_FORM_ACCEPT: "contact:form_accept",
  SUCCESS_FORM_ACCEPT: "success:form_accept",
  BUYER_DATA_CHANGED: "buyer:data_changed",
  MODAL_CLOSE: "modal:close"
};