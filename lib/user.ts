import User from "@/models/User";

/**
 * Utility function to generate a random number between 1000 and 9999 (inclusive)
 * @returns {number} Random number in the range [1000, 9999]
 */
export function generateRandomNumber() {
  return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
}

/**
 * Utility function to generate a unique random number for the `tag` field in MongoDB
 * @returns {Promise<number>} - A unique random number
 */
export async function generateUniqueTag(): Promise<number> {
    let unique = false;
    let randomNumber: number;

    while (!unique) {
        // Generate a random number
        randomNumber = generateRandomNumber();

        // Check if the number exists in the User collection
        const count = await User.countDocuments({ tag: randomNumber }).exec();

        // If no user found, the number is unique
        if (count == 0) {
            unique = true;
        }
    }

    return randomNumber!;
}