import requests
import json

def fetch_satnogs_ground_stations():
    url = "https://network.satnogs.org/api/stations/"
    response = requests.get(url)
    response.raise_for_status()
    stations = response.json()

    print(f"Total stations returned by API: {len(stations)}")

    valid_stations = [s for s in stations if s.get("lat") is not None and s.get("lng") is not None]
    print(f"Stations with valid lat/lng: {len(valid_stations)}")

    clean_stations = []
    for s in valid_stations:
        # Copy all fields except rename 'lng' to 'lon'
        station_data = dict(s)  # shallow copy
        station_data["lon"] = station_data.pop("lng")  # rename key

        clean_stations.append(station_data)

    return clean_stations

def main():
    print("Fetching SatNOGS ground stations...")
    stations = fetch_satnogs_ground_stations()
    print(f"Fetched {len(stations)} stations with valid coordinates.")

    filename = "satnogs_ground_stations.json"
    with open(filename, "w") as f:
        json.dump(stations, f, indent=2)
    print(f"Saved data to {filename}")

if __name__ == "__main__":
    main()
