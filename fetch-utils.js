const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTk0MzkyNSwiZXhwIjoxOTU3NTE5OTI1fQ.dMDJyeCZHko9Vr6qrLp-UfzKQF3xQowPC6N4NhcuHMA';
const SUPABASE_URL = 'https://dndlkewbungoynpztwzf.supabase.co';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);



export async function createProfile(email) {
    const response = await client
        .from('profiles')
        .insert({ 
            email, 
            karma: 0
        });

    return checkError(response);
}

export async function fetchRestaurants() {
    const response = await client
        .from('restaurants')
        .select('*, reviews (profiles (*)))');

    return checkError(response);
}

export async function fetchRestaurantAndReviewsAndProfiles(id) {
    const response = await client
        .from('restaurants')
        .select('*, reviews (*, profiles (*))')
        .match({ id: id })
        .single();

    return checkError(response);
}

export async function addReview(review) {
    const response = await client
        .from('reviews')
        .insert({
            text: review.userReview,
            rating: review.userRating,
            restaurant_id: review.restaurantId
        });

    return checkError(response);
}

export async function incrementLike(newKarma, userId) {
    const response = await client
        .from('profiles')
        .update({ karma: newKarma })
        .match({ user_id: userId });

    return checkError(response);
}

//TEMPLATE FUNCTIONS

export async function getUser() {
    return client.auth.session();
}

export async function checkAuth() {
    const user = await getUser();

    if (!user) location.replace('../'); 
}

export async function redirectIfLoggedIn() {
    if (await getUser()) {
        location.replace('./restaurants');
    }
}

export async function signupUser(email, password){
    const response = await client.auth.signUp({ email, password });

    await createProfile(email); // CALL HERE TO CREATE A PROFILE ON SIGN UP
    
    return response.user;
}

export async function signInUser(email, password){
    const response = await client.auth.signIn({ email, password });

    return response.user;
}

export async function logout() {
    await client.auth.signOut();

    return window.location.href = '../';
}

function checkError({ data, error }) {
    return error ? console.error(error) : data;
}
