import { 
    checkAuth, 
    logout,
    fetchProfiles,
    getUser
} from '../fetch-utils.js';

checkAuth();

const logoutButton = document.getElementById('logout');
const profilesList = document.querySelector('.profiles-list');

logoutButton.addEventListener('click', () => {
    logout();
});

window.addEventListener('load', async() => {
    await fetchAndDisplayProfiles();

    const session = await getUser();
    logoutButton.textContent = `Logout ${session.user.email}`;
});

async function fetchAndDisplayProfiles() {
    const profiles = await fetchProfiles();
    console.log(profiles);


    for (let profile of profiles) {
        const profileEl = document.createElement('div');
        const profileInfo = document.createElement('p');
        const anchor = document.createElement('a');

        profileInfo.textContent = `${profile.email}  --  👍 ${profile.karma}`;
        anchor.href = `../profile-detail/?id=${profile.id}`;

        anchor.append(profileInfo);
        profileEl.append(anchor);

        profilesList.append(profileEl);

    }


}

