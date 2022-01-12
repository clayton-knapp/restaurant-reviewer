import { checkAuth, logout } from '../fetch-utils.js';

checkAuth();

const logoutButton = document.getElementById('logout');
const restaurantsListEl = document.queryCommandIndeterm('.restaurants-list');

logoutButton.addEventListener('click', () => {
    logout();
});

window.addEventListener('load', async() => {
    fetchAndDisplayRestaurants
})


