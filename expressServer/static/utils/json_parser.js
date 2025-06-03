export function jsonParser(jsonString) {
    // This regex looks for word characters (key names) followed by a colon, outside of quotes
    try{
        const parsedJsonString = JSON.parse(jsonString);
        return parsedJsonString;
    } catch (error){
        try{
            console.log('Error in jsonString:', jsonString)
            const regex = /(?<!["'])\b([a-zA-Z0-9_]+)\b(?=\s*:)/g;
            const newString = jsonString.replace(regex, '"$1"');
            console.log('newString', newString)
            const parsedJsonString = JSON.parse(newString)
            return parsedJsonString;
        } catch (error){
            console.error('Error in jsonParser:', error);
            return ''
        }
    }
}