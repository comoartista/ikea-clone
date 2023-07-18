document.addEventListener('DOMContentLoaded', () => {
  
let filteredProducts = [];
let selectedItems = []

const productsList = document.querySelector('.productsList');
const searchInput = document.querySelector('.search__input');
const headerBasket = document.querySelector('.header__basket')
const shoppingList = document.querySelector('.shopping-list')
const sum = document.querySelector('.order-summary__price')

// Event listener for search input
searchInput.addEventListener('input', () => {
  productsList.innerHTML = '';
  const inputValue = searchInput.value.toLowerCase();

  const filteredByName = filteredProducts.filter(
    product => product.name.toLowerCase().indexOf(inputValue) >= 0
  );

  createCard(filteredByName);
});

// Function to fetch data from the API
async function fetchData() {
  const url =
    'https://ikea-api.p.rapidapi.com/keywordSearch?keyword=chair&countryCode=de&languageCode=de';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'b5c9718317msh1ac1cb058c518ebp15d7a1jsn62f63efda339',
      'X-RapidAPI-Host': 'ikea-api.p.rapidapi.com',
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    filteredProducts = result;
    if(productsList) { createCard(result) }
    // if (shoppingList) {createCard(result)}
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

// Function to create card elements
function createCard(products) {
  products.forEach(product => {
    const li = document.createElement('li');

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.imageAlt;
    img.classList.add('products-list__img')

    img.addEventListener('mouseover', () => {
      img.src = product.contextualImageUrl;
    });

    img.addEventListener('mouseout', () => {
      img.src = product.image;
    });

    const name = document.createElement('h3');
    name.textContent = product.name;
    name.classList.add('product-list__title')

    const typeName = document.createElement('p');
    typeName.textContent = product.typeName;
    typeName.classList.add('product-list__type-name')

    const price = document.createElement('span');
    
    const currentPrice = document.createElement('span');
    currentPrice.textContent = product.price.currentPrice
    currentPrice.classList.add('product-list__current-price');

    const currency = document.createElement('span'); 
    currency.textContent = product.price.currency
    currency.classList.add('product-list__currency');

    price.append(currentPrice, currency)

    const shopping = document.createElement('div')
    shopping.classList.add('product-list__shopping')

    const shoppingCartIcon = document.createElement('img')
    shoppingCartIcon.src = 'image/icons/basket-add.svg'
    shoppingCartIcon.width = '50'
    shoppingCartIcon.classList.add('product-list__shoppingCartIcon')

    addToBasket(shoppingCartIcon)
    
    const shoppingListIcon = document.createElement('img')
    shoppingListIcon.src = 'image/icons/shopping-list.svg'
    shoppingListIcon.classList.add('product-list__shoppingListIcon')

    shopping.append(shoppingCartIcon, shoppingListIcon)

    const variantsText = document.createElement('p')
    variantsText.textContent = 'Weitere Varianten'
    variantsText.classList.add('product-list__varianten-title')

    const images = product.variants.map(variant => variant.image);
    const variants = document.createElement('div');
    variants.classList.add('product-list__variants')

    images.forEach(image => {
      const variantImage = document.createElement('img');
      variantImage.src = image;
      variantImage.width = '40';

      variants.append(variantImage);
    });


    li.append(img, name, typeName, price, shopping, variantsText, variants);
    productsList.append(li);
  });
}

function addToBasket(item) {
  item.addEventListener('click', (e) => {
    const productIndex = Array.from(productsList.children).findIndex(li => li.contains(item.parentNode));
    const selectedProduct = filteredProducts[productIndex];
    selectedItems.push(selectedProduct);
    console.log('Додано до кошика:', selectedProduct);

    updateCartCount ()
    saveSelectedItemsToLocalStorage();
  }, { 'once': true });
}

function updateCartCount () {
  const cartCount = document.createElement('span')
  cartCount.classList.add('header__cart-count')
  cartCount.textContent = selectedItems.length

  headerBasket.appendChild(cartCount)
}

function saveSelectedItemsToLocalStorage() {
  localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
}

headerBasket.addEventListener('click', () => {
  const queryParams = new URLSearchParams();
  selectedItems.forEach((item, index) => {
    queryParams.append(`item${index + 1}`, JSON.stringify(item));
  });
  const url = `shoppingcart.html?${queryParams.toString()}`;
  window.location.href = url;
});

function loadSelectedItemsFromLocalStorage() {
  const storedItems = localStorage.getItem('selectedItems');
  if (storedItems) {
    selectedItems = JSON.parse(storedItems);
    updateCartCount();
  }
}

// Retrieve the query parameters from the URL
const queryParams = new URLSearchParams(window.location.search);

// Function to decode JSON string from query parameter
function decodeQueryItem(itemString) {
  try {
    return JSON.parse(itemString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}

// Iterate through the query parameters and add the selected items to the page
for (const param of queryParams.entries()) {
  console.log(param[1]); // Log the JSON string to identify the problematic data

  const item = decodeQueryItem(param[1]);
  if (item !== null) {
    const shoppingListItem = document.createElement('li')
    shoppingListItem.classList.add('shopping-list__item')

    const itemImage = document.createElement('img');
    itemImage.src = item.image;
    itemImage.alt = item.imageAlt;
    itemImage.classList.add('shopping-list__img')
    shoppingListItem.appendChild(itemImage);

    const productInform = document.createElement('div')

    const itemName = document.createElement('p');
    itemName.textContent = item.name;
    itemName.classList.add('product__name')
    productInform.appendChild(itemName);

    const typeName = document.createElement('p');
    typeName.textContent = item.typeName;
    typeName.classList.add('type__name')
    productInform.appendChild(typeName);

    const itemPrice = document.createElement('p');
    itemPrice.textContent = `${item.price.currentPrice} / St.`;
    productInform.appendChild(itemPrice);

    const productControls = document.createElement('div')
    productControls.classList.add('productControls')
    const productControlsQuantity = document.createElement('div')
    productControlsQuantity.classList.add('productControls__quantity')

    productInform.appendChild(productControls);

    const input = document.createElement('input')
    input.type = 'text'
    input.value = 0
    input.classList.add('productControls__input')

    const btnMinus = document.createElement('button')
    btnMinus.classList.add('productControls__btn', 'productControls__minus')
    btnMinus.textContent = '-'

    const btnPlus = document.createElement('button')
    btnPlus.classList.add('productControls__btn', 'productControls__plus')
    btnPlus.textContent = '+'

    productControlsQuantity.append(input, btnMinus, btnPlus)

    productControls.appendChild(productControlsQuantity)

    shoppingListItem.append(productInform);
    shoppingList.appendChild(shoppingListItem);
  }
}

loadSelectedItemsFromLocalStorage();
fetchData();
});

// const filterBar = document.querySelector('.filter-bar')

// filterBar.addEventListener('click', (e) => {
//   const filterBarArrows = document.querySelectorAll('.filter-bar__arrow')

//   filterBarArrows.forEach(filterBarArrow => {
//     filterBarArrow.classList.remove('filter-bar__arrow--up')
//   })

//   const filterBarArrow = e.target.querySelector('.filter-bar__arrow')

//   if (filterBarArrow) {
//     filterBarArrow.classList.add('filter-bar__arrow--up')
//   } 
// })