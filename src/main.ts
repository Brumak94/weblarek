import './scss/styles.scss';
import { Cart, Catalog, Buyer } from './components/Models';
import { apiProducts } from './utils/data';
import { IProduct } from './types';
import { ApiService } from './components/Services/ApiService';
import { API_URL } from './utils/constants';


const apiService = new ApiService(API_URL);
const catalog = new Catalog();
const cart = new Cart();
const buyer = new Buyer();

console.log('=== Тестирование Catalog ===');

// Сохранение товаров из API
catalog.setProducts(apiProducts.items as IProduct[]);
console.log('Товары в каталоге:', catalog.getProducts());

// Поиск товара по ID
const product = catalog.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('Найденный товар:', product);

// Сохранение товара для подробного рассмотрения
if (product) {
  catalog.setProductDetails(product);
  console.log('Товар для подробного рассмотрения:', catalog.getProductDetails());
}

// Тестирование Корзины
console.log('\n=== Тестирование Cart ===');

// Добавление товаров в корзину
if (product) {
  cart.addItem(product);
  const secondProduct = catalog.getProductById('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');
  if (secondProduct) {
    cart.addItem(secondProduct);
  }
}

console.log('Товары в корзине:', cart.getItems());
console.log('Количество товаров:', cart.getCount());
console.log('Общая стоимость:', cart.getTotal());
console.log('Есть ли товар с ID 854cef69...:', cart.hasItem('854cef69-976d-4c2a-a18c-2aa45046c390'));

// Тестирование данных Покупателя
console.log('\n=== Тестирование Buyer ===');

// Заполнение данных частично
buyer.setData({
  email: 'test@test.ru',
  phone: '+71234567890'
});

console.log('Данные покупателя (частично):', buyer.getData());

// Заполнение остальных данных
buyer.setData({
  address: 'Spb Vosstania 1',
  payment: 'online'
});

console.log('Данные покупателя (полностью):', buyer.getData());

// Проверка валидации
const errors = buyer.validate();
console.log('Ошибки валидации:', errors);
console.log('Данные валидны:', buyer.isValid());

// Тестируем очистку
buyer.clear();
console.log('Данные после очистки:', buyer.getData());

// Функция для загрузки товаров с сервера
async function loadProducts() {
  try {
    console.log('Загружаем товары с сервера...');
    
    // Получаем товары с сервера через ApiService
    const products = await apiService.getProducts();
    
    // Сохраняем товары в каталог
    catalog.setProducts(products);
    
    console.log('Товары успешно загружены:');
    console.log('Количество товаров:', catalog.getProducts().length);
    
    // Проверяем работу поиска по ID
    if (products.length > 0) {
      const product = catalog.getProductById(products[0].id);
      console.log('Найден товар по ID:', product);
    }
    
  } catch (error) {
    // Ошибки уже обрабатываются в классе Api через handleResponse
    console.error('Не удалось загрузить товары:', error);
  }
}

// Инициализируем приложение
loadProducts();