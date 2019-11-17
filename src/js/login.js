import {Storage} from './libs/storage';

document.addEventListener('DOMContentLoaded', function(){
    console.log(document.querySelector('#getCode'));

});

Storage.set({test: 'hasdfsad', many:'fafasdasgsgasgsa'});

Storage.get('test', 'many').then((res) => console.log(res));

console.log('haha');
