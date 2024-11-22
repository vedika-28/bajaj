const express = require("express");
const bodyParser = require("body-parser");
const mime = require("mime");

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Helper function to check if a number is prime
const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// Helper function to validate Base64 string for a file
const validateBase64 = (base64String) => {
  try {
    const buffer = Buffer.from(base64String, "base64");
    return buffer.toString("base64") === base64String && buffer.length > 0;
  } catch (error) {
    return false;
  }
};

// POST Route
app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;

  // User information
  const fullName = "john_doe";
  const dob = "17091999"; // Date of birth in ddmmyyyy format
  const userID = `${fullName}_${dob}`;
  const email = "john@xyz.com";
  const rollNumber = "ABCD123";

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({
      is_success: false,
      message: "Invalid request. 'data' field is required and must be an array.",
    });
  }

  // Separate numbers and alphabets
  const numbers = data.filter((item) => !isNaN(Number(item)));
  const alphabets = data.filter((item) => /^[a-zA-Z]$/.test(item));

  // Determine the highest lowercase alphabet
  const lowercaseAlphabets = alphabets.filter((char) => /[a-z]/.test(char));
  const highestLowercase = lowercaseAlphabets.length
    ? [lowercaseAlphabets.sort().reverse()[0]]
    : [];

  // Check if any prime number is found
  const primeFound = numbers.some((num) => isPrime(Number(num)));

  // File handling
  let fileValid = false;
  let fileMimeType = null;
  let fileSizeKB = null;

  if (file_b64) {
    fileValid = validateBase64(file_b64);
    if (fileValid) {
      const buffer = Buffer.from(file_b64, "base64");
      fileMimeType = mime.getType(buffer);
      fileSizeKB = (buffer.length / 1024).toFixed(2);
    }
  }

  // Response
  return res.status(200).json({
    is_success: true,
    user_id: userID,
    email,
    roll_number: rollNumber,
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercase,
    is_prime_found: primeFound,
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKB,
  });
});

// GET Route
app.get("/bfhl", (req, res) => {
  return res.status(200).json({ operation_code: 1 });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});