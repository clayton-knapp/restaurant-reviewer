import { 
    checkAuth, 
    logout,
    fetchRestaurants
} from '../fetch-utils.js';

checkAuth();

const logoutButton = document.getElementById('logout');
const restaurantsListEl = document.querySelector('.restaurants-list');

logoutButton.addEventListener('click', () => {
    logout();
});

window.addEventListener('load', async() => {
    await fetchAndDisplayRestaurants();
});

async function fetchAndDisplayRestaurants() {
    // restaurantsListEl.textContent = '';

    const restaurants = await fetchRestaurants();

    for (let restaurant of restaurants) {
        const restaurantEl = document.createElement('div');
        const restaurantName = document.createElement('h2');

        restaurantEl.classList.add('restaurants');
        restaurantName.textContent = restaurant.name;

        restaurantEl.append(restaurantName);

        //on click go to detail page
        restaurantEl.addEventListener('click', () => {
            location.replace(`../detail/?id=${restaurant.id}`);
        });

        restaurantsListEl.append(restaurantEl);
    }


}


