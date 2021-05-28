$(function() {
  Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json', function(data) {
    map_data = data;
    initiateMap(map_data);

  });

  function initiateMap(data) {
    Highcharts.mapChart('container', {

      title: {
        text: 'Drinking water, sanitation and hygiene in schools around the World'
      },

      colorAxis: {
        min: 1,
        max: 1000,
        type: 'logarithmic'
      },

      plotOptions: {
        series: {
          events: {
            click: function(e) {
              selCountry = e.point.name;
              var type = $('#sc_drop_type :selected').text();
              $("#submit_map").trigger("click");
            }
          }
        }
      },

      series: [{
        data: data,
        mapData: Highcharts.maps['custom/world'],
        joinBy: ['iso-a2', 'code'],
        name: 'Population density',
        states: {
          hover: {
            color: '#a4edba'
          }
        },
        tooltip: {
          valueSuffix: '/km²'
        }
      }]
    });
  }

  function displayChart(country, type) {
    region_data = ['National', 'Urban', 'Rural', 'Pre-primary', 'Primary', 'Secondary'];
    basic_data = [];
    limited_data = [];
    no_data = [];
    if (type == 'Water') {
      region_data.forEach(function(r) {
        if (typeof(school_data[country]) == 'undefined') {
          basic_data.push(0);
          limited_data.push(0);
          no_data.push(0);
        } else {
          basic_data.push(school_data[country][type][r]['Basic water service']);
          limited_data.push(school_data[country][type][r]['Limited water service']);
          no_data.push(school_data[country][type][r]['No water service']);
        }
      });
      document.getElementById("highm").style.overflow = "visible";

    } else if (type == 'Sanitation') {
      region_data.forEach(function(r) {
        if (typeof(school_data[country]) == 'undefined') {
          basic_data.push(0);
          limited_data.push(0);
          no_data.push(0);
        } else {
          basic_data.push(school_data[country][type][r]['Basic sanitation service']);
          limited_data.push(school_data[country][type][r]['Limited sanitation service']);
          no_data.push(school_data[country][type][r]['No sanitation service']);
        }
      });
      document.getElementById("highm").style.overflow = "visible";
    } else if (type == 'Hygiene') {
      region_data.forEach(function(r) {
        if (typeof(school_data[country]) == 'undefined') {
          basic_data.push(0);
          limited_data.push(0);
          no_data.push(0);
        } else {
          basic_data.push(school_data[country][type][r]['Basic hygiene service']);
          limited_data.push(school_data[country][type][r]['Limited hygiene service']);
          no_data.push(school_data[country][type][r]['No hygiene service']);
        }
        document.getElementById("highm").style.overflow = "visible";

      });
    }

    var chart = $("#highm").highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: type + ' Facilities in different regions of ' + country
      },
      xAxis: {
        categories: region_data,
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Percent'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px;width:50px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        name: 'Basic ' + type + ' Service',
        data: basic_data

      }, {
        name: 'Limited ' + type + ' service',
        data: limited_data

      }, {
        name: 'No ' + type + ' service',
        data: no_data

      }]
    });
  }

  $('input[type=radio][name=viewChart]').change(function() {
    if (this.value == 'pie_ch') {
      $('#sc_drop2').show();
      $('#sc_drop1').hide();
    } else if (this.value == 'bar_chart') {
      $('#sc_drop1').show();
      $('#sc_drop2').hide();
    }
  });

  $("#submit_map").on("click", function() {
    var chartType = $("input[name='viewChart']:checked").val();
    if (typeof(selCountry) == 'undefined') {
      selCountry = 'India';
    }
    if (chartType == 'pie_ch') {
      var type = $('#sc_drop_region :selected').text();
      displayPieChart(selCountry, type);
    } else if (chartType == 'bar_chart') {
      var type = $('#sc_drop_type :selected').text();
      displayChart(selCountry, type);
    }
    window.scrollTo(0, document.body.scrollHeight);
  });

  function displayPieChart(country, type) {
    $("#highm").empty();
    result = [];
    var keys = Object.keys(school_data[country]['Water'][type]);
    keys.forEach(function(key) {
      newData = {};
      newData["name"] = key;
      newData["y"] = school_data[country]['Water'][type][key];
      result.push(newData);
    });


    var pieColors = (function() {
      var colors = [],
        base = Highcharts.getOptions().colors[0],
        i;

      for (i = 0; i < 10; i += 1) {
        colors.push(Highcharts.color(base).brighten((i - 3) / 7).get());
      }
      return colors;
    }());

    // Build the chart
    $("#highm").highcharts({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: type + ' Level WASH data in ' + country
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          colors: pieColors,
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
            distance: -50,
            filter: {
              property: 'percentage',
              operator: '>',
              value: 4
            }
          }
        }
      },
      series: [{
        name: type + ' Level',
        data: result
      }]
    });
  }

  $('.navbar-nav a').click(function() {
    $('.navbar-nav li').removeClass('active');
    $(this).parent().addClass('active');
    var activeTab = $(this).attr('href');
    //$('#tab-body > div:visible').hide();
    $(activeTab).show();
    if (activeTab == '#tab1') {
      $("#sel_div").show();
      $("#sec_drop").hide();
      $("#sec_drop_yr").hide();
      $("#references").hide();
      if (Object.keys(map_data).length === 0) {
        $.getJSON("https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json", function(data) {
          map_data = data;
          initiateMap(map_data);
        });
      } else
        initiateMap(map_data);
    } else if (activeTab == '#tab2') {
      $("#highm").empty();
      $("#sel_div").hide();
      $("#sec_drop").show();
      $("#sec_drop_yr").hide();
      $("#references").hide();
      if (Object.keys(region_water_data).length === 0) {
        $.getJSON("https://raw.githubusercontent.com/Sasikiranmayi/wash-data/main/region_water_data.json", function(data) {
          region_water_data = data;
          displayTreeMap(region_water_data, 'Water');
        });
      } else
        displayTreeMap(region_water_data, $('#sec_drop_type :selected').text());
      if (Object.keys(region_sanitation_data).length === 0) {
        $.getJSON("https://raw.githubusercontent.com/Sasikiranmayi/wash-data/main/region_sanitation_data.json", function(data) {
          region_sanitation_data = data;
        });
      } else
        displayTreeMap(region_sanitation_data, $('#sec_drop_type :selected').text());
      if (Object.keys(region_hygiene_data).length === 0) {
        $.getJSON("https://raw.githubusercontent.com/Sasikiranmayi/wash-data/main/region_hygiene_data.json", function(data) {
          region_hygiene_data = data;
        });
      } else
        displayTreeMap(region_hygiene_data, $('#sec_drop_type :selected').text());

    } else if (activeTab == '#tab3') {
      $("#highm").empty();
      $("#sel_div").hide();
      $("#sec_drop").hide();
      $("#sec_drop_yr").show();
      $("#references").hide();

      if (Object.keys(water_2k_yrs_diff).length === 0) {
        $.getJSON("https://raw.githubusercontent.com/Sasikiranmayi/wash-data/main/2000_water_yr_data.json", function(data) {
          water_2k_yrs_diff = data;
          countries = Object.keys(data);
          countries.forEach(function(country) {
            $('#sel_country').append(new Option(country, country));
          });
        });
        $.getJSON("https://raw.githubusercontent.com/Sasikiranmayi/wash-data/main/2017_water_yr_data.json", function(data) {
          water_2017_yrs_diff = data;
          if (Object.keys(water_2k_yrs_diff).length != 0 && $('#sec_drop_type1 :selected').text() == 'Water') {
            displayColChart(water_2k_yrs_diff, water_2017_yrs_diff);
          }
        });
      } else {
        if ($('#sec_drop_type1 :selected').text() == 'Water')
          displayColChart(water_2k_yrs_diff, water_2017_yrs_diff);
      }

      if (Object.keys(sanitation_2k_yrs_diff).length === 0) {
        $.getJSON("https://raw.githubusercontent.com/Sasikiranmayi/wash-data/main/2000_sanitation_yr_data.json", function(data) {
          sanitation_2k_yrs_diff = data;
        });
        $.getJSON("https://raw.githubusercontent.com/Sasikiranmayi/wash-data/main/2017_sanitation_yr_data.json", function(data) {
          sanitation_2017_yrs_diff = data;
          if (Object.keys(sanitation_2017_yrs_diff).length != 0 && $('#sec_drop_type1 :selected').text() == 'Water') {
            displayColChart(sanitation_2k_yrs_diff, sanitation_2017_yrs_diff);
          }
        });
      } else {
        if ($('#sec_drop_type1 :selected').text() == 'Sanitation')
          displayColChart(sanitation_2k_yrs_diff, sanitation_2017_yrs_diff);
      }

    } else if (activeTab == '#tab4') {
      $("#highm").empty();
      $("#sel_div").hide();
      $("#sec_drop").hide();
      $("#sec_drop_yr").hide();
      $("#references").show();
      $("#container").empty();
    }

    return false;
  });

  $("#sel_country").on("change", function() {
    var type = $('#sec_drop_type1 :selected').text();
    if (type == 'Water')
      displayColChart(water_2k_yrs_diff, water_2017_yrs_diff);
    else if (type == 'Sanitation')
      displayColChart(sanitation_2k_yrs_diff, sanitation_2017_yrs_diff);
  });

  $("#sc_drop_region1").on("change", function() {
    var type = $('#sec_drop_type1 :selected').text();
    if (type == 'Water')
      displayColChart(water_2k_yrs_diff, water_2017_yrs_diff);
    else if (type == 'Sanitation')
      displayColChart(sanitation_2k_yrs_diff, sanitation_2017_yrs_diff);
  });

  $("#sec_drop_type1").on("change", function() {
    if (this.value == 'Water')
      displayColChart(water_2k_yrs_diff, water_2017_yrs_diff);
    else if (this.value == 'Sanitation')
      displayColChart(sanitation_2k_yrs_diff, sanitation_2017_yrs_diff);
  });

  function displayColChart(data1, data2) {
    y1_data = [];
    y2_data = [];
    var country = $('#sel_country :selected').text();
    var region = $('#sc_drop_region1 :selected').text();
    var type = $('#sec_drop_type1 :selected').text();
    if (type == 'Water')
      data_set = ["At least basic", "Limited", "Unimproved", "Surface water"];
    else if (type == 'Sanitation')
      data_set = ["At least basic", "Limited", "Unimproved", "Open defecation"];

    data_set.forEach(function(cat) {
      y1_data.push(data1[country][region][cat]);
      y2_data.push(data2[country][region][cat]);
    });

    var chart = $("#container").highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: type + ' facilities in different regions of ' + country
      },
      xAxis: {
        categories: data_set,
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Percent'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px;width:50px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        name: '2000',
        data: y1_data

      }, {
        name: '2017',
        data: y2_data

      }]
    });
  }

  $("#sec_drop_type").on("change", function() {
    if (this.value == 'Water')
      displayTreeMap(region_water_data, this.value);
    else if (this.value == 'Sanitation')
      displayTreeMap(region_sanitation_data, this.value);
    else
      displayTreeMap(region_hygiene_data, this.value);
  });

  function displayTreeMap(tree_data, type) {
    var points = [],
      regionP,
      regionVal,
      regionI = 0,
      countryP,
      countryI,
      causeP,
      causeI,
      region,
      country,
      cause;

    for (region in tree_data) {
      if (tree_data.hasOwnProperty(region)) {
        regionVal = 0;
        regionP = {
          id: 'id_' + regionI,
          name: region,
          color: Highcharts.getOptions().colors[regionI]
        };
        countryI = 0;
        for (country in tree_data[region]) {
          if (country == 'urban' || country == 'Population')
            continue;
          if (tree_data[region].hasOwnProperty(country)) {
            countryP = {
              id: regionP.id + '_' + countryI,
              name: country,
              parent: regionP.id
            };
            points.push(countryP);
            causeI = 0;
            for (cause in tree_data[region][country]) {
              if (tree_data[region][country].hasOwnProperty(cause)) {
                causeP = {
                  id: countryP.id + '_' + causeI,
                  name: cause,
                  parent: countryP.id,
                  value: Math.round(+tree_data[region][country][cause])
                };
                points.push(causeP);
                causeI = causeI + 1;
              }
            }
            countryI = countryI + 1;
          }
        }
        regionP.value = tree_data[region]['Population'];
        points.push(regionP);
        regionI = regionI + 1;
      }
    }
    $("#container").highcharts({
      series: [{
        type: 'treemap',
        layoutAlgorithm: 'squarified',
        allowDrillToNode: true,
        animationLimit: 1000,
        dataLabels: {
          enabled: false
        },
        levelIsConstant: false,
        levels: [{
          level: 1,
          dataLabels: {
            enabled: true
          },
          borderWidth: 3
        }],
        data: points
      }],
      subtitle: {
        text: 'Click points to drill down.</a>.'
      },
      title: {
        text: 'SDG Regions Level data for ' + type
      }
    });

  }
});
