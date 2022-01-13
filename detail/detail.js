import { 
    checkAuth, 
    fetchRestaurantAndReviewsAndProfiles, 
    logout,
    addReview,
    incrementLike,
    getUser
} from '../fetch-utils.js';

checkAuth();

const logoutButton = document.getElementById('logout');
const restaurantNameEl = document.querySelector('#restaurant-name');
const cuisineEl = document.querySelector('#cuisine');
const addressEl = document.querySelector('#address');
const reviewForm = document.querySelector('.review-form');
const reviewsListEl = document.querySelector('.reviews-list');
const submitReviewButton = document.querySelector('#submit');
const reviewTextarea = document.querySelector('#review-textarea');
const ratingInput = document.querySelector('#rating');


const params = new URLSearchParams(window.location.search);
const restaurantId = params.get('id');

logoutButton.addEventListener('click', () => {
    logout();
});

window.addEventListener('load', async() => {
    await fetchAndDisplayRestaurant(restaurantId);

    await fetchAndDisplayReviews(restaurantId);

    const session = await getUser();
    logoutButton.textContent = `Logout ${session.user.email}`;

    //STOP USER FROM ADDING MORE THAN ONE REVIEW


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

    reviewsListEl.textContent = '';
    for (let review of restaurant.reviews) {

        const reviewEl = document.createElement('div');
        const userInfoEl = document.createElement('div');
        const userRating = document.createElement('h3');
        const userReview = document.createElement('p');
        const userAnchor = document.createElement('a');

        userRating.textContent = `${review.rating}⭐️'s`;
        userReview.textContent = `"${review.text}"`;
        reviewEl.classList.add('review');

        userInfoEl.textContent = `${review.profiles.email}:  ${review.profiles.karma} 👍 likes`;

        userAnchor.append(userInfoEl);
        userAnchor.href = `../profile-detail/?id=${review.profiles.id}`;

        const upVote = document.createElement('button');
        upVote.textContent = '+1 Like';

        // User can't upvote their own post
        const session = await getUser();
        if (review.profiles.user_id === session.user.id) {
            upVote.disabled = true;
        }

        //DISABLES FORM SUBMIT IF USER ALREADY HAS A REVIEW
        if (review.profiles.user_id === session.user.id) {
            submitReviewButton.disabled = true;
            reviewTextarea.disabled = true;
            ratingInput.disabled = true;
        }

        upVote.addEventListener('click', async() => {
            const newKarma = review.profiles.karma + 1;
            await incrementLike(newKarma, review.profiles.user_id); 

            fetchAndDisplayReviews();
        });

        const voteButtonsContainer = document.createElement('div');
        voteButtonsContainer.append(upVote);

        reviewEl.append(userRating, userAnchor, voteButtonsContainer, userReview);

        reviewsListEl.append(reviewEl);
    }





}
