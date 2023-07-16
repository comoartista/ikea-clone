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
    'https://ikea-api.p.rapidapi.com/keywordSearch?keyword=chair&countryCode=us&languageCode=en';
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
    img.width = '240';

    img.addEventListener('mouseover', () => {
      img.src = product.contextualImageUrl;
    });

    img.addEventListener('mouseout', () => {
      img.src = product.image;
    });

    const name = document.createElement('h3');
    name.textContent = product.name;

    const typeName = document.createElement('p');
    typeName.textContent = product.typeName;

    const price = document.createElement('span');
    price.textContent = `${product.price.currentPrice} ${product.price.currency}`;
    if (product.price.discounted) {
      price.classList.add('red');
    }

    const images = product.variants.map(variant => variant.image);
    const variants = document.createElement('div');

    images.forEach(image => {
      const variantImage = document.createElement('img');
      variantImage.src = image;
      variantImage.width = '30';
      variants.append(variantImage);
    });

    li.append(img, name, typeName, price, variants);
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

