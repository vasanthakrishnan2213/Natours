const mapElement = document.getElementById('map');

if (mapElement) {
  const locations = JSON.parse(mapElement.dataset.locations);
  
mapboxgl.accessToken =
'pk.eyJ1IjoidmFzYW50aGFrcmlzaG5hbiIsImEiOiJjbHpkd2Y1b3owdTh1MnNwa3JzYzl3dDZzIn0.s3DY-lMksTY6FnPHMUhyug';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/vasanthakrishnan/clzp642rw008o01qtcma034lb', // style URL
scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
// Create Marker
const el = document.createElement('div');
el.className = 'marker';

// Add Marker
new mapboxgl.Marker({
  element: el,
  anchor: 'bottom',
})
  .setLngLat(loc.coordinates)
  .addTo(map);

// Add Popup
new mapboxgl.Popup({
  offset: 30,
})
  .setLngLat(loc.coordinates)
  .setHTML(`<p> Day ${loc.day} : ${loc.description}</p>`)
  .addTo(map);

//Extend map bounds to include current locations
bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
padding: {
  top: 200,
  bottom: 150,
  left: 100,
  right: 100,
},
});
}


// mapboxgl.accessToken =
//   'pk.eyJ1IjoidmFzYW50aGFrcmlzaG5hbiIsImEiOiJjbHpkd2Y1b3owdTh1MnNwa3JzYzl3dDZzIn0.s3DY-lMksTY6FnPHMUhyug';
// const map = new mapboxgl.Map({
//   container: 'map', // container ID
//   style: 'mapbox://styles/vasanthakrishnan/clzp642rw008o01qtcma034lb', // style URL
//   scrollZoom: false,
// });

// const bounds = new mapboxgl.LngLatBounds();

// locations.forEach((loc) => {
//   // Create Marker
//   const el = document.createElement('div');
//   el.className = 'marker';

//   // Add Marker
//   new mapboxgl.Marker({
//     element: el,
//     anchor: 'bottom',
//   })
//     .setLngLat(loc.coordinates)
//     .addTo(map);

//   // Add Popup
//   new mapboxgl.Popup({
//     offset: 30,
//   })
//     .setLngLat(loc.coordinates)
//     .setHTML(`<p> Day ${loc.day} : ${loc.description}</p>`)
//     .addTo(map);

//   //Extend map bounds to include current locations
//   bounds.extend(loc.coordinates);
// });

// map.fitBounds(bounds, {
//   padding: {
//     top: 200,
//     bottom: 150,
//     left: 100,
//     right: 100,
//   },
// });
