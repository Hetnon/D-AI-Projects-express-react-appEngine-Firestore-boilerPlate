import levenshtein  from 'fast-levenshtein';

export function areStringsSimilar(str1, str2) {
    console.log('areStringsSimilar called for str1:', str1, 'str2:', str2);
    const distance = levenshtein.get(str1, str2);
    // You can adjust the threshold according to your needs
    const threshold = Math.max(str1.length, str2.length) / 4; // Example threshold
    console.log('distance', distance, 'threshold', threshold)
    return distance <= threshold;
}