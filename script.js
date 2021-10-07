d3.csv('coffee-house-chains.csv', d=>{
    return {
        ...d,
        stores: +d.stores,
        revenue: +d.revenue,
    }
  }).then(data=>{
        coffeeData = data;
        console.log('coffee data', data);

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
        
        // scales
        const xScale = d3.scaleBand()
            .domain(data.map(function(d) {
                return d.company;
            }))
            .range([0, width]) 
            .paddingInner(0.1)
        
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(d3.extent(data, d => d.stores))])
            .range([height, 0])

        // creating bars
        svg.selectAll("rect")
            .data(coffeeData)
            .enter()
            .append("rect")
            .attr("x", function(d) {
                return xScale(d.company);
            })
            .attr("y", function(d) {
                return yScale(d.stores);
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {
                return height - yScale(d.stores);
            })
            .attr("fill", "blue");
        
        // using axis
        const xAxis = d3.axisBottom()
	        .scale(xScale)
            .ticks(5, "s")

        const yAxis = d3.axisLeft()
	        .scale(yScale)

        // Draw the axis
        svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);
        svg.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", `translate(0, ${0})`)
            .call(yAxis);
        
        // adding labels

        svg.append("text")
            .attr("class", "ylabel")
            .attr('x', 0)
            .attr('y', 0)
            .attr("alignment-baseline", "baseline")
            .text("Stores")
        

    })