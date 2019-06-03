export function getDefualtValue(value, defaultValue) {
    if(value !== undefined){
        return value;
    }

    return defaultValue;
}

export function removeNonChaNum(value) {

    return value.replace(/[^a-zA-Z0-9]/g, '');
}