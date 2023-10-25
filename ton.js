
//fetchCSVData('your_csv_url', ['DTrade', 'AnotherDateColumn'])

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const fetchCSVData = async (url, dateColumns = []) => {
    const response = await fetch(url);
    const dataText = await response.text();

    const dataLines = dataText.split("\n").filter(row => row.trim() !== '') // Process each line

    // Get headers, assume headers are in the first row
    const headers = dataLines[0].split(",").map(header => header.trim())

    // Get the data from the remaining rows and associate with headers
    const dataPoints = dataLines.slice(1).map(line => {
        const values = line.split(",");
        let dataPoint = {}

        headers.forEach((header, index) => {
            let value = values[index]

            // If the column should be treated as a date, parse it
            if (dateColumns.includes(header)) {
                value = new Date(value);
            } else if (!isNaN(value)) {
                value = parseFloat(value);
            }

            dataPoint[header] = value;
        });

        return dataPoint;
    });

    return dataPoints;
}

const canvasjs_tpl = (div = '', title = "", font = 'tahoma') => {
    const options = {
        animationEnabled: false,
        subtitles: [{
            fontFamily: font,
            fontSize: 15,
            wrap: true,
            text: ''
        }],
        axisX: {
            valueType: 'dateTime',
            labelAngle: -50,
            labelAutoFit: true,
            labelFontFamily: font,
            labelFontSize: 10,
            
            //title: "Data aaa",
            //titleFontFamily: font
        },
        axisY: [],
        axisY2: [],
        data: [],
        font: font,
        legend: {
            fontFamily: font,
            fontSize: 15,
            verticalAlign: "bottom",
            horizontalAlign: "left",
            dockInsidePlotArea: false,
            cursor: "pointer",
            itemclick: function (e) {
                if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }

                e.chart.render();
            }
        },
        title: {
            text: title,
            fontFamily: font,
            fontSize: 20,
        },
        toolTip: {
            shared: true,
        }
    }
    const chart = new CanvasJS.Chart(div, options);
    return chart;
}

const canvasjs_addSeries = (chart, series) => {
    const colors1 = ['#2233DD', '#CC4433', '#006400', '#9933FF'];
    const colors2 = ['#2277DD', '#CC5533', '#0A4400', '#9966AA'];
    const colors = (series.axisYType === 'primary') ? colors1 : colors2;
    color = (typeof series.color === "undefined") ? colors[series.axisYIndex] : series.color;
    let font = chart.options.font;
    let yaxis_label = {
        title: series.title,
        titleFontFamily: font,
        titleFontSize: 10,
        prefix: "",
        //lineThickness: 1,
        
        labelFontFamily: font,
        labelFontSize: 10,
        //labelFormatter: addSymbols,
        logarithmic: series.logarithmic,
        valueFormatString: series.yLabelValueFormatString,
        // lineColor: color_1,
        tickColor: color,
        labelFontColor: color,
        lineColor: color,
        titleFontColor: color,
    }
    if (typeof series.minimum !== 'undefined')
        yaxis_label.minimum = series.minimum
    if (typeof series.maximum !== 'undefined')
        yaxis_label.maximum = series.maximum
    

    if (series.axisYType === 'primary') {
        chart.options.axisY.push(yaxis_label)
    } else {
        chart.options.axisY2.push(yaxis_label)
    }

    
    var lastDataPoint = series.dataPoints[series.dataPoints.length - 1]
    if(chart.options.subtitles[0].text === '') 
        chart.options.subtitles[0].text = `${lastDataPoint.x.toISOString().split('T')[0]} = `
    
    chart.options.subtitles[0].text += `${series.title}[${numeral(lastDataPoint.y).format(series.yValueFormatString)}] `;
    //chart.options.subtitles.push()
    // lastDataPoint.indexLabel = `${series.title}: ${lastDataPoint.y}`

    // lastDataPoint.markerType = "triangle"
    // lastDataPoint.markerColor = color
    // lastDataPoint.markerSize = 12

    let data_series = {
        axisYIndex: series.axisYIndex,
        axisYType: series.axisYType,
        dataPoints: series.dataPoints,
        name: series.title,
        
        yValueFormatString: series.yValueFormatString,
        xValueFormatString: series.xValueFormatString,
        showInLegend: true,
        type: series.type,
        color: color
    }
    chart.options.data.push(data_series);
    function addSymbols(e) {
        var suffixes = ["", "K", "M", "B"];
        var order = Math.max(Math.floor(Math.log(Math.abs(e.value)) / Math.log(1000)), 0);
        if (order > suffixes.length - 1)
            order = suffixes.length - 1;
        var suffix = suffixes[order];
        return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
    }
}

// addSeries(series1);
//     addSeries(series2);
//     addSeries(series3);
//     chart.render();