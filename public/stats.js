$(() => {

  let daily_stats;

  const getStats_daily = () => {
    return $.ajax("https://habitual-license.glitch.me/stats/daily", {
      method: "GET"
    }).then(res => {
      rawDaily_stats = res;

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
        "Revenue: {revenue} - RPM: {valueY.formatNumber('#.000')}%[/]";
      paretoSeriesB.bullets.push(new am4charts.CircleBullet());
      paretoSeriesB.strokeWidth = 2;
      paretoSeriesB.stroke = new am4core.InterfaceColorSet().getFor(
        "alternativeBackground"
      );
      paretoSeriesB.strokeOpacity = 0.5;

      // Cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = "panX";
    });
  };

  getStats_daily();
}); //end of window.onload
