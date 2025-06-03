export function calculateAge(birthDate){
    const birthDateObj = new Date(birthDate);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDateObj.getFullYear();
    const month = currentDate.getMonth() - birthDateObj.getMonth();
    if (month < 0 || (month === 0 && currentDate.getDate() < birthDateObj.getDate())) {
        return age - 1;
    }
    return age;
}