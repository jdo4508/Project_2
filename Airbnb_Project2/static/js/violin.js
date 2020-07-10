var margin = {top: 10, right: 30, bottom: 40, left: 50},
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg3 = d3.select("#my_violin")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Read the data and compute summary statistics for each specie
d3.json("/data/listings-1.json", function(data) {

  // Build and Show the Y scale
  var y = d3.scaleLinear()
    .domain([ 0,800 ])          
    .range([height, 0])
  svg3.append("g").call( d3.axisLeft(y) )

  // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.room_type; }))
    .padding(0.05)     
  svg3.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  svg3.append("text")
    .attr("text-anchor", "end")
    .attr("x", width/2 + margin.left)
    .attr("y", height + margin.top + 25)
    .text("Room Type");

  svg3.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 15)
    .attr("x", -margin.top - height/2 + 20)
    .text("Price");

  // Features of the histogram
  var histogram = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(20))    
        .value(d => d)

  // Compute the binning for each group of the dataset
  var sumstat = d3.nest()  
    .key(function(d) { return d.room_type;})
    .rollup(function(d) {   
      input = d.map(function(g) { return g.price;})    
      bins = histogram(input)   
      return(bins)
    })
    .entries(data)

  // What is the biggest number of value in a bin? 
  var maxNum = 0
  for ( i in sumstat ){
    allBins = sumstat[i].value
    lengths = allBins.map(function(a){return a.length;})
    longuest = d3.max(lengths)
    if (longuest > maxNum) { maxNum = longuest }
  }

  // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
  var xNum = d3.scaleLinear()
    .range([0, x.bandwidth()])
    .domain([-maxNum,maxNum])

  // Add the shape to this svg!
  svg3
    .selectAll("myViolin")
    .data(sumstat)
    .enter()        
    .append("g")
      .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } ) 
    .append("path")
        .datum(function(d){ return(d.value)})     
        .style("stroke", "none")
        .style("fill","#69b3a2")
        .attr("d", d3.area()
            .x0(function(d){ return(xNum(-d.length)) } )
            .x1(function(d){ return(xNum(d.length)) } )
            .y(function(d){ return(y(d.x0)) } )
            .curve(d3.curveCatmullRom)    
        )
})