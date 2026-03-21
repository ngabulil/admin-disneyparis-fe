import Cookies from "js-cookie";

export const setCookie = (name, value, options = {}) => {
    return Cookies.set(name, value, options);
};

export const getCookie = (name) => {
    return Cookies.get(name);
};