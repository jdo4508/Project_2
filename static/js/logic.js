var colorScale;




d3.csv("http://data.insideairbnb.com/united-states/nc/asheville/2020-05-29/visualisations/listings.csv", function(response) {
  //d3.json("/listings", function(response) {
//d3.json("/listings").then((response) => {
   //console.log(response);

    colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    var radiusScale = d3.scaleLinear()
      .domain([0, d3.max (response, function(listings) { return +listings.price; })])
      .range([1, 10]);

      var geoJSONListingsFeatures = [];  

      response.forEach(function(listings, i) {
        var info = "<span style='color:" + colorScale(listings.room_type) + "'><b>" +
                    listings.name + "</b></span><br/>" +
                    "room type: <b>" + listings.room_type + "</b>" +  "</b></span><br/>" +
                    "price: <b>" + "$" + listings.price + "</b>" + "</b></span><br/>";

       

        var geoJSONFeatures = {
                      "type": "Feature",
                      "properties": { 
                          "color":  colorScale(listings.room_type),
                          "info":   info
                      },
                      "geometry": {
                          "type": "Point",
                          "coordinates": [ +listings.longitude, +listings.latitude ] 
                      }
                  };
                  geoJSONListingsFeatures.push(geoJSONFeatures);
              });

              makeListingMap(geoJSONListingsFeatures);
          });   
          
          


    // Creating map object
    var makeListingMap = function(geoJSONListingsFeatures) {

    var myMap = L.map("map-container", {
      center: [35.54, -82.55],
      zoom: 12
    });

    // Adding tile layer to the map
    var tileLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: 'mapbox/streets-v11',
      accessToken: API_KEY
    }).addTo(myMap);

    L.geoJson(geoJSONListingsFeatures, {
      style: function (feature) {
          return {
              color:       '#000',
              opacity:     0,
              radius:      (feature.properties.capacity = 3),
              fillColor:   feature.properties.color,
              fillOpacity: 0.5
          };
      },
      onEachFeature: function (feature, layer) {
          layer.bindPopup(feature.properties.info);
      },
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
      }

  }).addTo(myMap);

  // Add legend with d3
  var legendWidth  = 110,
  legendHeight = 80;

var legend = d3.select('#map-legend').append('svg')
  .attr('width', legendWidth)
  .attr('height', legendHeight);

var legends = legend.selectAll(".legend")
  .data(colorScale.domain())
.enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(0," + i * 20
   + ")"; });

// draw legend colored rectangles
legends.append("rect")
  .attr("x", legendWidth - 18)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", colorScale);

// draw legend text
legends.append("text")
  .attr("x", legendWidth - 20)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(function(d) { return d.toLowerCase(); })
};