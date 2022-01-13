import { 
    checkAuth, 
    logout,
    fetchProfilesAndReviews
} from '../fetch-utils.js';

checkAuth();

const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', () => {
    logout();
});

window.addEventListener('load', async() => {
    await fetchAndDisplayProfilesAndReviews();

});

async function fetchAndDisplayProfilesAndReviews() {
    const profilesAndReviews = await fetchProfilesAndReviews();
}

