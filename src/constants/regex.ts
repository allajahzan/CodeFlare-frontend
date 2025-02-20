// Email regex
export const emailRegex = {
    validEmail: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
};

// Password regex
export const passwordRegex = {
    capitalLetter: /(?=.*[A-Z])/,
    digit: /(?=.*\d)/,
    specialSymbol: /(?=.*[@$!%*?&])/,
};

// Name regex
export const nameRegex = {
    capitalLetter: /^[A-Z]/,
    alphabet: /^[a-zA-Z]+(?: [a-zA-Z]+)*$/
};

// Digits regex
export const batch = {    
    capitalLetter: /^[A-Z]/,
    batchName: /^Batch \d+$/
};