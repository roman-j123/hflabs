const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
const token = "746f73a974a16b8a4e3a99996168e995ab725ef6";
const searchField = document.querySelector('.search__input');
const resultContainer = document.querySelector('.result');
let query = null;

const allClear = () => {
  resultContainer.innerHTML = '';
  document.querySelector('.data__text_name').innerHTML = '';
  document.querySelector('.data__text_inn').innerHTML = '';
  document.querySelector('.data__text_adr').innerHTML = '';
  document.querySelector('.data__text_ceo').innerHTML = '';
}
const createList = (data) => {
  allClear();
  data.forEach(item => {
    const li = document.createElement('li');
    li.classList.add('result__item')
    const header = document.createElement('h2');
    header.classList.add('result__header');
    header.innerHTML = item.value;
    const address = document.createElement('p');
    address.classList.add('result__address');
    address.innerHTML = item.data.address.value;
    li.append(header);
    li.append(address);
    li.addEventListener('click', () => {
      allClear();
      console.log(item);
      document.querySelector('.data__text_name').innerHTML = item.data.name.full_with_opf;
      document.querySelector('.data__text_inn').innerHTML = `${item.data.inn} / ${item.data.kpp}`;
      document.querySelector('.data__text_adr').innerHTML = item.data.address.unrestricted_value;
      document.querySelector('.data__text_ceo').innerHTML = item.data.management.name;
    })
    resultContainer.append(li);
  })
}

const handleSearch = (query) => {
  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Token " + token
    },
    body: JSON.stringify({
      query: query,
    })
  }
  return new Promise(function (resolve, reject) {
    fetch(url, options)
      .then(response => response.json())
      .then(result => {
        resolve(result.suggestions)
      })
      .catch(error => {
        reject(error)
      });
  })
}
//
// Если нужно получать данные при каждом вводе символа:
// 1. keypress меняем на input
// 2. Удаляем контейнер if, оставляем только:
//     query = event.target.value;
//     handleSearch(query)
//     .then(result => {
//        createList(result)
//     });
//
searchField.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    query = event.target.value;
    handleSearch(query)
      .then(result => {
        createList(result)
      });
  }

})