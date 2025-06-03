export function createPassword() {
    // Define the characters that can be used in the ID
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+{}|:"<>?[]';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < 15; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
