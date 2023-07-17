let filteredProducts = [];

const productsList = document.querySelector('.productsList');
const searchInput = document.querySelector('.search__input');

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
    createCard(result);
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
    // img.width = '300';

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

// Call the async function to initiate the fetching process
fetchData();




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

