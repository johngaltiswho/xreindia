mapboxgl.accessToken = 'pk.eyJ1Ijoiam9obmdhbHRpc3dobyIsImEiOiJjajNyZjl3eDYwMWJiMnBvNmlnd3pjcWJqIn0.b-03hU-DxQF21JQC7v5j8g';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/johngaltiswho/cjbkz1hlb2pc22spowax5iq7v',
  center: [77.5946, 12.9716 ],
  zoom: 9
});

//Code in order for remove() to work in older browsers
if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

map.on('load', function(e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['xre-india-listings']});
  buildListings(features);
});

function buildListings(data) {
  // Iterate through the listings
  for (i = 0; i < data.length; i++) {
    var currentFeature = data[i];
    var prop = currentFeature.properties;
    // Select the listing container in the HTML and append a div with the class 'item' for each listing
    var listings = document.getElementById('listings');
    var listing = listings.appendChild(document.createElement('div'));
    listing.className = 'item';
    listing.id = 'listing-' + i;
    // Create a new img for each listing and fill it with the Listings Image
    var figure = document.createElement("figure");
    var img = document.createElement("img");
    img.src = prop.Image;
    listing.appendChild(figure);
    figure.appendChild(img);
    // Create a new link with the class 'title' for each listing and fill it with the Listing's Title
    var link = listing.appendChild(document.createElement('div'));
    link.href = '#';
    link.className = 'title';
    link.dataPosition = i;
    link.innerHTML = prop.Title;
    //document.body.appendChild(link);
    // Create a new a for each listing and fill it with the information
    var name = link.appendChild(document.createElement('a'));
    name.className = 'details';
    name.innerHTML = prop.Name;
    name.id = 'propname';

    var structure = link.appendChild(document.createElement('a'));
    structure.className = 'details';
    structure.innerHTML = prop.Structure;
    structure.id = "propstruct"

    var price = link.appendChild(document.createElement('a'));
    price.className = 'details';
    price.innerHTML = prop.Price;
    price.id = 'propprice';

    var sf = link.appendChild(document.createElement('a'));
    sf.className = 'details';
    sf.innerHTML = prop.SF;
    sf.id = 'fontchange';

    var pricesft = link.appendChild(document.createElement('a'));
    pricesft.className = 'details';
    pricesft.innerHTML = prop.PricePerSF;
    pricesft.id = 'pricesft';

    // Add an event listener for the links in the sidebar listing
    link.addEventListener('click', function(e) {
      // Update the currentFeature to the store associated with the clicked link
      var clickedListing = data[this.dataPosition];
      // 1. Fly to the point associated with the clicked link
      flyToProject(clickedListing);
      // 2. Close all other popups and display popup for clicked store
      //createPopUp(clickedListing);
      // 3. Highlight listing in sidebar (and remove highlight for all other listings)
      var activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      this.parentNode.classList.add('active');
    });
  }
}

function flyToProject(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
  });
}

function createPopUp(currentFeature) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  // Check if there is already a popup on the map and if so, remove it
  if (popUps[0]) popUps[0].remove();

  var feature = features[0];
  popup.setLngLat(feature.geometry.coordinates)
    .setHTML('<figure class="pop"> <img class="pop" src=' + feature.properties.Image + '></figure><div class="popup"><h3>' + feature.properties.Title + '</h3><p id = propname>' + feature.properties.Name + '</p>'
      +  '<p id = "propstructpopup">' + feature.properties.Structure + '</p>' + '<p id = "proppricepopup">' + feature.properties.Price + '</p>' + '<p id = "fontchangepopup">' + feature.properties.SF + '</p>'
        + '<p id = "pricesftpopup">' + feature.properties.PricePerSF + '</p></div>')
    .setLngLat(feature.geometry.coordinates)
    .addTo(map);
}

// Add an event listener for when a user clicks on the map
map.on('click', function(e) {
  // Query all the rendered points in the view
  var features = map.queryRenderedFeatures(e.point, { layers: ['xre-india-listings'] });
  if (features.length) {
    var clickedPoint = features[0];
    // 1. Fly to the point
    flyToProject(clickedPoint);
    // 2. Close all other popups and display popup for clicked store
    //createPopUp(clickedPoint);
    // 3. Highlight listing in sidebar (and remove highlight for all other listings)
    var activeItem = document.getElementsByClassName('active');
    if (activeItem[0]) {
      activeItem[0].classList.remove('active');
    }
    // Find the index of the store.features that corresponds to the clickedPoint that fired the event listener
    var selectedFeature = clickedPoint.properties.Title;

    for (var i = 0; i < features.length; i++) {
      if (features[i].properties.Title === selectedFeature) {
        selectedFeatureIndex = i;
      }
    }
    // Select the correct list item using the found index and add the active class
    var listing = document.getElementById('listing-' + selectedFeatureIndex);
    listing.classList.add('active');
  }
});

var popup = new mapboxgl.Popup({
    offset: [0, -15],
    closeButton: false
});

map.on('mousemove', function(e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['xre-india-listings']});
  map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

  if (!features.length) {
    popup.remove();
    return;
  }

  var feature = features[0];
  popup.setLngLat(feature.geometry.coordinates)
    .setHTML('<figure class="pop"> <img class="pop" src=' + feature.properties.Image + '></figure><div class="popup"><h3>' + feature.properties.Title + '</h3><p id = propname>' + feature.properties.Name + '</p></div>'
      +  '<div class = popup2><p id = "propstruct">' + feature.properties.Structure + '</p><p id = "propprice">' + feature.properties.Price + '</p></div><div class = popup2><p id = "fontchange">' + feature.properties.SF +
      '</p><p id = "pricesft">' + feature.properties.PricePerSF + '</p></div>')
    .setLngLat(feature.geometry.coordinates)
    .addTo(map);
});
