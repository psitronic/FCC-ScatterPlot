const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
const margin = {top: 30, right: 20, bottom: 30, left: 50},
	width = 640 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

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


	const minYear = parseYear(d3.min(data, (d) => d.Year).getFullYear() - 1);
	const maxYear = parseYear(d3.max(data, (d) => d.Year).getFullYear() + 1);
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



	var svg = d3.select("#graph")
		.append("svg")
		.attr("class", "graph")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var xAxis = d3.axisBottom(xScale);
	var yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S")).ticks(d3.timeSecond.every(30));;

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
		.attr("r", 5)
		.attr("opacity", 0.5)
		.attr("color", "black")
		.attr("fill", (d) => {
			if (d.Doping === "") {
				return "lightgreen";
			} else {
				return "steelblue";
			}
		});


	// console.log(data);
});

