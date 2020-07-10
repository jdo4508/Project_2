// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 40, left: 60},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the SVG object to the body of the page
var SVG2 = d3.select("#my_scatter2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


//Read the data
d3.json("static/data/listings-1.json", function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 1300])
    .range([ 0, width ]);
  var xAxis = SVG2.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
 

  SVG2.append("text")
    .attr("text-anchor", "end")
    .attr("x", width/2 + margin.left)
    .attr("y", height + margin.top + 25)
    .text("Price");

  SVG2.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 15)
    .attr("x", -margin.top - height/2 + 20)
    .text("Total Reviews");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 130])
    .range([ height, 0]);
  var yAxis = SVG2.append("g")
    .call(d3.axisLeft(y));

  
        
  // Add a clipPath: everything out of this area won't be drawn.
  var clip = SVG2.append("defs").append("SVG2:clipPath")
      .attr("id", "clip")
      .append("SVG2:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0);

  // Create the scatter variable: where both the circles and the brush take place
  var scatter = SVG2.append('g')
    .attr("clip-path", "url(#clip)")

  // Add circles
  scatter
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.price); } )
      .attr("cy", function (d) { return y(d.number_of_reviews)} )
      .attr("r", 4)
      .style("fill", "#61a3a9")
      .style("opacity", 0.5)
      .style("display", function(d) { return d.number_of_reviews== null ? "none" : null; })
      .style("fill", "rgba(198, 45, 205, 0.8)" )

  // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
  var zoom = d3.zoom()
      .scaleExtent([.5, 20])  
      .extent([[0, 0], [width, height]])
      .on("zoom", updateChart);

  // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
  SVG2.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom);
  // now the user can zoom and it will trigger the function called updateChart

  // A function that updates the chart when the user zoom and thus new boundaries are available
  function updateChart() {

    // recover the new scale
    var newX = d3.event.transform.rescaleX(x);
    var newY = d3.event.transform.rescaleY(y);

    // update axes with these new boundaries
    xAxis.call(d3.axisBottom(newX))
    yAxis.call(d3.axisLeft(newY))

    // update circle position
    scatter
      .selectAll("circle")
      .attr('cx', function(d) {return newX(d.price)})
      .attr('cy', function(d) {return newY(d.number_of_reviews)});
  
    
     
  }

});