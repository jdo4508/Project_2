// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 50, left: 40},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#my_histo")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.json("../data/listings-1.json", function(data) {

  // X axis: scale and draw:
  var x = d3.scaleLinear()
      .domain([0, 1300])     
      .range([0, width]);
      
      
  svg2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  svg2.append("text")
      .attr("text-anchor", "end")
      .attr("x", width/2 + margin.left)
      .attr("y", height + margin.top + 25)
      .text("Price");

  // Y axis: initialization
  var y = d3.scaleLinear()
      .range([height, 0]);
  var yAxis = svg2.append("g")

  // A function that builds the graph for a specific value of bin
  function update(nBin) {

    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function(d) { return d.price; })   
        .domain(x.domain())  
        .thresholds(x.ticks(nBin)); 

    // And apply this function to data to get the bins
    var bins = histogram(data);

    // Y axis: update now that we know the domain
    y.domain([0, d3.max(bins, function(d) { return d.length; })]);   
    yAxis
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y));

    // Join the rect with the bins data
    var u = svg2.selectAll("rect")
        .data(bins)

    // Manage the existing bars and eventually the new ones:
    u
        .enter()
        .append("rect") 
        .merge(u) 
        .transition() 
        .duration(1000)
          .attr("x", 1)
          .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
          .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
          .attr("height", function(d) { return height - y(d.length); })
          .style("fill", "#69b3a2")


    // If less bar in the new histogram, I delete the ones not in use anymore
    u
        .exit()
        .remove()

    }


  // Initialize with 20 bins
  update(20)


  // Listen to the button -> update if user change it
  d3.select("#nBin").on("input", function() {
    update(+this.value);
  });

});