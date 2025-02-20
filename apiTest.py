import requests
from datetime import datetime

date2use = datetime.today()

# Format the date in the required '/YYYY/MM/DD/' format
today_date = date2use.strftime('/%Y/%m/%d/')

url = "https://colorado-diningmenus.nutrislice.com/menu/sewall-dining-center/executive-chefs-place/{today_date}?format=json"

response = requests.get(url)

# Print the status code and response text
print(f"Status Code: {response.status_code}")
#print(f"Response Text: {response.text.strip()}")  # This will show what the API actually returns

with open("api_output.txt", "w", encoding="utf-8") as file:
    file.write(response.text)

if response.status_code == 200 and response.text.strip():
    try:
        data = response.json()  # Convert to JSON
        print("JSON Response:", data)
    except requests.exceptions.JSONDecodeError:
        print("Error: API response is not valid JSON")
else:
    print("Error: API returned an empty or invalid response")

