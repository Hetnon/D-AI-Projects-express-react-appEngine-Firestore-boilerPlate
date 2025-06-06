import * as userMethods from './userMethods/userMethods.js';
import * as errorMethods from './errorMethods/errorMethods.js';

export const firestoreMethods = {
    ...userMethods,
    ...errorMethods
};