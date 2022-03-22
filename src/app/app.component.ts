import {
  ValueAxis,
  CircleBullet,
  XYCursor,
  XYChart,
  LineSeries,
  DateAxis,
} from '@amcharts/amcharts4/charts';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { color, create, useTheme } from '@amcharts/amcharts4/core';
// import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import {
  Component,
  OnInit,
  NgZone,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewChild,
  HostListener,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core';
import { MouseCursorStyle } from '@amcharts/amcharts4/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import {
  startOfDay,
  endOfDay,
  addHours,
  addDays,
  addYears,
  startOfYear,
  endOfYear,
  isBefore,
  addMonths,
} from 'date-fns';
// import { data } from './intervalData/denver';
import { data } from './intervalData/chicago-hour';
import { format, utcToZonedTime } from 'date-fns-tz';
// useTheme(am4themes_animated);
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  dateAxis: any;
  dateAxis2: any;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private zone: NgZone,
    private formBuilder: FormBuilder
  ) {}

  chart: am4charts.XYChart = new am4charts.XYChart();
  @ViewChild('chartDiv1', { static: false }) chartDiv1: ElementRef;
  start = new Date();
  end = new Date();

  ngOnInit() {
    let chart = (this.chart = am4core.create('chartdiv_1', am4charts.XYChart));
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    // let dateAxis2 = chart.xAxes.push(new am4charts.DateAxis());
    let consumptionAxis = chart.yAxes.push(new am4charts.ValueAxis());
    let demandAxis = chart.yAxes.push(new am4charts.ValueAxis());
    demandAxis.renderer.opposite = true;
    // let weatherAxis = chart.yAxes.push(new am4charts.ValueAxis());

    let consumptionSeries = chart.series.push(new am4charts.ColumnSeries());
    let demandSeries = chart.series.push(new am4charts.LineSeries());
    // let weatherSeries = chart.series.push(new am4charts.LineSeries());

    let consumptionSeries2 = chart.series.push(new am4charts.ColumnSeries());
    let demandSeries1 = chart.series.push(new am4charts.LineSeries());
    // let weatherSeries2 = chart.series.push(new am4charts.LineSeries());

    consumptionSeries.zIndex = 10;
    consumptionSeries2.zIndex = 10;
    demandSeries.zIndex = 20;
    demandSeries1.zIndex = 20;
    // weatherSeries.zIndex = 20;
    // weatherSeries2.zIndex = 20;

    dateAxis.min = addYears(startOfYear(new Date('2020-07-16')), 0).getTime();
    dateAxis.max = endOfYear(endOfYear(new Date('2020-07-16'))).getTime();

    // dateAxis2.min = addMonths(dateAxis.min, -3).getTime();
    // dateAxis2.max = addMonths(dateAxis.max, -3).getTime();
    // dateAxis2.min = addYears(startOfYear(new Date()), -4).getTime();
    // dateAxis2.max = addYears(startOfYear(new Date()), -1).getTime();

    this.zone.runOutsideAngular(() => {
      // Add legend
      chart.legend = new am4charts.Legend();
      chart.legend.position = 'absolute';
      chart.legend.parent = chart.bottomAxesContainer;
      chart.scrollbarX = new am4charts.XYChartScrollbar();
      chart.scrollbarX.parent = chart.bottomAxesContainer;

      // chart.dateFormatter.utc = true;
      // chart.maskBullets = false;
      chart.dateFormatter.inputDateFormat = 'i';
      chart.dateFormatter.timezone = 'America/Chicago';
      chart.cursor = new XYCursor();
      chart.cursor.behavior = 'zoomX';

      chart.cursor.behavior = 'selectXY';

      dateAxis.id = 'dateAxis';
      dateAxis.renderer.grid.template.location = 0;
      // dateAxis.renderer.grid.template.location = 0.5;
      dateAxis.renderer.labels.template.location = 0.00001;
      dateAxis.renderer.minGridDistance = 100;
      dateAxis.renderer.cellStartLocation = 0.2;
      dateAxis.renderer.cellEndLocation = 0.8;

      dateAxis.tooltipDateFormat = 'hh:mm a, d MMMM yyyy';
      dateAxis.tooltipText = '{HH:mm:ss}';
      dateAxis.renderer.grid.template.disabled = true;
      dateAxis.renderer.fullWidthTooltip = true;

      dateAxis.baseInterval = { timeUnit: 'hour', count: 5 };

      dateAxis.renderer.labels.template.adapter.add("text", (text, target: any) => {
        debugger
        if (target !== undefined) {
            dateAxis.dateFormats.setKey("day", "M/d");
        }
        return text;
      })

      // dateAxis2.id = 'dateAxisComp';
      // dateAxis2.renderer.grid.template.location = 0.5;
      // // dateAxis.renderer.grid.template.location = 0.5;
      // dateAxis2.renderer.labels.template.location = 0.00001;
      // dateAxis2.renderer.minGridDistance = 100;
      // dateAxis2.renderer.cellStartLocation = 0.2;
      // dateAxis2.renderer.cellEndLocation = 0.8;

      // dateAxis2.tooltipDateFormat = 'hh:mm a, d MMMM yyyy';
      // dateAxis2.tooltipText = '{HH:mm:ss}';
      // dateAxis2.renderer.grid.template.disabled = true;
      // dateAxis2.renderer.fullWidthTooltip = true;

      // dateAxis2.baseInterval = { timeUnit: 'hour', count: 1 };
      // dateAxis2.hide();

      consumptionAxis.title.text = 'consumption';
      consumptionAxis.title.fill = am4core.color('#0A7696');
      consumptionAxis.renderer.labels.template.fill = am4core.color('#0A7696');
      consumptionAxis.strictMinMax = false;
      // consumptionAxis.min = 0;
      consumptionAxis.renderer.grid.template.disabled = true;
      consumptionAxis.renderer.opposite = false;
      consumptionAxis.renderer.labels.template.fontWeight = 'bold';

      demandAxis.title.text = 'demand';
      demandAxis.title.fill = am4core.color('#E14555');
      demandAxis.renderer.labels.template.fill = am4core.color('#E14555');
      demandAxis.renderer.grid.template.disabled = true;
      demandAxis.renderer.opposite = true;
      demandAxis.background.fill = am4core.color('#fff');
      demandAxis.renderer.labels.template.fontWeight = 'bold';

      demandAxis.strictMinMax = false;
      // demandAxis.min = 0;
      demandAxis.title.rotation = 270;
      let consumptionState =
        consumptionSeries.columns.template.states.create('hover');
      // demandSeries.bullets.push(new am4charts.CircleBullet());
      // let demandBullet1 = demandSeries1.bullets.push(
      //   new am4charts.CircleBullet()
      // );

      // Create series
      consumptionSeries.columns.template.cursorOverStyle =
        MouseCursorStyle.pointer;
      consumptionSeries.sequencedInterpolation = false;
      consumptionSeries.dataFields.valueY = 'value';
      consumptionSeries.dataFields.dateX = 'time';
      consumptionSeries.yAxis = consumptionAxis;
      consumptionSeries.columns.template.propertyFields.strokeDasharray =
        'dashLength';
      consumptionSeries.groupFields.valueY = 'sum';
      consumptionSeries.name = 'Consumption';
      consumptionSeries.columns.template.fillOpacity = 1;
      consumptionSeries.columns.template.fill = am4core.color('#0C7696');
      consumptionSeries.stroke = am4core.color('#0C7696');
      consumptionSeries.tooltip.background.stroke = am4core.color('#0C7696');
      consumptionSeries.tooltip.label.fontWeight = 'bold';
      consumptionSeries.tooltip.background.fill = am4core.color('#ffffff');
      consumptionSeries.tooltip.label.fill = am4core.color('#000000');
      consumptionSeries.id = 'consumption';
      consumptionSeries.tooltip.background.strokeWidth = 0;
      consumptionSeries.tooltip.getFillFromObject = false;
      consumptionSeries.columns.template.tooltipText =
        "{valueY.formatNumber('#,###.')} " + +'';
      consumptionSeries.columns.template.width = am4core.percent(100);
      consumptionSeries.clustered = false;
      consumptionSeries.hiddenInLegend = true;
      consumptionSeries.hidden = true;
      consumptionSeries.hide();
      consumptionSeries.hide(0);

      consumptionSeries2.columns.template.cursorOverStyle =
        MouseCursorStyle.pointer;
      consumptionSeries2.sequencedInterpolation = false;
      consumptionSeries2.dataFields.valueY = 'value2';
      consumptionSeries2.dataFields.dateX = 'time';
      consumptionSeries2.yAxis = consumptionAxis;
      consumptionSeries2.columns.template.propertyFields.strokeDasharray =
        'dashLength';
      consumptionSeries2.groupFields.valueY = 'sum';
      consumptionSeries2.name = 'consumption1';
      consumptionSeries2.columns.template.fillOpacity = 1;
      consumptionSeries2.columns.template.fill = am4core.color('#59C2EC');
      consumptionSeries2.stroke = am4core.color('#59C2EC');
      consumptionSeries2.tooltip.background.stroke = am4core.color('#59C2EC');
      consumptionSeries2.tooltip.label.fontWeight = 'bold';
      consumptionSeries2.tooltip.background.fill = am4core.color('#ffffff');
      consumptionSeries2.tooltip.label.fill = am4core.color('#000000');
      consumptionSeries2.id = 'consumption1';
      consumptionSeries2.tooltip.background.strokeWidth = 0;
      consumptionSeries2.tooltip.getFillFromObject = false;
      consumptionSeries2.columns.template.tooltipText =
        "{valueY.formatNumber('#,###.')} " + +'';
      consumptionSeries2.columns.template.width = am4core.percent(100);
      consumptionState.properties.fillOpacity = 0.9;
      consumptionSeries2.hiddenInLegend = true;
      consumptionSeries2.clustered = false;
      consumptionSeries2.hide();

      demandSeries.defaultState.transitionDuration = 0;
      demandSeries.sequencedInterpolation = true;
      demandSeries.dataFields.valueY = 'demand';
      demandSeries.dataFields.dateX = 'time';
      demandSeries.yAxis = demandAxis;
      demandSeries.name = 'Demand';
      demandSeries.stroke = am4core.color('red');
      demandSeries.propertyFields.strokeDasharray = 'dashLength';
      demandSeries.strokeWidth = 2;
      demandSeries.stroke = am4core.color('#E03445');

      demandSeries.tooltip.background.stroke = am4core.color('#E03445');
      demandSeries.tooltip.label.fontWeight = 'bold';
      demandSeries.connect = false;
      demandSeries.tooltip.background.fill = am4core.color('#ffffff');
      demandSeries.tooltip.label.fill = am4core.color('#000000');
      demandSeries.id = 'demand';
      demandSeries.tooltip.background.strokeWidth = 2;
      demandSeries.tooltip.getFillFromObject = false;
      demandSeries.tooltipText = "{valueY.formatNumber('#,###.')} " + +'';
      demandSeries.groupFields.valueY = 'high';
      demandSeries.tensionX = 0.77;

      demandSeries1.defaultState.transitionDuration = 0;
      demandSeries1.sequencedInterpolation = true;
      demandSeries1.dataFields.valueY = 'value';
      demandSeries1.dataFields.dateX = 'time1';
      demandSeries1.yAxis = demandAxis;
      demandSeries1.name = 'demand1';
      demandSeries1.stroke = am4core.color('red');
      demandSeries1.propertyFields.strokeDasharray = 'dashLength';
      demandSeries1.strokeWidth = 2;
      demandSeries1.stroke = am4core.color('#D90368');
      demandSeries1.tooltip.background.stroke = am4core.color('#D90368');
      demandSeries1.tooltip.label.fontWeight = 'bold';
      demandSeries1.connect = false;
      demandSeries1.tooltip.background.fill = am4core.color('#ffffff');
      demandSeries1.tooltip.label.fill = am4core.color('#000000');
      demandSeries1.id = 'demand1';
      demandSeries1.tooltip.background.strokeWidth = 2;
      demandSeries1.tooltip.getFillFromObject = false;
      demandSeries1.tooltipText = "{valueY.formatNumber('#,###.')} " + +'';
      demandSeries1.tensionX = 0.77;
      demandSeries1.strokeDasharray = '8,4';
      // demandSeries1.hide();
      // demandSeries1.hiddenInLegend = false;

      //////////////////////////////////////////////
      // demandBullet1.fill = am4core.color('red');

      am4core.getInteraction().body.events.on('keydown', (ev) => {
        console.log('keyboard keydown');

        if (am4core.keyboard.isKey(ev.event, 'shift')) {
          chart.cursor.behavior = 'zoomX';
          // chart.cursor.behavior ="selectX";
          return;
        }

        chart.cursor.behavior = 'zoomX';
      });

      let data = this.generateChartData(
        startOfYear(new Date('2020-07-16')),
        endOfYear(new Date('2020-07-16')),
        18000,
        true
      );
      chart.map.getKey('demand').data = data;
      chart.map.getKey('demand1').data = data;

      this.dateAxis = dateAxis;
      // this.dateAxis2 = dateAxis2;
      // chart.events.on('ready', () => {});

      chart.map.getKey('consumption').hide(0);
      chart.map.getKey('demand').show();
      chart.map.getKey('demand').fillOpacity = 0.5;
      chart.map.getKey('demand').fill = am4core.color('#fc4e60');
      chart.map.getKey('demand').bulletsContainer.hide();
      chart.map.getKey('demand').cursorTooltipEnabled = true;

      // (
      //   chart.map.getKey('consumptionAxis') as am4charts.ValueAxis
      // ).cursorTooltipEnabled = true;
    });

    this.chart = chart;
  }
  addZoom() {
    (this.dateAxis as am4charts.DateAxis).zoomToDates(
      new Date('2020-07-16'),
      new Date('2020-08-06')
    );
    // let dateAxis2 = this.chart.xAxes.push(new am4charts.DateAxis());
    // dateAxis2.min = addYears(startOfYear(new Date()), -3).getTime();
    // dateAxis2.max = addYears(startOfYear(new Date()), -1).getTime();
  }
  generateChartData(start: Date, end: Date, interval, isWeather) {
    var chartData = [];
    var value = 1600;
    var demand = 1600;
    var temperature = 1600;

    let step = 0;
    var newDate: Date = start;
    while (isBefore(newDate, end)) {
      if (interval == 18000) {
        newDate = addHours(newDate, 5);
      } else {
        newDate = addMonths(newDate, 1);
      }

      if (step >= 60) {
        step = 0;
      } else {
        step = step + 5;
      }

      value += Math.round(
        (Math.random() < 0.5 ? 1 : -1) * Math.random() * 1000
      );
      demand += Math.round(
        (Math.random() < 0.5 ? 1 : -1) * Math.random() * 100
      );
      temperature += Math.round(
        (Math.random() < 0.5 ? 1 : -1) * Math.random() * 100
      );
      chartData.push({
        // time: newDate.toUTCString(),
        time: format(newDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        time1: format(addMonths(newDate, -3), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        value: value,
        demand: demand,
        // temperature: temperature,
      });
    }

    if (interval == 18000) {
    } else {
    }
    debugger;
    return chartData;
    // return data;
  }

  recentRange(value: number) {}

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      console.log('graph disposed');
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
