import fetch from 'node-fetch'; // For HTTP requests
import fs from 'fs'; // For file system operations

// Fetches JSON API calls - returns a JSON object
export async function fetchMenu(url) {
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
export function extractTodayMeals(menuData) {
    const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const menuList = [];

    for (const day of menuData.days || []) {
        if (day.date === todayDate) {
            for (const item of day.menu_items || []) {
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

// Adds today's date to the URL
export function addDateUrl(url) {
    const todayDate = new Date().toISOString().split('T')[0].replace(/-/g, '/');
    return url + todayDate;
}

// Read all URLs from a text file
export function getUrlsFromFile(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return fileContent.split('\n').map(url => url.trim()).filter(url => url.length > 0);
    } catch (error) {
        console.error("Error reading file:", error);
        return [];
    }
}

// Get processed data for all URLs
export async function getMenuDataForUrls(filePath) {
    const urls = getUrlsFromFile(filePath);
    const menuDataList = [];

    for (const url of urls) {
        const updatedUrl = addDateUrl(url);
        const menuData = await fetchMenu(updatedUrl);
        
        if (menuData) {
            menuDataList.push(extractTodayMeals(menuData));
        }
    }

    return menuDataList;
}
