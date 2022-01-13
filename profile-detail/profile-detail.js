import { 
    checkAuth, 
    fetchRestaurantAndReviewsAndProfiles, 
    logout,
    addReview,
    incrementLike
} from '../fetch-utils.js';

checkAuth();

const logoutButton = document.getElementById('logout');
const restaurantNameEl = document.querySelector('#restaurant-name');
const cuisineEl = document.querySelector('#cuisine');
const addressEl = document.querySelector('#address');
const reviewForm = document.querySelector('.review-form');
const reviewsListEl = document.querySelector('.reviews-list');


const params = new URLSearchParams(window.location.search);
const restaurantId = params.get('id');

logoutButton.addEventListener('click', () => {
    logout();
});

window.addEventListener('load', async() => {
    await fetchAndDisplayRestaurant(restaurantId);

    await fetchAndDisplayReviews(restaurantId);
});

reviewForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const data = new FormData(reviewForm);
    const userReview = data.get('review');
    const userRating = data.get('rating');

    await addReview({ userReview, userRating, restaurantId });

    reviewForm.reset();

    await fetchAndDisplayReviews();
    
});


async function fetchAndDisplayRestaurant(restaurantId) {
    const restaurant = await fetchRestaurantAndReviewsAndProfiles(restaurantId);

    restaurantNameEl.textContent = restaurant.name;
    cuisineEl.textContent = restaurant.cuisine;
    addressEl.textContent = restaurant.address;
}

async function fetchAndDisplayReviews() {
    const restaurant = await fetchRestaurantAndReviewsAndProfiles(restaurantId);
    console.log(restaurant);

    reviewsListEl.textContent = '';
    for (let review of restaurant.reviews) {

        const reviewEl = document.createElement('div');
        const userInfoEl = document.createElement('div');
        const userRating = document.createElement('h3');
        const userReview = document.createElement('p');

        userRating.textContent = `${review.rating}⭐️'s`;
        userReview.textContent = `"${review.text}"`;
        reviewEl.classList.add('review');

        userInfoEl.textContent = `${review.profiles.email}: ${review.profiles.karma} 👍 likes`;

        const upVote = document.createElement('button');
        upVote.textContent = '+1 Like';

        upVote.addEventListener('click', async() => {
            const newKarma = review.profiles.karma + 1;
            await incrementLike(newKarma, review.profiles.user_id); 

            fetchAndDisplayReviews();
        });

        const voteButtonsContainer = document.createElement('div');
        voteButtonsContainer.append(upVote);

        reviewEl.append(userRating, userInfoEl, voteButtonsContainer, userReview);

        reviewsListEl.append(reviewEl);
    }





}
