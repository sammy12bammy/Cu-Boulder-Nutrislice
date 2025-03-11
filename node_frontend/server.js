import express from 'express';
import { getMenuDataForUrls } from './utils/menu.js'; // Import the new function

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public")); // static files (index and script)

// API route to fetch menu data for all URLs
app.get('/menus', async (req, res) => {
    const filePath = '../Python API/apikey.txt'; // Path to the text file with URLs

    try {
        const menuData = await getMenuDataForUrls(filePath);
        res.json(menuData); // Send the processed menu data as JSON
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch or process menu data" });
    }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
