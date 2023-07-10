async function fetchData() {
  const url = 'https://ikea-api.p.rapidapi.com/keywordSearch?keyword=chair&countryCode=us&languageCode=en';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'b5c9718317msh1ac1cb058c518ebp15d7a1jsn62f63efda339',
      'X-RapidAPI-Host': 'ikea-api.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    createCard(result)
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
fetchData(); // Call the async function to initiate the fetching process

const productsList = document.querySelector('.productsList')
function createCard(products) {
  products.forEach(product => {
    const li = document.createElement('li')
    li.classList.add('text')

    const name = document.createElement('h3')
    name.textContent = product.name

    const img = document.createElement('img')
    img.src = product.image;
    img.width = '100'


    li.append(name, img)
    productsList.append(li)
  });
}