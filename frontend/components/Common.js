
const live = true;
var baseurl = "http://localhost:5000";
if(live){
    baseurl = "https://tomar-store.onrender.com";
}

export const apiLogin = baseurl + '/api/auth/login';
export const apiSignup = baseurl + '/api/auth/signup';
export const apiGetProducts = baseurl + '/api/items';
export const apiCart = baseurl + '/api/items/cart';
export const apiSeller = baseurl + '/api/products';