#relies on requests - pip install requests
import requests
from datetime import datetime

# Fetches JSON API calls - don't change anything, returns a JSON thing type shi
def fetch_menu(url):
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print("Failed to fetch menu data.")
        return None

# Extracts today's meals from a JSON file and returns a list of meal names
# Param: menu_data = JSON file
# This function is modified to only show today's menu
def extract_today_meals(menu_data):
    today_date = datetime.today().strftime('%Y-%m-%d')
    menu_list = []
    
    # First object in the API is a date, this contains the data
    for day in menu_data.get("days", []):
        if day.get("date") == today_date:
            # loops through all menu items, looking for food
            for item in day.get("menu_items", []):
                # menu_items is an object consisting of 7 different attributes
                # Only ones that are helpful to us are:
                #   - Text: Description of menu item
                #   - Object food: Most of the data we care about for food
                #
                # This line accesses the food item; with var "food" we can:
                # Get name, description, image_url, nutrition_info, allergens/dietary recs type shi
                if "food" in item and isinstance(item["food"], dict):
                    food_name = item["food"].get("name")
                    if food_name:
                        menu_list.append(food_name)
    return today_date, menu_list

# Prints the menu
def print_menu(date, items):
    print(f"\nMenu for {date}:")
    for item in items:
        print(f"  - {item}")

#use for debugging purposes
def fetch_url(hall, place):
    if hall == "c4c":
        if place == "Asian":
            return "https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/center-for-community/menu-type/c4c-asia-all-day/"
        elif place == "Italian":
            return "https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/center-for-community/menu-type/italian/"
        elif place == "Latin":
            return "https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/center-for-community/menu-type/latin/"
        elif place == "Persian":
            return "https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/center-for-community/menu-type/persian/"
        elif place == "grill":
            return "https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/center-for-community/menu-type/smokin-grill/"
    elif hall == "village":
        if place == "Curry":
            return "https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/village-center-dining/menu-type/vc_curryroad/"
        elif place == "Toast":
            return "https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/village-center-dining/menu-type/vc_toast/"
        elif place == "Middleterranean":
            return "https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/village-center-dining/menu-type/vc_middleterranean/"
        elif place == "Hearth":
            return "https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/village-center-dining/menu-type/vc_hearth/"
        elif place == "Grange":
            return "https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/village-center-dining/menu-type/vc_grange/"
    

if __name__ == "__main__":
    #api url currently only for Sewall breakfast
    #pick whatever url you want from the txt file and put into here
    url = "https://colorado-diningmenus.api.nutrislice.com/menu/api/weeks/school/center-for-community/menu-type/persian/2025/02/21"
    menu_data = fetch_menu(url)
    if menu_data:
        today_date, menu_list = extract_today_meals(menu_data)
        print_menu(today_date, menu_list)