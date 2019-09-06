function myJs(dump_v, dump_v2) {

//Split dump_v string to extract all attributes informations and data

  var dump_val = dump_v.split('/');
  var dump_val2 = dump_v2.split('/');
  var dataFormatter = dump_val[0];
  var chartColor = dump_val[1];
  var chartHeight = dump_val[2];
  var chartWidth = dump_val[3];
  var displayLine = dump_val[4];
  var boxWidth = dump_val[5];
  var displayTotal = dump_val[6];
  var boxColor = dump_val[7];
  var displayBox = dump_val[8];
  var displayLast = dump_val[9];
  var bM = dump_val[10];
  


  
//definition of svgGradient in a defs tag, later used to render linear gradients for bars

var defs = d3.select(".chart").append("defs"); //create a new element called defs to store gradients characteristics
var gradientPositive = defs.append("linearGradient") //gradient for positives bars
   .attr("id", "svgGradientPositive")
   .attr("x1", "50%")
   .attr("x2", "50%")
   .attr("y1", "0%")
   .attr("y2", "100%");

gradientPositive.append("stop")
   .attr('class', 'startPositive')
   .attr("offset", "0%")
   .attr("stop-opacity", 1);

gradientPositive.append("stop")
   .attr('class', 'endPositive')
   .attr("offset", "100%")
   .attr("stop-opacity", 1);
   
   
var gradientTotal = defs.append("linearGradient") //gradient for total bar
   .attr("id", "svgGradientTotal")
   .attr("x1", "50%")
   .attr("x2", "50%")
   .attr("y1", "0%")
   .attr("y2", "100%");

gradientTotal.append("stop")
   .attr('class', 'startTotal')
   .attr("offset", "0%")
   .attr("stop-opacity", 1);

gradientTotal.append("stop")
   .attr('class', 'endTotal')
   .attr("offset", "100%")
   .attr("stop-opacity", 1);
   
var gradientNegative = defs.append("linearGradient") //gradient for negatives bars
   .attr("id", "svgGradientNegative")
   .attr("x1", "50%")
   .attr("x2", "50%")
   .attr("y1", "0%")
   .attr("y2", "100%");

gradientNegative.append("stop")
   .attr('class', 'startNegative')
   .attr("offset", "0%")
   .attr("stop-opacity", 1);

gradientNegative.append("stop")
   .attr('class', 'endNegative')
   .attr("offset", "100%")
   .attr("stop-opacity", 1);
   
var gradientLast = defs.append("linearGradient") //gradient for last bar
   .attr("id", "svgGradientLast")
   .attr("x1", "50%")
   .attr("x2", "50%")
   .attr("y1", "0%")
   .attr("y2", "100%");

gradientLast.append("stop")
   .attr('class', 'startLast')
   .attr("offset", "0%")
   .attr("stop-opacity", 1);

gradientLast.append("stop")
   .attr('class', 'endLast')
   .attr("offset", "100%")
   .attr("stop-opacity", 1);
   
   //end of svgGradient def
   
//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------Declare-----------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------
var margin = {top: 10, right: 20, bottom: parseInt(bM, 10), left: (40 + 5*dataFormatter.length)},	//margin for the chart: INCREASE BOTTOM MARGIN IF X AXIS TICKS ARE NOT ENTIRELY DISPLAYED !!!
width = chartWidth - margin.left - margin.right ,
height = chartHeight - margin.top - margin.bottom,
padding = 0.2;  //used for bar width. 0 = full bar

var x = d3.scale.ordinal()
.rangeRoundBands([0, width], padding);

var y = d3.scale.linear()
.range([height, 0]);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.tickFormat(function(d) { return functionFormatter(d); });


var chart = d3.select(".chart")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
//Create an array with splitted data values---------------------------------------------------------------------------------
  var data = [ {  name: dump_val[11],  value: dump_val[12]  } ];
  if (displayLast == "Y") {
for (var i = 13; i < dump_val.length-2; i+=2) {
      data.push({  name: dump_val[i],  value: dump_val[i+1]  });
}
  } else {
for (var i = 13; i < dump_val.length-1; i+=2) {
      data.push({  name: dump_val[i],  value: dump_val[i+1]  });
}
  }
  
  if (dump_val2 != '') {	//if the user specified a 3 column for descriptions, dscr = description
for (var i = 0; i < data.length; i++) {
data[i].dscr = dump_val2[i];
}
  } else {	//else dscr = name
for (var i = 0; i < data.length; i++) {
data[i].dscr = data[i].name;
}
  }   

//Prepare data(compute start and end point of bar, and the bar class)-------------------------------------------------------
  var cumulative = 0;
  for (var i = 0; i < data.length; i++) {
    data[i].start = cumulative;  //start of bar
    cumulative += parseInt(data[i].value);
    data[i].end = cumulative; //end of bar
    data[i].class = ( data[i].value >= 0 ) ? 'positive' : 'negative';
  }
  if (displayTotal == "Y") {	//add total bar if the displayTotal option is selected
data.push({
name: 'Total',
value: cumulative,
dscr: 'Total',
end: cumulative,
start: 0,
class: 'total'
});
  }
  if (displayLast == "Y") {	//add last bar if the displayLast option is selected
data.push({	
name: dump_val[dump_val.length-2],
value: dump_val[dump_val.length-1],
end: dump_val[dump_val.length-1],
start: 0,
class: 'last'
});
if (dump_val2 != '') {	//add description for last bar
if (displayTotal == "Y") {
data[data.length-1].dscr = dump_val2[data.length-2];
} else {
data[data.length-1].dscr = dump_val2[data.length-1];
}
} else {
data[data.length-1].dscr = data[data.length-1].name;
}
  } 
  
  
    
  x.domain(data.map(function(d) { return d.name; }));
  y.domain([ Math.min(d3.min(data, function(d) { return d.start; }), d3.min(data, function(d) { return d.end; })) , Math.max(d3.max(data, function(d) { return d.start; }), d3.max(data, function(d) { return d.end; }))]);

  
//-------------------------------------------------------------------------------------------------------------------------- 
//----------------------------------------------------Render part-----------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------

/*IN THE RENDER PART, WE APPEND A SVG GROUP CALLED "g" to ALL GRAPHIC ELEMENT.*/
/*The ‘g’ element is a container element for grouping together related graphics elements.*/

  //set chart background
  chart.append("rect")	  
    .attr("x",0)
    .attr("y",0)
    .attr("width", "100%")
    .attr("height", "100%")
    .style("fill", chartColor)
.append("g");


//Add xAxis to the group g. fontAdjust is used to dynamicaly assign an offset for the chart depending on dataFormatter length
  var fontAdjust = (12 - Math.round(data.length/5));
  chart.append("g")
 .style("font", fontAdjust + "px sans-serif")
      .attr("class", "axisHollow")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
 .selectAll(".tick text")
      .call(wrap, x.rangeBand());

//Add yAxis to the group g
  chart.append("g")
      .attr("class", "axis")
      .call(yAxis);
  
//Create a box that display infos when the user clicks on a bar-------------------------------------------------------------
//Make an SVG Container named box
  var box = d3.select(".chart").append('g')
.attr("class", "box")
                         .attr("width", width)
                         .attr("height", height)
.style("pointer-events", "none");

//Margin for displaying box content
  var margin_box = {top: 10, left: 10},
width_box = boxWidth,
height_box = height/6;


//Draw a background for the box
  var rec = box.append("rect")
             .attr("width", width_box)
             .attr("height", height_box)
.attr("rx", 10)         // set the x corner curve radius
.attr("ry", 10)         // set the y corner curve radius
.style("fill", boxColor)
.attr('opacity', 0)
.style("pointer-events", "none");

//Add text to the box
  var txt = box.append("text")
.attr("dy", ".35em")
.attr('opacity', 0);


 
//Creating chart bars-------------------------------------------------------------------------------------------------------
  var bar = chart.selectAll(".bar")
      .data(data)
      .enter().append("g")
      .attr("class", function(d) { return "bar " + d.class })
      .attr("transform", function(d) { return "translate(" + x(d.name) + ",0)"; })
 
 
 //Trigger event when click on bar
 .on('click', function (d, i) {	//'mouseenter' can be used if you want to trigger the event when the mouse is over a bar
 //get mouse coords
 var coords = d3.mouse(this)

 //change bar opacity
          d3.select(this).transition()
                         .duration(50)
.attr('opacity', '.60')
 
 if (displayBox == "Y") {
//set box pos
rec.attr("x", x(d.name) + margin.left + (((1/(1+(padding/data.length)))*(width/(data.length))*(1-padding))-width_box)/2)
txt.attr("x", x(d.name) + margin.left + margin_box.left  + (((1/(1+(padding/data.length)))*(width/(data.length))*(1-padding))-width_box)/2)

//dynamicaly set box position depending on mouse position 
if (coords[1] >= height/2) {
rec.attr("y", coords[1] + margin.top - (height_box*3/2))
txt.attr("y", coords[1] + margin.top + margin_box.top - (height_box*3/2))
} else {
rec.attr("y", coords[1] + margin.top + (height/10))
txt.attr("y", coords[1] + margin.top + margin_box.top + (height/10))  
}
 
//prepare box text in order to render on multiple lines 
txt.text(d.dscr + ' /Value: ' + d.value)
.call(wrap, width_box - (2*margin_box.left))

//adjust rect height to fit the text
var h = txt.selectAll("tspan").size()
rec.attr("height", h*13 + margin_box.top)	//  /!\  h*13 is the height of box.txt (h is the number of lines, 13 is a line height in px)


//show box
rec.transition()
.duration(50)
.style("opacity", 1)
txt.transition()
.duration(50)
.style("opacity", 1)
 };
});

  
  
  //Trigger when the mouse comes back on the chart
  chart.on('mouseover', function (d, i) {
 //reset bars opacity
 chart.selectAll(".bar").transition()
               .duration(1)
               .attr('opacity', '1')
 //mask box
 if (displayBox == "Y") {
rec.transition()
.duration(50)
.style("opacity", 0)

  
txt.transition()
.duration(50)
.style("opacity", 0)


 };
   });
  
//Draw the graph with animation (height goes from 0 to rect height in 2000 ms)
  bar.append("rect")
 .attr("y", function(d) { return y( Math.max(d.start, d.end) ); })
 .attr("height", 0)
      .attr("width", x.rangeBand());
 
  bar.selectAll("rect")
 .transition()
      .duration(2000)
 .ease('bounce')
      .attr("y", function(d) { return y( Math.max(d.start, d.end) ); })
      .attr("height", function(d) { return Math.abs( y(d.start) - y(d.end) ); })
      .attr("width", x.rangeBand());

 
  //uncoment to display value on bars
  /*bar.append("text")
      .attr("x", x.rangeBand() / 2)
      .attr("y", function(d) { return y(d.end) + 5; })
      .attr("dy", function(d) { return ((d.class=='negative') ? '-' : '') + ".75em" })
      .text(function(d) { return functionFormatter(d.end - d.start);});*/
  
  
//Draw a line beetween bars (only for positives and negatives bar class)
  var filterTest = ["positive", "negative"];
  bar.filter(function(d) { return filterTest.includes(d.class)}).append("line")
      .attr("class", "connector")
 .attr("x1", x.rangeBand() + 5 )
      .attr("y1", function(d) { return y(d.end) } )
      .attr("x2", x.rangeBand() + 5 )
      .attr("y2", function(d) { return y(d.end) } )
 .transition()
 .delay(2000)
      .duration(500)
      .attr("x1", x.rangeBand() + 5 )
      .attr("y1", function(d) { return y(d.end) } )
      .attr("x2", x.rangeBand() / ( 1 - padding) - 5 )
      .attr("y2", function(d) { return y(d.end) } );
      
 
//A line at the zero level is displayed if the displayLine option is selected
  if (displayLine == "Y") {
    chart.append('line')
      .style("stroke", "black")
      .style("stroke-width", 2)
      .attr("x1", 0)
      .attr("y1", y(0)+0,5)
      .attr("x2", width)
      .attr("y2", y(0)+0,5); 
  }

//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------


//Add a formatter before the input value (ex: 1 -> $1). Also transform 1000 -> 1k.
function functionFormatter(n) {
  n = Math.round(n);
  var result = n;
  if (Math.abs(n) > 1000) {
    result = Math.round(n/1000) + 'K';
  }
  return result + dataFormatter;
}


//Display text on multiple lines if needed. As d3.js does not support \n or \r, we create a tspan for each line.
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
x = text.attr("x"),
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word); 
      }
    }
  });
}
}