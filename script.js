// CHART INIT ------------------------------
let coffeeData;
let data;

// dropdown change
let type = document.querySelector('#group-by');
let typeSelection = "stores";

type.addEventListener('change', event => {
	console.log(event);
	console.log(event.target.value);
    typeSelection = event.target.value;
    console.log("typeSelection:", typeSelection);
    update(coffeeData, typeSelection);
})

// sorting with button
let sort = document.querySelector('#sort-order').onclick = function(){
    if (this.value == "ascending") {
        this.value = "descending";
        console.log(this.value);

        // sort descending
        if(typeSelection === "stores") {
            coffeeData.sort(function(a, b) {
                return parseFloat(b.stores) - parseFloat(a.stores);
            });
            console.log("Sorted descending stores: ", coffeeData);
            update(coffeeData, typeSelection);
        }
        else {
            coffeeData.sort(function(a, b) {
                return parseFloat(b.revenue) - parseFloat(a.revenue);
            });
            console.log("Sorted descending revenue: ", coffeeData);
            update(coffeeData, typeSelection);
        }
    }
    else {
        this.value = "ascending";
        console.log(this.value);
        // sort ascending
        if(typeSelection === "stores") {
            coffeeData.sort(function(a, b) {
                return parseFloat(a.stores) - parseFloat(b.stores);
            });
            console.log("Sorted descending stores: ", coffeeData);
            update(coffeeData, typeSelection);
        }
        else {
            coffeeData.sort(function(a, b) {
                return parseFloat(a.revenue) - parseFloat(b.revenue);
            });
            console.log("Sorted descending revenue: ", coffeeData);
            update(coffeeData, typeSelection);
        }
    }
    this.blur();
}

// margin
const margin = ({top: 40, right: 40, bottom: 40, left: 40})

const width = 750 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

const svg = d3.select(".barchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// create scales without domains
// scales
const xScale = d3.scaleBand()
    .range([0, width]) 
    .paddingInner(0.1)

const yScale = d3.scaleLinear()
    .range([height, 0])

// create axes and axis title containers

// using axis
let xAxis = d3.axisBottom()
    .scale(xScale)

let yAxis = d3.axisLeft()
    .scale(yScale)

// Draw the axis
let xAxisGroup = svg.append("g")
    .attr("class", "axis x-axis")

let yAxisGroup = svg.append("g")
    .attr("class", "axis y-axis")

// adding labels

svg.append("text")
    .attr("class", "ylabel")
    .attr('x', -12)
    .attr('y', -3)
    .attr("alignment-baseline", "baseline")
    .text("Stores")

// CHART UPDATE FUNCTION -------------------

function update(data, typeSelection) {

	// update domains
    xScale.domain(data.map(function(d) {
        return d.company;
    }));

    yScale.domain([0, d3.max(data, function(d) {
        return d[typeSelection];
    })]);

	// update bars
    let bars = svg.selectAll(".bar")
        .data(data, d => d.company);

    bars
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("fill", "steelblue")
        .attr("x", function(d) {
            return xScale(d.company);
        })
        .attr("y", height)
        .attr("width", xScale.bandwidth())
        .attr("height", 0)
        .merge(bars)
        .transition()
        .delay((d, i) => i * 100)
        .duration(1000)
        .attr("x", function(d) {
            return xScale(d.company);
        })
        .attr("y", function(d) {
            return yScale(d[typeSelection]);
        })
        .attr("height", d => height - yScale(d[typeSelection]));

        bars.exit().remove();

        
    // update axis
    let xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5, "s")

    let yAxis = d3.axisLeft()
        .scale(yScale)
    
    xAxisGroup = svg
        .select(".x-axis") // don't need the entire "axis x-axis"?
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
    yAxisGroup = svg.select(".y-axis") // don't need the entire "axis y-axis"?
        .call(yAxis);

    d3.select(".ylabel").text(typeSelection === "stores" ? "Stores" : "Billion USD")
}

// CHART UPDATES ---------------------------

// Loading data
d3.csv('coffee-house-chains.csv', d=>{
    return {
        ...d,
        stores: +d.stores,
        revenue: +d.revenue,
    }
  }).then(data=>{
        coffeeData = data;
        console.log('coffee data', data);
        update(coffeeData, typeSelection);
    })
