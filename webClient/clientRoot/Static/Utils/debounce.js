export default function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
             func.apply(this, args); 
        }, timeout);
    };
};

export function debouncePerKey(func, timeout = 300) {
    const timers = {};
    return (key, ...args) => {
        if (timers[key]) {
            clearTimeout(timers[key]);
        }
        timers[key] = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}