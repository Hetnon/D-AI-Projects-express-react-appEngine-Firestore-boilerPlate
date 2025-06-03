export default function areArraysExactlyEqual(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        return false;
    }

    if (arr1 === null || arr2 === null || arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (!isObjectEqual(arr1[i], arr2[i])) {
            return false;
        }
    }

    return true;
}

function isObjectEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    }

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 == null || obj2 == null) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        if (!keys2.includes(key) || !areValuesEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

function areValuesEqual(val1, val2) {
    if (typeof val1 === 'object' && typeof val2 === 'object') {
        return isObjectEqual(val1, val2);
    } else {
        return val1 === val2;
    }
}