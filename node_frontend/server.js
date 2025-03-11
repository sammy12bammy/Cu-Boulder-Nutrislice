import express from 'express';
import { getProcessedMenuData } from './utils/menu.js'; // Import the function from menu.js

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public")); // static files (index and script)

// API route to fetch menu data and return to the frontend
app.get('/menu', async (req, res) => {
    const { url } = req.query; // URL passed as a query parameter

    if (!url) {
        return res.status(400).json({ error: "No URL provided" });
    }

    try {
        const menuData = await getProcessedMenuData(url);
        res.json(menuData); // Send the processed menu data as JSON
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch or process menu data" });
    }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
