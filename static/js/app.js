// Function for change on dropdown menu
function optionChanged(selectID){

    // Check if value is selected in dropdown
    console.log(selectID);
 
    // Read the json file for the data
    d3.json("data/samples.json").then((data) => {
 
    // Clears dropdown
    d3.select("#selDataset").html("");   
    
    // Select the metadata array and for each item append the item ID and adds ID to dropdown
    data.metadata.forEach(item => {
         d3.select ("#selDataset").append('option').attr('value', item.id).text(item.id);
         });

    // Selected value is passed
    d3.select("#selDataset").node().value = selectID;
    
    // Filter Metadata for selected ID from dropdown
    const study_metadata = data.metadata.filter(item=> (item.id == selectID));

    console.log(study_metadata);
    
    const panelDisplay = d3.select("#sample-metadata");
    panelDisplay.html("");
    Object.entries(study_metadata[0]).forEach(item=> 
       {
          // console.log(item);
          panelDisplay.append("p").text(`${item[0]}: ${item[1]}`)
       });
 
    // BAR CHART
 
    // Filter sample array data for the selected ID
    const sample_id = data.samples.filter(item => parseInt(item.id) == selectID);
    
    // Slice top 10 sample values
    var sample_values = sample_id[0].sample_values.slice(0,10);
    sample_values = sample_values.reverse();
    var otu_id = sample_id[0].otu_ids.slice(0,10);
    otu_id = otu_id.reverse();
    var otu_labels = sample_id[0].otu_labels
    otu_labels = otu_labels.reverse();
 
    // Y axis of bar chart
    const yAxis = otu_id.map(item => 'OTU' + " " + item);
    
    // Define the layout and trace object, edit color and orientation
       const trace = {
       y: yAxis,
       x: sample_values,
       type: 'bar',
       orientation: "h",
       text:  otu_labels,
       marker: {
          color: 'green',
          line: {
             width: 3
         }
        }
       },
       layout = {
       title: 'Top 10 OTUs found per Individual',
       xaxis: {title: '# of Samples Collected'},
       yaxis: {title: 'OTU ID'}
       };
 
       // Plot using Plotly
       Plotly.newPlot('bar', [trace], layout,  {responsive: true});    
       
 // BUBBLE CHART
 
 // Remove Sample value and otuID from individual
 var sampleValue1 = sample_id[0].sample_values;
 var otuID= sample_id[0].otu_ids;
 
 // Define the layout and trace object, edit color and orientation
 var trace1 = {
    x: otuID,
    y: sampleValue1,
    mode: 'markers',
    marker: {
      color: 'blue',
      
      size: sampleValue1
    }
  },
 
  layout1 = {
    title: 'Bubble Chart For Each Sample',
    xaxis: {title: 'OTU ID'},
    yaxis: {title: '# of Samples Collected'},
    showlegend: false,
    height: 800,
    width: 1800
    };
    
 // Plot using Plotly
 Plotly.newPlot('bubble', [trace1], layout1);
 
 // BONUS: GAUGE CHART

 // Gauge Chart to plot weekly washing frequency 
 const guageDisplay = d3.select("#gauge");
 guageDisplay.html(""); 

 var washes = study_metadata[0].wfreq;
 
 var guage_data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: washes,
      title: { text: "<b>Belly Button Scrubs Per Week" },
      type: "indicator",
      mode: "gauge+number",     
       gauge: {
       axis: { range: [0,9] },
       bar: { color: "red" },
       steps: [
          { range: [0, 1], color: "#e5d5d0" },
          { range: [1, 2], color: "#dbc7c2" },
          { range: [2, 3], color: "#d2b9b4" },
          { range: [3, 4], color: "#c9ada7" },
          { range: [4, 5], color: "#ac9899" },
          { range: [5, 6], color: "#8a7e88" },
          { range: [6, 7], color: "#7d7482" },
          { range: [7, 8], color: "#706a7b" },
          { range: [8, 9], color: "#4a4e69" }
                
        ],
       threshold: {
          value: washes
        }
      }
    }
  ]; 
  const gaugeLayout = {  width: 600, 
                   height: 400, 
                   margin: { t: 0, b: 0 }, 
                    };
 
 // Plot using Plotly
  Plotly.newPlot('gauge', guage_data, gaugeLayout); 
 
 });
 }
 
 // Initial test starts at ID 940
 optionChanged(940);
 
 // Event on change takes the value and calls the function during dropdown selection
 d3.select("#selDataset").on('change',() => {
 optionChanged(d3.event.target.value);
 
 });