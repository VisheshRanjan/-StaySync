const { token, coordinates, title, error } = window.mapData || {};
const mapError = document.getElementById("map-error");

const showMapError = (message) => {
  console.error(message);
  if (mapError) {
    mapError.textContent = message;
    mapError.hidden = false;
  }
};

if (!token || !Array.isArray(coordinates) || coordinates.length !== 2) {
  showMapError(error || "Unable to load the map because this listing has no coordinates.");
} else {
  mapboxgl.accessToken = token;

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,
    zoom: 9,
  });

  new mapboxgl.Marker({color:"red"})
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(title || "Listing location"))
    .addTo(map);

  map.on("error", (event) => {
    showMapError(`Mapbox error: ${event.error.message}`);
  });
}
