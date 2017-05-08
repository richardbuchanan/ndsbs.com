// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Service', 'Sales'],
    ['Assessments', Drupal.settings.ndsbs_performance_reports.assessments_total],
    ['Rush orders', Drupal.settings.ndsbs_performance_reports.rush_total]
  ]);

  var options = {
    title: 'Amount by service type',
    curveType: 'function',
    legend: { position: 'bottom' }
  };

  var chart = new google.visualization.BarChart(document.getElementById('chart'));

  chart.draw(data, options);
}