// Mapping div IDs to URLs
const menuUrls = {
    'sewellBreakfast': 'https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/sewall-dining-center/menu-type/executive-chefs-place/',
    'sewellLunch': 'https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/sewall-dining-center/menu-type/sewall-s-lunch/',
    'sewellDiner': 'https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/sewall-dining-center/menu-type/executive-chefs-placesewall-diningall-day/',
    'c4Asia': 'https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/center-for-community/menu-type/c4c-asia-all-day/',
    'c4Italian': 'https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/center-for-community/menu-type/italian/',
    'c4Latin': 'https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/center-for-community/menu-type/latin/',
    'c4Persia': 'https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/center-for-community/menu-type/persian/',
    'c4Grill': 'https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/center-for-community/menu-type/smokin-grill/',
    'c5Curry': 'https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/village-center-dining/menu-type/vc_curryroad/',
    'c5Toast': 'https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/village-center-dining/menu-type/vc_toast/',
    'c5Mid': 'https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/village-center-dining/menu-type/vc_middleterranean/',
    'c5Hearth': 'https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/village-center-dining/menu-type/vc_hearth/',
    'c5Grange': 'https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/village-center-dining/menu-type/vc_grange/',
    'umcDaily': 'https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/alferd-packer-grill/menu-type/apg_tabor/',
    'libby': 'https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/libby/menu-type/libby-opening-august-16th/',
    'Farrend': 'https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/the-alley/menu-type/the-alley-at-farrand-s-all-day-id2009/'
};

// Fetch menu data for each dining location
async function fetchAndDisplayMenuData() {
    for (const [divId, url] of Object.entries(menuUrls)) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const menuData = await response.json();
                const { todayDate, menuList } = extractTodayMeals(menuData);

                // Find the div by ID and insert the menu data
                const menuDiv = document.getElementById(divId);
                menuDiv.innerHTML += `
                    <h3>${divId.replace(/([A-Z])/g, ' $1').trim()} - ${todayDate}</h3>
                    <ul>
                        ${menuList.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                `;
            } else {
                console.error(`Failed to fetch menu for ${divId}`);
            }
        } catch (error) {
            console.error(`Error fetching menu for ${divId}:`, error);
        }
    }
}

// Helper function to extract today's meals
function extractTodayMeals(menuData) {
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

// Call the function when the page loads
window.onload = fetchAndDisplayMenuData;
