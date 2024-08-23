// Input field Validations
const intRegExp = new RegExp('^([0-9]+)$');
export const validateNumValue = (e, f) => {
    if (e === "" || intRegExp.test(e)) {
        f(e);
    } else {
        return false;
    }
}

const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
export const validateDecValue = (e, f) => {
    if (e === "" || floatRegExp.test(e)) {
        return e;
    } else {
        return "";
    }
}

const alpNumRegExp = new RegExp('^([0-9a-zA-Z ]+)$');
export const validateAlpNumValue = (e, f) => {
    if (e === "" || alpNumRegExp.test(e)) {
        return e;
    } else {
        return "";
    }
}

const alpRegExp = new RegExp('^([a-zA-Z ]+)$');
export const validateAlpValue = (e, f) => {
    if (e === "" || alpRegExp.test(e)) {
        f(e);
    } else {
        return false;
    }
}