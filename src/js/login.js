import {countries} from 'countries-list';

const $list = document.querySelector('.countries');
const $inputCountry = document.querySelector('#country');
const $inputPhone = document.querySelector('#phone');

$list.innerHTML = Object.entries(countries).map(([key, country]) => {
  return `<li data-key="${key}">${country.emoji} ${country.name} +${country.phone}</li>`;
}).join('');
$list.addEventListener('click', setCountry);

$inputCountry.addEventListener('input', function() {
  if (!this.value.length) {
    $inputPhone.value = '';
  }
  if(!autocomplete(this.value, 'name').length) {
    alert('no-res');
  };
});
$inputPhone.addEventListener('input', function() {
  if (!this.value.length) {
    $inputCountry.value = '';
  }
  const filtered = autocomplete(this.value.replace('+', ''), 'phone');
  if(filtered.length === 1) {
    $inputCountry.value = filtered[0].name;
  }
});

function autocomplete(search, field) {
  return Object.values(countries).filter((country, index) => {
    const isMatch = country[field].toLowerCase().indexOf(search.toLowerCase()) !== -1;
    $list.childNodes[index].style.display = isMatch ? 'block' : 'none';
    return isMatch;
  });
}

function setCountry(event) {
  const {name, phone} = countries[event.target.dataset.key];
  $inputCountry.value = name;
  $inputPhone.value = `+${phone}`;
  autocomplete($inputCountry.value, 'name');
}
