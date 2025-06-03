const isDesktop = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    const hasTouchScreen = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const response = !isMobileDevice && !hasTouchScreen;
    return response;
};

const serverAddressMobile = `${process.env.REACT_APP_MOBILE_SERVER_ADDRESS}`
const serverAddressDesktop = `${process.env.REACT_APP_SERVER_ADDRESS}`
const serverAddressPreAddress = isDesktop() ? serverAddressDesktop : serverAddressMobile;
export const serverAddress = `${serverAddressPreAddress}/api`;
export const errorsToRedirectFullLogin = ['NoUserInSession', 'invalid_grant'];


export async function checkError(response, functionName) {
    const responseParsed = await response.json();
    console.error(`Error in ${functionName}: ${responseParsed.message}`);
    if(errorsToRedirectFullLogin.includes(responseParsed.error)) {
        return 'redirectToFullLogin';
    }
    return responseParsed.error || 'An error occurred';
}