import simplekml
import zipfile
import os
from datetime import datetime, timedelta
import random

def generate_single_flight_ground_track_kmz(
    filename: str,
    start_point: tuple, # (longitude, latitude, altitude_meters)
    end_point: tuple,   # (longitude, latitude, altitude_meters)
    num_points: int = 100,
    flight_name: str = "F9 Ground Track",
    start_time: datetime = datetime.now()
):
    """
    Generates a single F9 flight ground track KMZ file using linear interpolation.
    The trajectory is a simple straight line in 3D space, projected onto the ground.

    Args:
        filename (str): The name of the output KMZ file.
        start_point (tuple): (longitude, latitude, altitude_meters) of the start.
        end_point (tuple): (longitude, latitude, altitude_meters) of the end.
        num_points (int): Number of points to generate along the trajectory.
        flight_name (str): Name for the flight path in KML.
        start_time (datetime): The starting time for the flight trajectory.
    """
    kml = simplekml.Kml()

    # Create a LineString for the flight path
    linestring = kml.newlinestring(name=flight_name)
    linestring.style.linestyle.color = simplekml.Color.blue  # Blue line for visibility
    linestring.style.linestyle.width = 4  # Thicker line
    linestring.altitudemode = simplekml.AltitudeMode.absolute # Altitudes are absolute from sea level
    linestring.extrude = 1 # Extrude the line to the ground, useful for visualization
    linestring.tessellate = 1 # Break the line into smaller segments for better rendering

    coordinates = []
    # Approximate duration for an F9 ascent ground track (e.g., 10 minutes from launch to orbital insertion)
    total_duration_seconds = 10 * 60

    # Generate points along the trajectory using linear interpolation
    for i in range(num_points):
        # Factor determines progress along the path (0 at start, 1 at end)
        factor = i / (num_points - 1) if num_points > 1 else 0

        # Interpolate longitude, latitude, and altitude
        lon = start_point[0] + (end_point[0] - start_point[0]) * factor
        lat = start_point[1] + (end_point[1] - start_point[1]) * factor
        alt = start_point[2] + (end_point[2] - start_point[2]) * factor

        coordinates.append((lon, lat, alt))

        # Add Placemarks for time-aware visualization (e.g., in Google Earth Pro)
        # Add a placemark at the start, end, and a few points in between.
        current_time = start_time + timedelta(seconds=total_duration_seconds * factor)
        if i % (num_points // 5) == 0 or i == num_points - 1:
            p = kml.newpoint(name=f"Point {i+1}", coords=[(lon, lat, alt)])
            # ISO 8601 format with 'Z' for UTC
            p.timestamp.when = current_time.isoformat() + "Z"
            p.description = (
                f"Time: {current_time.strftime('%Y-%m-%d %H:%M:%S')} UTC\n"
                f"Altitude: {alt:.0f}m\n"
                f"Lat: {lat:.4f}, Lon: {lon:.4f}"
            )

    linestring.coords = coordinates

    # Add distinct Placemarks for the start and end points of the flight
    start_placemark = kml.newpoint(name=f"{flight_name} Start", coords=[(start_point[0], start_point[1], start_point[2])])
    start_placemark.style.iconstyle.icon.href = 'http://maps.google.com/mapfiles/kml/paddle/grn-blank.png' # Green start icon
    start_placemark.description = f"Starting point of {flight_name}.\nAltitude: {start_point[2]:.0f}m"

    end_placemark = kml.newpoint(name=f"{flight_name} End", coords=[(end_point[0], end_point[1], end_point[2])])
    end_placemark.style.iconstyle.icon.href = 'http://maps.google.com/mapfiles/kml/paddle/red-blank.png' # Red end icon
    end_placemark.description = f"Ending point of {flight_name}.\nAltitude: {end_point[2]:.0f}m"

    # Save the KML to a temporary file
    kml_filename = filename.replace(".kmz", ".kml")
    kml.save(kml_filename)

    # Create the KMZ archive by zipping the KML file
    with zipfile.ZipFile(filename, 'w', zipfile.ZIP_DEFLATED) as kmz_file:
        kmz_file.write(kml_filename, os.path.basename(kml_filename))

    # Clean up the temporary KML file
    os.remove(kml_filename)
    print(f"Generated KMZ file: {filename}")

def generate_dispersed_f9_flight_kmzs(
    output_dir: str = "f9_ground_tracks_for_heatmap",
    num_dispersions_per_profile: int = 4,
    dispersion_radius_degrees: float = 0.75,
    num_points_per_track: int = 150
):
    """
    Generates KMZ files for multiple F9 flight ground tracks, including dispersed variations.
    Each distinct flight path is saved as a separate KMZ file.

    Args:
        output_dir (str): Directory to save the generated KMZ files.
        num_dispersions_per_profile (int): Number of dispersed variants generated for each
                                           nominal flight profile.
        dispersion_radius_degrees (float): Maximum random offset (in degrees) applied to the
                                           end point's latitude and longitude for dispersed flights.
                                           The start point (launch site) remains constant for
                                           dispersions of a single profile.
        num_points_per_track (int): Number of points to generate for each ground track's trajectory.
    """
    # Create the output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    print(f"KMZ files will be saved in: {os.path.abspath(output_dir)}")

    # Define a few representative nominal F9 mission profiles for ground tracks
    # These represent the ascent phase of a rocket launch.
    # Format: "Profile Name": { "start": (lon, lat, alt_start_m), "end": (lon, lat, alt_end_m) }
    nominal_profiles = {
        "Cape_Canaveral_East_GTO": {
            "start": (-80.60, 28.40, 100), # Kennedy Space Center / Cape Canaveral, Florida (low altitude start)
            "end": (-20.00, 10.00, 200000) # Mid-Atlantic, near the equator, high altitude (simulating orbital insertion point)
        },
        "Vandenberg_Polar_SSO": {
            "start": (-120.62, 34.63, 100), # Vandenberg Space Force Base, California (low altitude start)
            "end": (-125.00, -20.00, 200000) # Eastern Pacific Ocean, trending south, high altitude
        },
        "Cape_Canaveral_NorthEast_ISS": {
            "start": (-80.60, 28.40, 100), # Kennedy Space Center / Cape Canaveral, Florida (low altitude start)
            "end": (-40.00, 40.00, 200000) # North Atlantic, trending northeast, high altitude
        }
    }

    flight_counter = 1
    for profile_name, profile_coords in nominal_profiles.items():
        nominal_start = profile_coords["start"]
        nominal_end = profile_coords["end"]

        # Generate the nominal (ideal) flight KMZ for this profile
        nominal_filename = os.path.join(output_dir, f"F9_Track_{profile_name}_Nominal.kmz")
        generate_single_flight_ground_track_kmz(
            filename=nominal_filename,
            start_point=nominal_start,
            end_point=nominal_end,
            num_points=num_points_per_track,
            flight_name=f"{profile_name} Nominal Track",
            # Stagger start times slightly for distinct KMZ internal timestamps if needed
            start_time=datetime.now() + timedelta(minutes=flight_counter * 5)
        )
        flight_counter += 1

        # Generate 'dispersed' flight KMZs for this nominal profile
        # Each dispersed flight will have its end point slightly varied.
        for i in range(num_dispersions_per_profile):
            # Apply a random offset to the end point's longitude and latitude
            # This simulates slight variations in target orbit or ascent trajectory.
            disp_lon_offset = random.uniform(-dispersion_radius_degrees, dispersion_radius_degrees)
            disp_lat_offset = random.uniform(-dispersion_radius_degrees, dispersion_radius_degrees)

            dispersed_end_point = (
                nominal_end[0] + disp_lon_offset,
                nominal_end[1] + disp_lat_offset,
                nominal_end[2] # Altitude remains the same as nominal end altitude
            )

            dispersed_filename = os.path.join(output_dir, f"F9_Track_{profile_name}_Dispersion_{i+1}.kmz")
            generate_single_flight_ground_track_kmz(
                filename=dispersed_filename,
                start_point=nominal_start,
                end_point=dispersed_end_point,
                num_points=num_points_per_track,
                flight_name=f"{profile_name} Dispersed Track {i+1}",
                start_time=datetime.now() + timedelta(minutes=flight_counter * 5)
            )
            flight_counter += 1

    print(f"\nSuccessfully generated {flight_counter - 1} F9 ground track KMZ files in '{output_dir}'.")
    print("These KMZ files represent various F9 flight ground tracks and can be used to generate a heatmap.")
    print("You can open these '.kmz' files in Google Earth Pro to view the individual trajectories.")

if __name__ == "__main__":
    # Example usage:
    # This will create a directory 'f9_ground_tracks_for_heatmap'
    # containing KMZ files for nominal and dispersed flight paths.
    generate_dispersed_f9_flight_kmzs(
        output_dir="f9_ground_tracks_for_heatmap",
        num_dispersions_per_profile=4,   # For each of the 3 nominal profiles, generate 4 dispersed variants
        dispersion_radius_degrees=0.75,  # End points will vary by up to +/- 0.75 degrees in lat/lon
        num_points_per_track=150         # Each ground track will have 150 points
    )
