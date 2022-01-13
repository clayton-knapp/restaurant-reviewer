import { 
    checkAuth, 
    fetchProfileAndReviews, 
    logout,
    incrementLike,
    getUser
} from '../fetch-utils.js';

checkAuth();

const logoutButton = document.getElementById('logout');
const userInfoEl = document.querySelector('.user-info');
const reviewsListEl = document.querySelector('.reviews-list');


const params = new URLSearchParams(window.location.search);
const userId = params.get('id');

logoutButton.addEventListener('click', () => {
    logout();
});

window.addEventListener('load', async() => {
    await fetchAndDisplayProfileAndReviews(userId);

    const session = await getUser();
    logoutButton.textContent = `Logout ${session.user.email}`;
});



async function fetchAndDisplayProfileAndReviews(userId) {
    const profile = await fetchProfileAndReviews(userId);

    userInfoEl.textContent = `${profile.email} has 👍${profile.karma}`;

    for (let review of profile.reviews) {

        const reviewEl = document.createElement('div');
        const userRating = document.createElement('h3');
        const userReview = document.createElement('p');
        const restaurantName = document.createElement('h3');
        const restaurantAnchor = document.createElement('a');

        restaurantName.textContent = review.restaurants.name;
        userRating.textContent = `${review.rating}⭐️'s`;
        userReview.textContent = `"${review.text}"`;
        reviewEl.classList.add('review');
        restaurantAnchor.href = `../detail/?id=${review.restaurants.id}`;

        restaurantAnchor.append(restaurantName);

        reviewEl.append(restaurantAnchor, userRating, userReview);

        reviewsListEl.append(reviewEl);
    }


}


// async function fetchAndDisplayReviews() {
//     const profile = await fetchProfileAndReviews(userId);
//     console.log(profile);

//     reviewsListEl.textContent = '';
//     for (let review of restaurant.reviews) {

//         const reviewEl = document.createElement('div');
//         const userInfoEl = document.createElement('div');
//         const userRating = document.createElement('h3');
//         const userReview = document.createElement('p');

//         userRating.textContent = `${review.rating}⭐️'s`;
//         userReview.textContent = `"${review.text}"`;
//         reviewEl.classList.add('review');

//         userInfoEl.textContent = `${review.profiles.email}: ${review.profiles.karma} 👍 likes`;

//         const upVote = document.createElement('button');
//         upVote.textContent = '+1 Like';

//         upVote.addEventListener('click', async() => {
//             const newKarma = review.profiles.karma + 1;
//             await incrementLike(newKarma, review.profiles.user_id); 

//             fetchAndDisplayReviews();
//         });

//         const voteButtonsContainer = document.createElement('div');
//         voteButtonsContainer.append(upVote);

//         reviewEl.append(userRating, userInfoEl, voteButtonsContainer, userReview);

//         reviewsListEl.append(reviewEl);
//     }

// }
