require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const { DateTime } = require('luxon');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure EJS as view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Helper functions from your Python code
function addDateToUrl(url) {
    const today = DateTime.now().toFormat('yyyy/MM/dd/');
    return url + today;
}

async function fetchMenu(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch menu data:", error.message);
        return null;
    }
}

function extractTodayMeals(menuData) {
    const todayDate = DateTime.now().toFormat('yyyy-MM-dd');
    const menuList = [];
    
    for (const day of menuData?.days || []) {
        if (day.date === todayDate) {
            for (const item of day.menu_items || []) {
                if (item.food && typeof item.food === 'object') {
                    const foodName = item.food.name;
                    if (foodName) {
                        menuList.push({
                            name: foodName,
                            description: item.food.description || '',
                            imageUrl: item.food.image_url || '',
                            allergens: item.food.allergens || []
                        });
                    }
                }
            }
        }
    }
    return { date: todayDate, items: menuList };
}

// Routes
app.get('/', async (req, res) => {
    try {
        const apiUrl = addDateToUrl(process.env.API_URL);
        const menuData = await fetchMenu(apiUrl);
        
        if (!menuData) {
            return res.render('index', { 
                error: 'Failed to fetch menu data from API',
                date: DateTime.now().toFormat('yyyy-MM-dd')
            });
        }

        const { date, items } = extractTodayMeals(menuData);
        res.render('index', { date, items, error: null });
    } catch (error) {
        console.error(error);
        res.render('index', { 
            error: 'An error occurred while processing your request',
            date: DateTime.now().toFormat('yyyy-MM-dd'),
            items: []
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});