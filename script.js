// Generate Secure Password Function
function generateSecurePassword(length, includeUppercase, includeNumbers, includeSpecialChars) {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";
    let characters = lowercase;

    if (includeUppercase) characters += uppercase;
    if (includeNumbers) characters += numbers;
    if (includeSpecialChars) characters += specialChars;

    let password = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
        password += characters[array[i] % characters.length];
    }

    return password;
}

// Calculate Password Entropy
function calculateEntropy(password) {
    const charSetSize = new Set(password).size;
    return password.length * Math.log2(charSetSize);
}

// Evaluate Password Strength
function evaluateStrength(entropy) {
    if (entropy < 40) return { level: "Weak", value: 33 };
    if (entropy < 60) return { level: "Moderate", value: 66 };
    return { level: "Strong", value: 100 };
}

// DOM Elements
const lengthInput = document.getElementById("length");
const uppercaseCheckbox = document.getElementById("uppercase");
const numbersCheckbox = document.getElementById("numbers");
const specialCheckbox = document.getElementById("special");
const generateButton = document.getElementById("generate");
const passwordField = document.getElementById("password");
const copyButton = document.getElementById("copy");
const strengthMeter = document.getElementById("strength-meter");
const tooltip = document.getElementById("tooltip");

// Event: Generate Password
generateButton.addEventListener("click", () => {
    const length = parseInt(lengthInput.value);
    const includeUppercase = uppercaseCheckbox.checked;
    const includeNumbers = numbersCheckbox.checked;
    const includeSpecialChars = specialCheckbox.checked;

    if (length < 8 || length > 32) {
        alert("Password length must be between 8 and 32 characters.");
        return;
    }

    const password = generateSecurePassword(length, includeUppercase, includeNumbers, includeSpecialChars);
    passwordField.value = password;

    const entropy = calculateEntropy(password);
    const strength = evaluateStrength(entropy);

    strengthMeter.value = strength.value;
    tooltip.innerHTML = `Password Strength: ${strength.level}`;
});

// Event: Copy to Clipboard
copyButton.addEventListener("click", () => {
    if (passwordField.value) {
        navigator.clipboard.writeText(passwordField.value).then(() => {
            alert("Password copied to clipboard!");

            // Auto-clear clipboard after 30 seconds
            setTimeout(() => {
                navigator.clipboard.writeText("");
                console.log("Clipboard cleared for security!");
            }, 30000);
        }).catch(err => {
            console.error("Could not copy password: ", err);
        });
    } else {
        alert("No password to copy!");
    }
});

// Rate User-Entered Password
const userPasswordInput = document.getElementById("user-password");
const userStrengthMeter = document.getElementById("user-strength-meter");
const userStrengthText = document.getElementById("user-strength-text");

userPasswordInput.addEventListener("input", () => {
    const userPassword = userPasswordInput.value;
    const entropy = calculateEntropy(userPassword);
    const strength = evaluateStrength(entropy);

    userStrengthMeter.value = strength.value;
    userStrengthText.innerText = `Password Strength: ${strength.level}`;
});
