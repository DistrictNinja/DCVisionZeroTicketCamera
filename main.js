var DN = {};
if(DN){
    DN.intervalID=null;
    DN.dataSwitch = 'January_2010';
DN.stopLight = d3.scale.linear()
    .domain([0, 50, 200, 500,1000,3000])
    .range(["#d3d3d3", "#545454","yellow","green", "orange", "red"]);
DN.tooltip = null;
DN.globalData = null;
    DN.count = -1;
}

d3.json("data/allTicketsBySeg.geojson", function (error, data) {
    if (error) throw error;
    DN.globalData = data;
    DN.generateD3Map(DN.globalData);
    DN.tooltip = d3.select("body").append("div").attr("class", "ttip");

});


DN.currentMonthTotal = 0;

DN.generateD3Map=function(data){

    d3.select(".vizPanel").append("svg").attr("width", "100%").attr("height", "100%").attr("id","svgMap");



    var mapProjection = d3.geo.mercator()
        .scale(257270.5)
        .center([-77.0144701798118, 38.89920210515231]) //projection center
        .translate([$("#svgMap").width() / 2,
            $("#svgMap").height() / 2]); //translate to center the map in view

    var path = d3.geo.path()
        .projection(mapProjection);

    DN.currentMonthTotal = 0;

    var map = d3.select("#svgMap");
    map.selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("d", path)
        .attr("fill","white" )
        .attr("stroke", function (obj, index) {

            if(obj.properties[DN.dataSwitch]){
            DN.currentMonthTotal += obj.properties[DN.dataSwitch]
            }

            return DN.stopLight(obj.properties[DN.dataSwitch]);
        })
        .attr("stroke-width", function (obj, index) {
            if (obj.properties[DN.dataSwitch] == null) {
                return "1";
            } else if (obj.properties[DN.dataSwitch] > 5000) {
                return "20";
            }else if (obj.properties[DN.dataSwitch] > 4000) {
                return "18";
            }else if (obj.properties[DN.dataSwitch] > 3000) {
                return "16";
            }else if (obj.properties[DN.dataSwitch] > 2000) {
                return "14";
            }else if (obj.properties[DN.dataSwitch] > 1000) {
                return "12";
            } else if (obj.properties[DN.dataSwitch] > 500) {
                return "8";
            }else if (obj.properties[DN.dataSwitch] > 300) {
                return "5";
            }
            else {
                return "2";
            }
        })
        //                    .on("click", hoodClick)
        .on("mouseover", DN.mouseOver)
        .on("mousemove", DN.mouseMove)
        .on("mouseout", DN.clearTip);




    $("#loader_container").fadeOut();




};

DN.clearTip=function() {
    DN.tooltip.style("display", "none");
};

DN.mouseMove = function() {
   DN.tooltip.style("top", (d3.event.pageY + 5) + "px")
        .style("left", (d3.event.pageX + 15) + "px");
};

DN.mouseOver = function(obj, index) {
    if (obj.properties[DN.dataSwitch] > 0) {
        if (obj.properties[DN.dataSwitch] > 0) {
            DN.tooltip.style("display", "block")
                .html("<div class='align:center'>" + obj.properties.registered + " " + obj.properties.streettype + " " + obj.properties.quadrant + "</div><div>Total Tickets: " + (obj.properties[DN.dataSwitch] ? obj.properties[DN.dataSwitch] : "0") + "</div>");
        }
    }
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

    DN.incrementMap = function () {
        var allTimeArray = ['January_2010', 'February_2010', 'March_2010', 'April_2010', 'May_2010', 'June_2010', 'July_2010', 'August_2010', 'September_2010', 'October_2010', 'November_2010', 'January_2011', 'February_2011', 'March_2011', 'April_2011', 'May_2011', 'June_2011',  'August_2011', 'September_2011', 'October_2011', 'November_2011', 'December_2011','January_2012', 'February_2012', 'March_2012', 'April_2012', 'May_2012', 'June_2012', 'July_2012', 'August_2012', 'September_2012', 'October_2012', 'November_2012', 'December_2012','January_2013', 'February_2013', 'April_2013', 'June_2013', 'July_2013', 'August_2013', 'September_2013', 'October_2013', 'November_2013','January_2014', 'March_2014', 'April_2014', 'May_2014', 'June_2014', 'August_2014', 'September_2014', 'November_2014', 'December_2014','January_2015', 'February_2015', 'March_2015', 'April_2015', 'May_2015', 'June_2015', 'July_2015', 'August_2015', 'September_2015', 'October_2015', 'November_2015', 'December_2015'];

        if( DN.count ==allTimeArray.length-1){
            DN.count = -1;
            DN.stopAnimate();
            return;
        }

        $("#animationTopCaption").fadeOut(10);



           DN.count++;

        var split = allTimeArray[DN.count].split("_");


        $('#MonthSelector').val(split[0]);
        $('#YearSelector').val(split[1]);

        DN.changeMap(allTimeArray[DN.count]);
        $("#animationTopCaption").html(split[0]+" "+split[1]+": " +  numberWithCommas(DN.currentMonthTotal) + " Camera Tickets").fadeIn(1000);

    };

DN.animateMap = function(){
    $("#animateButton").attr("onclick","DN.stopAnimate()");
    $("#animateButton").html("Stop");

    DN.intervalID = setInterval(DN.incrementMap, 1500);
};

DN.stopAnimate = function(){
    $("#animateButton").attr("onclick","DN.animateMap()");
    $("#animateButton").html("Animate");
    clearInterval(DN.intervalID);
};



    DN.changeMap = function (inDataSwitch) {
        if (!inDataSwitch) {
            var month = $('#MonthSelector').val();
            var year = $('#YearSelector').val();

            DN.dataSwitch = month + "_" + year;
        }else{
            DN.dataSwitch = inDataSwitch
        }

        DN.currentMonthTotal = 0;

        var map = d3.select("#svgMap");
        map.selectAll("path")
            .attr("stroke", function (obj, index) {

                if(obj.properties[DN.dataSwitch]){
                    DN.currentMonthTotal += obj.properties[DN.dataSwitch]
                }


                return DN.stopLight(obj.properties[DN.dataSwitch]);
            })
            .attr("stroke-width", function (obj, index) {
                if (obj.properties[DN.dataSwitch] == null) {
                    return "1";
                } else if (obj.properties[DN.dataSwitch] > 5000) {
                    return "10";
                }else if (obj.properties[DN.dataSwitch] > 4000) {
                    return "9";
                }else if (obj.properties[DN.dataSwitch] > 3000) {
                    return "8";
                }else if (obj.properties[DN.dataSwitch] > 2000) {
                    return "7";
                }else if (obj.properties[DN.dataSwitch] > 1000) {
                    return "6";
                } else if (obj.properties[DN.dataSwitch] > 500) {
                    return "5";
                }else if (obj.properties[DN.dataSwitch] > 300) {
                    return "4";
                }
                else {
                    return "3";
                }

            })

    }


