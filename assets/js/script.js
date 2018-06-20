const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
const margin = {top: 50, right: 20, bottom: 70, left: 90},
	width = 1000 - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;

const parseYear = d3.timeParse("%Y");
const parseTime = d3.timeParse("%M:%S");


d3.json(dataUrl, (error, dataset) => {

	let data = dataset.map((d) => {
		return {
			Doping: d.Doping,
			Name: d.Name,
			Nationality: d.Nationality,
			Place: d.Place,
			Sceonds: d.Seconds,
			Time: parseTime(d.Time),
			URL: d.URL,
			Year: parseYear(d.Year)
		};
	});

	// console.log(data[0].Year.setFullYear(data[0].Year.getFullYear() - 10));


	const minYear = d3.min(data, (d) => d.Year);
	const maxYear = d3.max(data, (d) => d.Year);
	const minTime = d3.min(data, (d) => d.Time);
	const maxTime = d3.max(data, (d) => d.Time);

	// console.log(parseYear(minYear.getFullYear() - 1));

	var xScale = d3.scaleTime()
					.domain([minYear, maxYear])
					.range([0, width])
					.nice();

    var yScale = d3.scaleTime()
                    .domain([maxTime, minTime])
                    .range([height, 0])
    				.nice();


	var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.attr("id", "tooltip")
		.style("opacity", 0);

	var svg = d3.select("#graph")
		.append("svg")
		// .attr("class", "graph")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var xAxis = d3.axisBottom(xScale);
	var yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

	svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", - height/2)
		.attr("y", -65)
		.style("text-anchor", "middle")
		.text("Time in minutes")
		.attr("class", "axisTitle");

	svg.append("text")
		.attr("x", (width)/2)
		.attr("y", height + 50)
		.style("text-anchor", "middle")
		.text("Year")
		.attr("class", "axisTitle");

	svg.append("text")
		.attr("id", "title")
		.attr("x", (width / 2))
		.attr("y", 0 - (margin.top / 2))
		.attr("text-anchor", "middle")
		.text("Doping in Professional Bicycle Racing")
		.attr("class", "title");

	svg.append("text")
		.attr("id", "subtitle")
		.attr("x", (width / 2))
		.attr("y", 30 - (margin.top / 2))
		.attr("text-anchor", "middle")
		.text(dataset.length + " Fastest times up Alpe d'Huez")
		.attr("class", "subtitle");


	svg.append("g")
		.attr("id", "x-axis")
		.attr("class", "axis")
		.attr("transform", "translate(0, " + (height) + ")")
		.call(xAxis);

	svg.append("g")
		.attr("id", "y-axis")
		.attr("class", "axis")
		.call(yAxis);


	svg.selectAll("circle")
		.data(data)
		.enter().append("circle")
		.attr("class", "dot")
		.attr("cx", (d) => xScale(d.Year))
		.attr("cy", (d) => yScale(d.Time))
		.attr("r", 7)
		.attr("data-xvalue", (d) => d.Year)
		.attr("data-yvalue", (d) => d.Time)
		.style("fill", (d) => {
			if (d.Doping === "") {
				return "lightgreen";
			} else {
				return "steelblue";
			}
		})
		.on("mouseover", function(d) {
			div.transition()
			.duration(200)
			.style("opacity", .9);
			div
			.html(d.Name + ": " + d.Nationality + "<br/>" + "Year: " + d.Year.getFullYear()
				+ ", Time: " + d3.timeFormat("%M:%S")(d.Time) + "<br/>" + d.Doping)
        	.attr('data-year', d.Year)
			.style("left", (d3.event.pageX + 23) + "px")
			.style("top", (d3.event.pageY - 23) + "px");
			})
		.on("mouseout", function(d) {
			div.transition()
			.duration(500)
			.style("opacity", 0);
		});

	// console.log(data);
});

