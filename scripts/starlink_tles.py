import requests
import json

def fetch_starlink_tles():
    url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=STARLINK&FORMAT=TLE"
    response = requests.get(url)
    
    if response.status_code != 200:
        print("Error fetching TLE data")
        return []
    
    tles = response.text.strip().split("\n")
    sat_list = []

    # Process the TLE data
    for i in range(0, len(tles), 3):
        satellite_name = tles[i].strip()
        tle_line1 = tles[i+1].strip()
        tle_line2 = tles[i+2].strip()

        sat_list.append({
            "satelliteName": satellite_name,
            "tleLine1": tle_line1,
            "tleLine2": tle_line2
        })

    return sat_list

def save_tles_to_file(tles, filename="starlink_tles.json"):
    with open(filename, 'w') as f:
        json.dump(tles, f, indent=4)
    print(f"TLE data saved to {filename}")

def main():
    starlink_tles = fetch_starlink_tles()
    
    if starlink_tles:
        save_tles_to_file(starlink_tles)

if __name__ == "__main__":
    main()
