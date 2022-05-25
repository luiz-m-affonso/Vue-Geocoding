<template>
    <div class="h-screen relative">
        <div id="map" class="h-full z-[1]"></div>
    </div>
</template>

<script>
import leaflet from 'leaflet';
import { onMounted, ref } from "vue";

export default {
    name: 'HomeView',
    components: {},
    setup() {
        let map;
        onMounted(() => {
            // init map
            map = leaflet.map('map').setView([51.505, -0.09], 13);

            // add tile layers
            leaflet.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.VUE_APP_API_KEY}`, {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: process.env.VUE_APP_API_KEY
            }).addTo(map);
            // get users location
            getGeolocation();
        });

        // const coords = ref(null);
        const fetchCoords = ref(null);
        // const geoMarker = ref(null);

        const getGeolocation = () => {
            fetchCoords.value = true;
            navigator.geolocation.getCurrentPosition(setCoords, getLocationError);
        };

        const setCoords = (position) => {
            console.log(position)
        };

        const getLocationError = (error) => {
            console.log(error)
        };
    }
};
</script>
