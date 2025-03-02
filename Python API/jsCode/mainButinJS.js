//written by ai 
//need this - npm install node-fetch

import fetch from 'node-fetch'; // For HTTP requests
import fs from 'fs'; // For file system operations

// Fetches JSON API calls - returns a JSON object
async function fetchMenu(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        } else {
            console.log("Failed to fetch menu data.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching menu data:", error);
        return null;
    }
}

// Extracts today's meals from a JSON file and returns a list of meal names
function extractTodayMeals(menuData) {
    const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const menuList = [];

    // First object in the API is a date, this contains the data
    for (const day of menuData.days || []) {
        if (day.date === todayDate) {
            // Loops through all menu items, looking for food
            for (const item of day.menu_items || []) {
                // Check if "food" exists and is an object
                if (item.food && typeof item.food === 'object') {
                    const foodName = item.food.name;
                    if (foodName) {
                        menuList.push(foodName);
                    }
                }
            }
        }
    }
    return { todayDate, menuList };
}

// Prints the menu
function printMenu(date, items) {
    console.log(`\nMenu for ${date}:`);
    for (const item of items) {
        console.log(`  - ${item}`);
    }
}

// Returns the menu in string format
function getStringMenu(items) {
    return items.map(item => ` - ${item}`).join('\n');
}

// Adds today's date to the URL
function addDateUrl(url) {
    const todayDate = new Date().toISOString().split('T')[0].replace(/-/g, '/');
    return url + todayDate;
}

// First-based index (1 would return the first line)
function fetchFromFile(index) {
    index = index - 1;
    //gotta go back
    const fileContent = fs.readFileSync('../apikey.txt', 'utf8').split('\n');
    return fileContent[index].trim();
}

// Main function
async function main() {
    // Pick whatever URL you want from the txt file and put into here
    let url = fetchFromFile(23);
    url = addDateUrl(url);
    console.log("Fetched from key:");
    console.log(url);

    const menuData = await fetchMenu(url);
    if (menuData) {
        const { todayDate, menuList } = extractTodayMeals(menuData);
        printMenu(todayDate, menuList);
    }
}

// Run the main function
main();