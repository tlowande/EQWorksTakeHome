$(() => {

  $("#btn-amchartsMap").click(function() {
    window.location.href = "https://habitual-license.glitch.me/poi";
  }); //end of eventlistener for btn-poi
  
  //-------------------------
  $(".btn-outline-primary").click(function() {
    $("#eventsDailyDiv").toggle("slow");
  });
  
  $(".btn-outline-secondary").click(function() {
    $("#eventsHourlyDiv").toggle("slow");
  }); //end of eventlistener for btn-events-hourly
  
  $(".btn-outline-success").click(function() {
    $("#statsDailyDiv").toggle("slow");
  });

  //------------------------

  let daily_events;

  const getEvents_daily = () => {
    return $.ajax("https://habitual-license.glitch.me/events/daily", {
      method: "GET"
    }).then(res => {
      daily_events = res;

      let events_daily = [];

      daily_events.forEach(day => {
        let date = new Date(day.date.slice(0, 10).replace(/-/g, "/"))
          .toString()
          .slice(0, 15);

        let getDay = {
          name: date,
          steps: day.events,
          href:
            "https://media.glassdoor.com/sqll/11911/eq-works-squarelogo-1470405600218.png"
        };

        events_daily.push(getDay);
      });

      /**
       * ---------------------------------------
       * This demo was created using amCharts 4.
       *
       * For more information visit:
       * https://www.amcharts.com/
       *
       * Documentation is available at:
       * https://www.amcharts.com/docs/v4/
       *
       * Original at https://www.amcharts.com/demos/pareto-diagram/#code
       * Adjusted for EQWorks by Tamires Lowande
       * ---------------------------------------
       */

      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end

      /**
       * Chart design taken from Samsung health app
       */

      let chart = am4core.create("dailyEventsChart", am4charts.XYChart);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      chart.paddingBottom = 30;

      chart.data = events_daily;
      // chart.data = [{
      //     "name": "Monica",
      //     "steps": 45688,
      //     "href": "https://www.amcharts.com/wp-content/uploads/2019/04/monica.jpg"
      // }]

      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "name";
      categoryAxis.renderer.grid.template.strokeOpacity = 0;
      categoryAxis.renderer.minGridDistance = 40;
      categoryAxis.renderer.labels.template.dy = 35;
      categoryAxis.renderer.tooltip.dy = 35;
      categoryAxis.renderer.labels.template.rotation = 35;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.inside = true;
      valueAxis.renderer.labels.template.fillOpacity = 0.3;
      valueAxis.renderer.grid.template.strokeOpacity = 0;
      valueAxis.min = 0;
      valueAxis.cursorTooltipEnabled = false;
      valueAxis.renderer.baseGrid.strokeOpacity = 0;

      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "steps";
      series.dataFields.categoryX = "name";
      series.tooltipText = "{valueY.value} events/day";
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.dy = -6;
      series.columnsContainer.zIndex = 100;

      let columnTemplate = series.columns.template;
      columnTemplate.width = am4core.percent(50);
      columnTemplate.maxWidth = 46;
      columnTemplate.column.cornerRadius(60, 60, 10, 10);
      columnTemplate.strokeOpacity = 0;

      series.heatRules.push({
        target: columnTemplate,
        property: "fill",
        dataField: "valueY",
        min: am4core.color("#46aa82"),
        max: am4core.color("#4676aa")
      });
      series.mainContainer.mask = undefined;

      let cursor = new am4charts.XYCursor();
      chart.cursor = cursor;
      cursor.lineX.disabled = true;
      cursor.lineY.disabled = true;
      cursor.behavior = "none";

      let bullet = columnTemplate.createChild(am4charts.CircleBullet);
      bullet.circle.radius = 30;
      bullet.valign = "bottom";
      bullet.align = "center";
      bullet.isMeasured = true;
      bullet.mouseEnabled = false;
      bullet.verticalCenter = "bottom";
      bullet.interactionsEnabled = false;

      let hoverState = bullet.states.create("hover");
      let outlineCircle = bullet.createChild(am4core.Circle);
      outlineCircle.adapter.add("radius", function(radius, target) {
        let circleBullet = target.parent;
        return circleBullet.circle.pixelRadius + 10;
      });

      let image = bullet.createChild(am4core.Image);
      image.width = 60;
      image.height = 60;
      image.horizontalCenter = "middle";
      image.verticalCenter = "middle";
      image.propertyFields.href = "href";

      image.adapter.add("mask", function(mask, target) {
        let circleBullet = target.parent;
        return circleBullet.circle;
      });

      let previousBullet;
      chart.cursor.events.on("cursorpositionchanged", function(event) {
        let dataItem = series.tooltipDataItem;

        if (dataItem.column) {
          let bullet = dataItem.column.children.getIndex(1);

          if (previousBullet && previousBullet != bullet) {
            previousBullet.isHover = false;
          }

          if (previousBullet != bullet) {
            let hs = bullet.states.getKey("hover");
            hs.properties.dy = -bullet.parent.pixelHeight + 30;
            bullet.isHover = true;

            previousBullet = bullet;
          }
        }
      });
    })
    .catch(error => {
      console.log("got to the catch on daily events")
      location.reload()
    })
  };

  getEvents_daily();

  //-------------------------
  // let daily_events;
  let hourly_events;

  const getEvents_hourly = () => {
    return $.ajax("https://habitual-license.glitch.me/events/hourly", {
      method: "GET"
    })
      .then(res => {
        // hourly_events = res //all 168 results

        hourly_events = res.slice(0, 25);

        /*
         * ---------------------------------------
         * This demo was created using amCharts 4.
         *
         * For more information visit:
         * https://www.amcharts.com/
         *
         * Documentation is available at:
         * https://www.amcharts.com/docs/v4/
         *
         * Original available at https://www.amcharts.com/demos/radar-timeline/#code
         * adjusted for EQ Works challenge by Tamires Lowande
         * ---------------------------------------
         */

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        /**
         * This is a copy of a chart created by Antti Lipponen: https://twitter.com/anttilip?lang=en Thanks a lot!
         */

        //Generate data to use in the chart based on data from server
        let eventsData = {};

        hourly_events.forEach(record => {
          let date = record.date.slice(0, 10);

          let day = new Date(date.replace(/-/g, "/")).toString().slice(0, 10);

          let array = [`${day},  ${record.hour}:00 hs`, 0, 0, record.events, 0];

          if (eventsData.hasOwnProperty(date)) {
            eventsData[date].push(array);
          } else {
            eventsData[date] = [];
            eventsData[date].push(array);
          }
        });

        //data format has to be like
        // let temperatures = {
        //   "2017-01-01": [
        //     ["2017-01-01 1", 14, 10, 7, 8],
        //     ["2017-01-01 4", 6, 5, 9, 12],
        //     ["2017-01-01 7", 6, 5, 9, 12],
        //   ],
        //   }

        let startYear = 2015;
        let endYear = 2018;
        let currentYear = hourly_events[0].date.slice(0, 4);
        let colorSet = new am4core.ColorSet();

        let chart = am4core.create("radarchartdiv", am4charts.RadarChart);
        chart.hiddenState.properties.opacity = 0;

        chart.startAngle = 270 - 180;
        chart.endAngle = 270 + 180;

        chart.padding(5, 15, 5, 10);
        chart.radius = am4core.percent(65);
        chart.innerRadius = am4core.percent(40);

        // year label goes in the middle
        let yearLabel = chart.radarContainer.createChild(am4core.Label);
        yearLabel.horizontalCenter = "middle";
        yearLabel.verticalCenter = "middle";
        yearLabel.fill = am4core.color("#673AB7");
        yearLabel.fontSize = 30;
        yearLabel.text = String(currentYear);

        // zoomout button
        let zoomOutButton = chart.zoomOutButton;
        zoomOutButton.dx = 0;
        zoomOutButton.dy = 0;
        zoomOutButton.marginBottom = 15;
        zoomOutButton.parent = chart.rightAxesContainer;

        // scrollbar
        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarX.parent = chart.rightAxesContainer;
        chart.scrollbarX.orientation = "vertical";
        chart.scrollbarX.align = "center";
        chart.scrollbarX.exportable = false;

        // vertical orientation for zoom out button and scrollbar to be positioned properly
        chart.rightAxesContainer.layout = "vertical";
        chart.rightAxesContainer.padding(120, 20, 120, 20);

        // category axis
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataFields.category = "hour";

        let categoryAxisRenderer = categoryAxis.renderer;
        let categoryAxisLabel = categoryAxisRenderer.labels.template;
        categoryAxisLabel.location = 0.5;
        categoryAxisLabel.radius = 28;
        categoryAxisLabel.relativeRotation = 90;

        categoryAxisRenderer.fontSize = 11;
        categoryAxisRenderer.minGridDistance = 10;
        categoryAxisRenderer.grid.template.radius = -25;
        categoryAxisRenderer.grid.template.strokeOpacity = 0.05;
        categoryAxisRenderer.grid.template.interactionsEnabled = false;

        categoryAxisRenderer.ticks.template.disabled = true;
        categoryAxisRenderer.axisFills.template.disabled = true;
        categoryAxisRenderer.line.disabled = true;

        categoryAxisRenderer.tooltipLocation = 0.5;
        categoryAxis.tooltip.defaultState.properties.opacity = 0;

        // value axis
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.max = 15;
        valueAxis.strictMinMax = true;
        valueAxis.tooltip.defaultState.properties.opacity = 0;
        valueAxis.tooltip.animationDuration = 0;
        valueAxis.cursorTooltipEnabled = true;
        valueAxis.zIndex = 10;

        let valueAxisRenderer = valueAxis.renderer;
        valueAxisRenderer.axisFills.template.disabled = true;
        valueAxisRenderer.ticks.template.disabled = true;
        valueAxisRenderer.minGridDistance = 20;
        valueAxisRenderer.grid.template.strokeOpacity = 0.05;

        // series
        let series = chart.series.push(new am4charts.RadarColumnSeries());
        series.columns.template.width = am4core.percent(90);
        series.columns.template.strokeOpacity = 0;
        series.dataFields.valueY = "value" + currentYear;
        series.dataFields.categoryX = "hour";
        series.tooltipText = "Events: {valueY.value}";

        // this makes columns to be of a different color, depending on value
        series.heatRules.push({
          target: series.columns.template,
          property: "fill",
          minValue: 0,
          maxValue: 15,
          min: am4core.color("#673AB7"),
          max: am4core.color("#F44336"),
          dataField: "valueY"
        });

        // cursor
        let cursor = new am4charts.RadarCursor();
        chart.cursor = cursor;
        cursor.behavior = "zoomX";

        cursor.xAxis = categoryAxis;
        cursor.innerRadius = am4core.percent(40);
        cursor.lineY.disabled = true;

        cursor.lineX.fillOpacity = 0.2;
        cursor.lineX.fill = am4core.color("#000000");
        cursor.lineX.strokeOpacity = 0;
        cursor.fullWidthLineX = true;

        // year slider
        let yearSliderContainer = chart.createChild(am4core.Container);
        yearSliderContainer.layout = "vertical";
        yearSliderContainer.padding(0, 38, 0, 38);
        yearSliderContainer.width = am4core.percent(100);

        let yearSlider = yearSliderContainer.createChild(am4core.Slider);
        yearSlider.events.on("rangechanged", function() {
          updateRadarData(
            startYear + Math.round(yearSlider.start * (endYear - startYear))
          );
        });
        yearSlider.orientation = "horizontal";
        yearSlider.start = 0.5;
        yearSlider.exportable = false;

        chart.data = generateRadarData();

        function generateRadarData() {
          let data = [];
          let i = 0;
          for (let day in eventsData) {
            let daysData = eventsData[day];

            daysData.forEach(function(hour) {
              let rawDataItem = { hour: hour[0] };

              for (let y = 1; y < hour.length; y++) {
                rawDataItem["value" + (startYear + y - 1)] = hour[y];
              }

              data.push(rawDataItem);
            });
            createRange(day, daysData, i);
            i++;
          }
          return data;
        }

        function updateRadarData(year) {
          if (currentYear != year) {
            currentYear = year;
            yearLabel.text = String(currentYear);
            series.dataFields.valueY = "value" + currentYear;
            chart.invalidateRawData();
          }
        }

        function createRange(name, daysData, index) {
          let axisRange = categoryAxis.axisRanges.create();
          axisRange.axisFill.interactionsEnabled = true;
          axisRange.text = name;
          // first hour
          axisRange.category = daysData[0][0];
          // last hour
          axisRange.endCategory = daysData[daysData.length - 1][0];

          // every 3rd color for a bigger contrast
          axisRange.axisFill.fill = colorSet.getIndex(index * 3);
          axisRange.grid.disabled = true;
          axisRange.label.interactionsEnabled = false;
          axisRange.label.bent = true;

          let axisFill = axisRange.axisFill;
          axisFill.innerRadius = -0.001; // almost the same as 100%, we set it in pixels as later we animate this property to some pixel value
          axisFill.radius = -20; // negative radius means it is calculated from max radius
          axisFill.disabled = false; // as regular fills are disabled, we need to enable this one
          axisFill.fillOpacity = 1;
          axisFill.togglable = true;

          axisFill.showSystemTooltip = true;
          axisFill.readerTitle = "click to zoom";
          axisFill.cursorOverStyle = am4core.MouseCursorStyle.pointer;

          axisFill.events.on("hit", function(event) {
            let dataItem = event.target.dataItem;
            if (!event.target.isActive) {
              categoryAxis.zoom({ start: 0, end: 1 });
            } else {
              categoryAxis.zoomToCategories(
                dataItem.category,
                dataItem.endCategory
              );
            }
          });

          // hover state
          let hoverState = axisFill.states.create("hover");
          hoverState.properties.innerRadius = -10;
          hoverState.properties.radius = -25;

          let axisLabel = axisRange.label;
          axisLabel.location = 0.5;
          axisLabel.fill = am4core.color("#ffffff");
          axisLabel.radius = 3;
          axisLabel.relativeRotation = 0;
        }

        let slider = yearSliderContainer.createChild(am4core.Slider);
        slider.start = 1;
        slider.exportable = false;
        slider.events.on("rangechanged", function() {
          let start = slider.start;

          chart.startAngle = 270 - start * 179 - 1;
          chart.endAngle = 270 + start * 179 + 1;

          valueAxis.renderer.axisAngle = chart.startAngle;
        });
      })
      .then(res => {
        let poiEvents = ["first"];

        hourly_events.forEach(data => {
          
          let index = poiEvents.findIndex(
            element => element.day === data.date.slice(0,10) && element.poi === (data.name + data.date.slice(9,10))
          );
          

          if (index > 0) {
            poiEvents[index].events += data.events;
          } else {
            // let date = new Date(data.date.slice(0, 10).replace(/-/g, "/")).toString().slice(0, 10);
            let poiDay = {
              day: data.date.slice(0,10),
              poi: data.name + data.date.slice(9,10),
              events: data.events
            };

            poiEvents.push(poiDay);
          }
        });
        poiEvents.shift();
        // console.log(poiEvents);

        /**
         * ---------------------------------------
         * This demo was created using amCharts 4.
         *
         * For more information visit:
         * https://www.amcharts.com/
         *
         * Documentation is available at:
         * https://www.amcharts.com/docs/v4/
         * 
         * Original chart available at https://www.amcharts.com/demos/partitioned-bar-chart/
         * Adapted for EQWorks by Tamires Lowande
         * ---------------------------------------
         */

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        let chart = am4core.create("poiEventsChart", am4charts.XYChart);

        // Add data
        chart.data = poiEvents
        // chart.data = [
        //   {
        //     region: "Central",
        //     state: "North Dakota",
        //     sales: 920
        //   }]

        // poi events =[
        //   {
        //     day: "2017-01-01T00:00:00.000Z",
        //     poi: "Vancouver Harbour",
        //     events: 30
        //   }
        // ]

        // Create axes
        let yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        yAxis.dataFields.category = "poi";
        yAxis.renderer.grid.template.location = 0;
        yAxis.renderer.labels.template.fontSize = 10;
        yAxis.renderer.minGridDistance = 10;

        let xAxis = chart.xAxes.push(new am4charts.ValueAxis());

        // Create series
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = "events";
        series.dataFields.categoryY = "poi";
        series.columns.template.tooltipText = "Events: [bold]{valueX}[/]";
        series.columns.template.strokeWidth = 0;
        series.columns.template.adapter.add("fill", function(fill, target) {
          if (target.dataItem) {
            switch (target.dataItem.dataContext.day) {
              case "2017-01-01":
                return chart.colors.getIndex(0);
                break;
              case "2017-01-02":
                return chart.colors.getIndex(1);
                break;
              case "2017-01-03":
                return chart.colors.getIndex(2);
                break;
              case "2017-01-04":
                return chart.colors.getIndex(3);
                break;
              case "2017-01-05":
                return chart.colors.getIndex(4);
                break;
              case "2017-01-06":
                return chart.colors.getIndex(5);
                break;
              case "2017-01-07":
                return chart.colors.getIndex(6);
                break;
            }
          }
          return fill;
        });

        // Add ranges
        function addRange(label, start, end, color) {
          let range = yAxis.axisRanges.create();
          range.category = start;
          range.endCategory = end;
          range.label.text = label;
          range.label.disabled = false;
          range.label.fill = color;
          range.label.location = 0;
          range.label.dx = -150;
          range.label.dy = 12;
          range.label.fontWeight = "bold";
          range.label.fontSize = 10;
          range.label.horizontalCenter = "left";
          range.label.inside = true;

          range.grid.stroke = am4core.color("#396478");
          range.grid.strokeOpacity = 1;
          range.tick.length = 200;
          range.tick.disabled = false;
          range.tick.strokeOpacity = 0.6;
          range.tick.stroke = am4core.color("#396478");
          range.tick.location = 0;

          range.locations.category = 1;
        }

        addRange("2017-01-01", "Niagara Falls1", "Vancouver Harbour1", chart.colors.getIndex(0));
        addRange("2017-01-02", "EQ Works2", "Niagara Falls2", chart.colors.getIndex(1));
        addRange(
          "2017-01-03",
          "CN Tower3",
          "Niagara Falls3",
          chart.colors.getIndex(2)
        );
        addRange("2017-01-04", "Vancouver Harbour4", "CN Tower4", chart.colors.getIndex(3));
        addRange("2017-01-05", "Niagara Falls5", "Niagara Falls5", chart.colors.getIndex(4));
        addRange("2017-01-06", "Vancouver Harbour6", "EQ Works6", chart.colors.getIndex(5));
        addRange("2017-01-07", "Vancouver Harbour7", "EQ Works7", chart.colors.getIndex(6));

        chart.cursor = new am4charts.XYCursor();
      }) //end of last then
      .catch(error => {
        console.log("got to the catch on hourly events")
        location.reload()
      })
  }; //end of the function

  getEvents_hourly();
}); //end of window.onload
