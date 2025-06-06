import simplekml
import zipfile
import os
from datetime import datetime, timedelta

# Import geopy for more realistic path generation (optional, not used in current linear interpolation)
# from geopy.distance import great_circle
# from geopy.point import Point

def generate_sample_flight_trajectory_kmz(
    filename="cape_canaveral_to_indian_ocean.kmz",
    # Coordinates for Cape Canaveral (approx)
    start_point=(-80.60, 28.40, 10000), # Longitude, Latitude, Altitude (meters)
    # Coordinates for a point in the central Indian Ocean (approx)
    end_point=(80.00, -10.00, 11000),   # Longitude, Latitude, Altitude (meters)
    num_points=100, # Increased points for a longer path
    start_time=datetime.now()
):
    """
    Generates a sample flight trajectory KMZ file between Cape Canaveral and the Indian Ocean.
    Note: This uses linear interpolation for simplicity, which will appear as a straight line
    on a flat projection. For a true arc over the globe, consider great-circle calculations.

    Args:
        filename (str): The name of the output KMZ file.
        start_point (tuple): (longitude, latitude, altitude_meters) of the start.
        end_point (tuple): (longitude, latitude, altitude_meters) of the end.
        num_points (int): Number of points to generate along the trajectory.
        start_time (datetime): The starting time for the flight trajectory.
    """
    kml = simplekml.Kml()

    # Define the flight path as a LineString
    linestring = kml.newlinestring(name="Cape Canaveral to Indian Ocean Flight Path")
    linestring.style.linestyle.color = simplekml.Color.blue  # Changed color for distinction
    linestring.style.linestyle.width = 4 # Make the line a bit thicker
    linestring.altitudemode = simplekml.AltitudeMode.absolute # Altitudes are absolute (from sea level)
    linestring.extrude = 1 # Extrude the line to the ground (optional, good for visualization)
    linestring.tessellate = 1 # Break the line into smaller segments for better rendering

    # Generate points along the trajectory
    coordinates = []
    current_time = start_time
    # Approximate duration for a long-haul flight (e.g., 15 hours)
    total_duration_seconds = 15 * 3600

    for i in range(num_points):
        # Linear interpolation for longitude, latitude, and altitude
        factor = i / (num_points - 1) if num_points > 1 else 0
        lon = start_point[0] + (end_point[0] - start_point[0]) * factor
        lat = start_point[1] + (end_point[1] - start_point[1]) * factor
        alt = start_point[2] + (end_point[2] - start_point[2]) * factor

        coordinates.append((lon, lat, alt))

        # Add timestamps for Placemarks (optional, but good for time-aware KML players)
        # We'll add a Placemark every 20 points for simplicity, showing time.
        if i % (num_points // 5) == 0 or i == num_points - 1: # Add points at start, end, and few in between
            p = kml.newpoint(name=f"Point {i+1}", coords=[(lon, lat, alt)])
            p.timestamp.when = current_time.isoformat() + "Z" # ISO 8601 format with Z for UTC
            p.description = (
                f"Time: {current_time.strftime('%Y-%m-%d %H:%M:%S')} UTC\n"
                f"Altitude: {alt:.0f}m\n"
                f"Lat: {lat:.4f}, Lon: {lon:.4f}"
            )

        # Increment time for the next point
        current_time += timedelta(seconds=total_duration_seconds / num_points)

    linestring.coords = coordinates

    # Add start and end point Placemarks for clarity
    start_placemark = kml.newpoint(name="Cape Canaveral (Start)", coords=[(start_point[0], start_point[1], start_point[2])])
    start_placemark.style.iconstyle.icon.href = 'http://maps.google.com/mapfiles/kml/paddle/red-diamond.png'
    start_placemark.description = f"Starting point of the flight.\nAltitude: {start_point[2]:.0f}m"

    end_placemark = kml.newpoint(name="Indian Ocean (End)", coords=[(end_point[0], end_point[1], end_point[2])])
    end_placemark.style.iconstyle.icon.href = 'http://maps.google.com/mapfiles/kml/paddle/blu-diamond.png'
    end_placemark.description = f"Ending point of the flight.\nAltitude: {end_point[2]:.0f}m"


    # Save the KML to a temporary file
    kml_filename = filename.replace(".kmz", ".kml")
    kml.save(kml_filename)

    # Create the KMZ archive
    with zipfile.ZipFile(filename, 'w', zipfile.ZIP_DEFLATED) as kmz_file:
        kmz_file.write(kml_filename, os.path.basename(kml_filename))

    # Clean up the temporary KML file
    os.remove(kml_filename)

    print(f"Generated KMZ file: {filename}")
    print(f"You can open '{filename}' in Google Earth Pro to view the trajectory.")

if __name__ == "__main__":
    generate_sample_flight_trajectory_kmz()