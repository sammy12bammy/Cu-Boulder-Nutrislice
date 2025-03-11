// Fetch all menu data and display it in separate divs
async function fetchAllMenuData() {
    try {
        const response = await fetch('/menus');
        if (response.ok) {
            const allMenus = await response.json();

            const menuContainer = document.getElementById("menuContainer");
            menuContainer.innerHTML = ''; // Clear any existing content

            if (allMenus.length > 0) {
                allMenus.forEach((menuData, index) => {
                    // Create a new div for each menu
                    const menuDiv = document.createElement("div");
                    menuDiv.classList.add("menu");
                    
                    const menuHTML = `
                        <h2>Menu ${index + 1} for ${menuData.todayDate}</h2>
                        <ul>
                            ${menuData.menuList.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    `;
                    
                    menuDiv.innerHTML = menuHTML;
                    menuContainer.appendChild(menuDiv); // Append the div to the container
                });
            } else {
                menuContainer.innerHTML = "<p>No menus available.</p>";
            }
        } else {
            console.error("Failed to fetch menu data.");
        }
    } catch (error) {
        console.error("Error fetching menu data:", error);
    }
}

// Call the function to fetch and display the menus on page load
window.onload = fetchAllMenuData;
