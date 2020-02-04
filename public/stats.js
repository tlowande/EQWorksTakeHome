$(() => {

  let daily_stats;

  const getStats_daily = () => {
    return $.ajax("https://habitual-license.glitch.me/stats/daily", {
      method: "GET"
    }).then(res => {
       let rawDaily_stats = res;

      daily_stats = [];

      rawDaily_stats.forEach(day => {
        let revenuePerThousandImpression =
          (parseFloat(day.revenue) / parseFloat(day.impressions)) * 1000;

        let clicksPerImpression =
          (parseFloat(day.clicks) / parseFloat(day.impressions)) * 100;

        let dailyData = {
          date: new Date(day.date.slice(0, 10).replace(/-/g, "/"))
            .toString()
            .slice(0, 15),
          impressions: day.impressions,
          clicksPerImpression: clicksPerImpression,
          rpm: revenuePerThousandImpression,
          clicks: day.clicks,
          revenue: parseFloat(day.revenue).toFixed(2)
        };

        daily_stats.push(dailyData);
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
       * Original at https://www.amcharts.com/demos/pareto-diagram/
       * adjusted for EQWorks challenge by Tamires Lowande
       * ---------------------------------------
       */

      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end

      // Create chart instance
      let chart = am4core.create("dailyStatsChart", am4charts.XYChart);
      chart.scrollbarX = new am4core.Scrollbar();

      // Add data
      chart.data = daily_stats;

      // Create axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "date";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.tooltip.disabled = false;
      categoryAxis.renderer.labels.template.rotation = 90;
      categoryAxis.renderer.labels.template.location = 1;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.minWidth = 50;
      valueAxis.min = 0;
      valueAxis.cursorTooltipEnabled = false;

      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.sequencedInterpolation = true;
      series.dataFields.valueY = "impressions";
      series.dataFields.categoryX = "date";
      series.tooltipText = "Impressions: {valueY}[/]";
      series.columns.template.strokeWidth = 0;

      series.tooltip.pointerOrientation = "vertical";

      series.columns.template.column.cornerRadiusTopLeft = 10;
      series.columns.template.column.cornerRadiusTopRight = 10;
      series.columns.template.column.fillOpacity = 0.8;

      // on hover, make corner radiuses bigger
      let hoverState = series.columns.template.column.states.create("hover");
      hoverState.properties.cornerRadiusTopLeft = 0;
      hoverState.properties.cornerRadiusTopRight = 0;
      hoverState.properties.fillOpacity = 1;

      series.columns.template.adapter.add("fill", function(fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
      });

      let paretoValueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      paretoValueAxis.renderer.opposite = true;
      paretoValueAxis.min = 0;
      paretoValueAxis.max = 100;
      paretoValueAxis.strictMinMax = true;
      paretoValueAxis.renderer.grid.template.disabled = true;
      paretoValueAxis.numberFormatter = new am4core.NumberFormatter();
      paretoValueAxis.numberFormatter.numberFormat = "#'%'";
      paretoValueAxis.cursorTooltipEnabled = false;

      let paretoSeries = chart.series.push(new am4charts.LineSeries());
      paretoSeries.dataFields.valueY = "clicksPerImpression";
      paretoSeries.dataFields.categoryX = "date";
      paretoSeries.yAxis = paretoValueAxis;
      paretoSeries.tooltipText =
        "Clicks: {clicks} - CTR: {valueY.formatNumber('#.000')}%[/]";
      paretoSeries.bullets.push(new am4charts.CircleBullet());
      paretoSeries.strokeWidth = 2;
      paretoSeries.stroke = new am4core.InterfaceColorSet().getFor(
        "alternativeBackground"
      );
      paretoSeries.strokeOpacity = 0.5;

      //----

      var paretoSeriesB = chart.series.push(new am4charts.LineSeries());
      paretoSeriesB.dataFields.valueY = "rpm";
      paretoSeriesB.dataFields.categoryX = "date";
      paretoSeriesB.yAxis = paretoValueAxis;
      paretoSeriesB.tooltipText =
        "Revenue: {revenue} - RPM: ${valueY.formatNumber('#.000')}[/]";
      paretoSeriesB.bullets.push(new am4charts.CircleBullet());
      paretoSeriesB.strokeWidth = 2;
      paretoSeriesB.stroke = new am4core.InterfaceColorSet().getFor(
        "alternativeBackground"
      );
      paretoSeriesB.strokeOpacity = 0.5;

      // Cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = "panX";
    })
    .catch(error => {
    console.log("got to the catch on stats")
    location.reload()
    })
  };

  getStats_daily();
  
  //--------------------
  
  $(".selected_day").change((e) => {
    getStats_hourly(e.target.value)
    $("#statsHourlyDiv").css("display","block")
    $('html, body').animate({
    scrollTop: $("#statsHourlyDiv").offset().top
}, 1000);
    // console.log(e.target.value)
  })
  
  
  let hourly_stats
  
  const getStats_hourly = (dateSelected) => {
    return $.ajax("https://habitual-license.glitch.me/stats/hourly", {
      method: "GET",
      data: {day:dateSelected}
    }).then(res => {
      let rawHourly_stats = res;

      hourly_stats = rawHourly_stats
      // hourly_stats.length = 24

      let data = []
          
          hourly_stats.forEach(hour => {
      
        let revenuePerThousandImpression =
          (parseFloat(hour.revenue) / parseFloat(hour.impressions)) * 1000;

        let clicksPerImpression =
          (parseFloat(hour.clicks) / parseFloat(hour.impressions)) * 100;
        
        let element = {
          // category: new Date(hour.date.slice(0, 10).replace(/-/g, "/"))
          //   .toString()
          //   .slice(0, 15) + " at " + hour.name,
          category: `${hour.hour}:00 at ${hour.name}`,
          value2: hour.impressions,
          value1: clicksPerImpression,
          value3: revenuePerThousandImpression.toFixed(2),
          // revenue: parseFloat(day.revenue).toFixed(2)
        };
        data.unshift(element)
      })//end of map
      
      
     /**
     * ---------------------------------------
     * This demo was created using amCharts 4.
     * 
     * For more information visit:
     * https://www.amcharts.com/
     * https://www.amcharts.com/demos/horizontally-stacked-axes/
     *
     * Documentation is available at:
     * https://www.amcharts.com/docs/v4/
     * ---------------------------------------
     */

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

//     var data = [];
    var value1 = 1;
    var value2 = 200000;
    var value3 = 6;

    var interfaceColors = new am4core.InterfaceColorSet();

    var chart = am4core.create("statsHourlyDiv", am4charts.XYChart);

    chart.data = data;
    // the following line makes value axes to be arranged vertically.
    chart.bottomAxesContainer.layout = "horizontal";
    chart.bottomAxesContainer.reverseOrder = true;

    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.stroke = interfaceColors.getFor("background");
    categoryAxis.renderer.grid.template.strokeOpacity = 1;
    categoryAxis.renderer.grid.template.location = 1;
    categoryAxis.renderer.minGridDistance = 20;

    var valueAxis1 = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis1.tooltip.disabled = true;
    valueAxis1.renderer.baseGrid.disabled = true;
    valueAxis1.marginRight = 30;
    valueAxis1.renderer.gridContainer.background.fill = interfaceColors.getFor("alternativeBackground");
    valueAxis1.renderer.gridContainer.background.fillOpacity = 0.05;
    valueAxis1.renderer.grid.template.stroke = interfaceColors.getFor("background");
    valueAxis1.renderer.grid.template.strokeOpacity = 1;
    valueAxis1.title.text = "Click Through Rate - CTR";

    var series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.categoryY = "category";
    series1.dataFields.valueX = "value1";
    series1.xAxis = valueAxis1;
    series1.name = "Series 1";
    var bullet1 = series1.bullets.push(new am4charts.CircleBullet());
    bullet1.tooltipText = "{valueX.value}%";

    var valueAxis2 = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis2.tooltip.disabled = true;
    valueAxis2.renderer.baseGrid.disabled = true;
    valueAxis2.marginRight = 30;
    valueAxis2.renderer.gridContainer.background.fill = interfaceColors.getFor("alternativeBackground");
    valueAxis2.renderer.gridContainer.background.fillOpacity = 0.05;
    valueAxis2.renderer.grid.template.stroke = interfaceColors.getFor("background");
    valueAxis2.renderer.grid.template.strokeOpacity = 1;
    valueAxis2.title.text = "Impressions";

    var series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.categoryY = "category";
    series2.dataFields.valueX = "value2";
    series2.xAxis = valueAxis2;
    series2.name = "Series 2";
    var bullet2 = series2.bullets.push(new am4charts.CircleBullet());
    bullet2.fillOpacity = 0;
    bullet2.strokeOpacity = 0;
    bullet2.tooltipText = "{valueX.value}";

    var valueAxis3 = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis3.tooltip.disabled = true;
    valueAxis3.renderer.baseGrid.disabled = true;
    valueAxis3.renderer.gridContainer.background.fill = interfaceColors.getFor("alternativeBackground");
    valueAxis3.renderer.gridContainer.background.fillOpacity = 0.05;
    valueAxis3.renderer.grid.template.stroke = interfaceColors.getFor("background");
    valueAxis3.renderer.grid.template.strokeOpacity = 1;
    valueAxis3.title.text = "Revenue per Thousand Impression";

    var series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.categoryY = "category";
    series3.dataFields.valueX = "value3";
    series3.xAxis = valueAxis3;
    series3.name = "Series 3";
    var bullet3 = series3.bullets.push(new am4charts.CircleBullet());
    bullet3.tooltipText = "${valueX.value}";

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomY";

    var scrollbarY = new am4core.Scrollbar();
    chart.scrollbarY = scrollbarY;
    })// end of then
  }//end of function
  
}); //end of window.onload
