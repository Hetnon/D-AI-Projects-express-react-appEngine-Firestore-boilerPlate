export function formatTime(seconds) {
    const h = Math.floor(seconds / 3600); // Calculate hours
    const m = Math.floor((seconds % 3600) / 60); // Calculate minutes
    const s = Math.floor(seconds % 60); // Calculate seconds
    // Format the time into a string
    const hours = String(h).padStart(2, '0');   // Include hours only if it's 1 hour or more
    const minutes = String(m).padStart(2, '0'); // Pad minutes with zero if hours are present
    const formattedSeconds = String(s).padStart(2, '0'); // Always pad seconds with zero
    return `${hours}:${minutes}:${formattedSeconds}`;
}


export function convertISODateToReadableString(date, includeYear = true) {
    if(!date) return '';
    const dateObj = new Date(date);
    const returnDate = dateObj.toLocaleString('en-GB', { 
        month: '2-digit',
        day: '2-digit',
        year: includeYear ? '2-digit' : undefined,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })
    return returnDate;
}

export function convertISODateToReadableString2(date) {
    if(!date) return '';

    // transform format YYYY-MM-DDTHH:mm:ss-HH:mm to DD/MM/YYYY HH:mm 
    const returnDate = date.substring(8,10) + '/' + date.substring(5,7) + '/' + date.substring(0,4) + ' ' + date.substring(11,16);
    return returnDate;
}