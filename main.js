const searchInput =
    document.getElementById("search");
const searchButton =
    document.getElementById("searchBtn");
const resultsContainer =
    document.getElementById("results");

const API_KEY = "fsq3ubELyorOQq7lNRZhQQ4FZ2H+vLb+9t+tIhzCMP/xl9s=";

searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return alert("Please enter a search term.");
    getUserLocation(query);
});

function getUserLocation(query) {
    if (!navigator.geolocation) {
        alert("Geolocation not support by your browser.");
        return;
    }
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        initMAp(latitude,longitude);
        fetchPlaces(query, latitude, longitude);
    },
        error => {
            alert("Unable to access location.");
        }
    );
}

function fetchPlaces(query, lat, lng) {
    const url =`https://api.foursquare.com/v3/places/search?query=${query}&11=${lat},${lng}&limit=10`;

    fetch(url, {
        headers: {
            Accept:"application/json",
            Authorization: API_KEY
        }
    })
    .then(res => res.json())
    .then(data => displayResults(data.results))
    .catch(err => {
        console.error(err);
        alert("Failed to fetch places.")
    });
}

function displayResults(places) {
    resultsContainer.innerHTML="";

    if(!places || places.length === 0){
        resultsContainer.innerHTML = "<p>No places found.</p>";
        return;
    }

    places.forEach(place => {
        const card = document.createElement("div");
        card.className = "location-card";
        card.innerHTML=`
        <h2>${place.name}</h2>
        <p>${place.location.address || "No address available"}</p>
        `;
        resultsContainer.appendChild(card); 

        const{latitude, longitude}= place.geocodes.main;
        L.marker([latitude,longitude]).addTo(map).bindPopup(`<strong>${place.name}</strong><br>${place.location.address || ''}`);
    });
}

let map, userMarker;

function initMAp(lat, lng){
    if(!map){
        map = L.map('map').setView([lat, lng], 14);

        L.titleLayer('https://{s}.title.openstreetmap.org/{z}/{x}/{y}.png',{
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        userMarker = L.marker([lat, lng]).addTo(map).bindPopup("You are here").openPopup();
    }else{
        map.setView([lat, lng], 14);
        userMarker.setLatLng([lat,lng]);
    }
}
