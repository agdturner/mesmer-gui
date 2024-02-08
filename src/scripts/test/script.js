import { Hello } from './module.js';
//import { hello } from './module.js';

document.getElementById("test").innerHTML = hello();

function hello() {
    return "hello";
}