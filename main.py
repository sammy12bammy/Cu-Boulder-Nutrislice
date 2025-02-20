import requests
from datetime import datetime, timedelta

# Set the timezone offset for America/Chicago (CST/CDT)
current_hour = datetime.utcnow().hour - 6  # CST is UTC-6, adjust for CDT if needed

# Determine if we should show today's or tomorrow's menu
# if current_hour < 14:
#     date2use = datetime.today()
# else:
#     date2use = datetime.today() + timedelta(days=1)
date2use = datetime.today()

# Format the date in the required '/YYYY/MM/DD/' format
today_date = date2use.strftime('/%Y/%m/%d/')

# Construct the API URL
#https://colorado-diningmenus.nutrislice.com/menu/sewall-dining-center/executive-chefs-place/{today_date}?format=json
menu_url = f"https://colorado-diningmenus.nutrislice.com/menu/sewall-dining-center/executive-chefs-place/{today_date}?format=json"

# Fetch JSON data from the API
response = requests.get(menu_url)

# Check if the request was successful
if response.status_code == 200:
    json_data = response.json()  # Convert response to JSON

    # Extract menu items if they exist
    menu_items = json_data.get("menu_items", [])

    # Format the menu output
    if menu_items:
        menulist = ", ".join(menu_items)
    else:
        menulist = "No menu for today."
else:
    menulist = f"Error fetching menu: {response.status_code}"

# Print the formatted menu output
print(f"{date2use.strftime('%a')}: {menulist}")
