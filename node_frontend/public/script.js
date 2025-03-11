// Fetch the menu data and display it in the HTML
async function fetchMenuData() {
    const url = 'https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/center-for-community/menu-type/italian/'; // Replace with your actual URL

    try {
        const response = await fetch(`/menu?url=${encodeURIComponent(url)}`);
        if (response.ok) {
            const menuData = await response.json();

            // Display the menu data in the HTML
            const c4cItalain = document.getElementById("c4cItalain");

            if (menuData.menuList.length > 0) {
                const menuHTML = `<strong>Menu for ${menuData.todayDate}:</strong><ul>`;
                const items = menuData.menuList.map(item => `<li>${item}</li>`).join('');
                c4cItalain.innerHTML = menuHTML + items + "</ul>";
            } else {
                c4cItalain.innerHTML = "<p>No menu available for today.</p>";
            }
        } else {
            console.error("Failed to fetch menu data.");
        }
    } catch (error) {
        console.error("Error fetching menu data:", error);
    }
}

// Call the function to fetch and display the menu on page load
window.onload = fetchMenuData;
