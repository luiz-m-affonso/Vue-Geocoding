<template>
	<div class="h-screen relative">
		<GeoErrorModal/>
		<div id="map" class="h-full z-[1]"></div>
	</div>
</template>

<script>
import leaflet from 'leaflet';
import { onMounted, ref } from "vue";
import GeoErrorModal from '@/components/GeoErrorModal.vue';

export default {
	name: 'HomeView',
	components: { GeoErrorModal },
	setup() {
		let map;
		onMounted(() => {
			map = leaflet.map('map').setView([51.505, -0.09], 13);
			leaflet.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.VUE_APP_API_KEY}`, {
				attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				maxZoom: 18,
				id: 'mapbox/streets-v11',
				tileSize: 512,
				zoomOffset: -1,
				accessToken: process.env.VUE_APP_API_KEY
			}).addTo(map);
			getGeolocation();
		});

		const coords = ref(null);
		const fetchCoordinates = ref(null);
		const geoMarker = ref(null);
		const geoError = ref(null);
		const geoErrorMessage = ref(null);

		const getGeolocation = () => {
			if (sessionStorage.getItem('coords')) {
					coords.value = JSON.parse(sessionStorage.getItem('coords'));
					plotGeolocation(coords.value);
					return;
			}

			fetchCoordinates.value = true;
			navigator.geolocation.getCurrentPosition(setCoordinates, getLocationError);
		};

		const setCoordinates = (position) => {
			fetchCoordinates.value = null;

			const setSessionCoordinates = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
			}

			sessionStorage.setItem('coords', JSON.stringify(setSessionCoordinates));
			coords.value = setSessionCoordinates;
			plotGeolocation(coords.value);
		};

		const plotGeolocation = (coords) => {
			const customMarker = leaflet.icon({
				iconUrl: require('../assets/map-marker-red.svg'),
				iconSize: [35, 35]
			});

			geoMarker.value = leaflet
			.marker([coords.lat, coords.lng], { icon: customMarker })
			.addTo(map);
			map.setView([coords.lat, coords.lng], 10);
		}

		const getLocationError = (error) => {
			fetchCoordinates.value = null;
			geoError.value = true;
			geoErrorMessage.value = error.message;
		};

		const closeGeolocationError = () => {
			geoError.value = null;
			geoErrorMessage.value = null;
		};

		return { coords, geoMarker, closeGeolocationError }
	}
};
</script>
