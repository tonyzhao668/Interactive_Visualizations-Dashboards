
//read in the data and build the test id list, and info group list
//data = d3.json("data/data.json");
var mtdata;
var samples;
d3.json("samples.json").then((data) => { 
   //console.log(data);
   var id_list = data.names;
   //console.log(id_list);
   mtdata = data.metadata;
   samples = data.samples;

   test_id_fill(id_list);
   //console.log(mtdata);
   //console.log(samples);
   function test_id_fill(idlist) {
    var sele = d3.select("#selDataset");
    sele.html("");
    for (var i = 0; i < idlist.length; i++) {
        var optionrow = sele.append("option");
        optionrow.text(idlist[i]);
        optionrow.attr("value", idlist[i]);
    };
    }

    function fill_info_panel(testid){
        //console.log(mtdata);
        console.log(testid);
        var objr = mtdata.filter(item => parseInt(item.id) === parseInt(testid));
        var objs = samples.filter(item => parseInt(item.id) === parseInt(testid));
        var obj = objr[0];
        var obs = objs[0];
        //console.log(obj);
        //console.log(Object.keys(obj));
    
        var info_keys = Object.keys(obj);
        var info = Object.values(obj);

        //console.log(obs);

    
        var opblock = d3.select("#sample-metadata");
        opblock.html("");
        for (var i = 0; i < 7; i++) {
            oprow = opblock.append("div");
            oprow.text(`${info_keys[i]} : ${info[i]}`);
            oprow.attr("value", info_keys[i]);
        };


        function charts_show(obja,objb) {
        
            var sam_values = objb.sample_values.slice(0, 10).reverse();
            var otuids = objb.otu_ids.slice(0, 10).reverse();
            var otulabels = objb.otu_labels.slice(0, 10).reverse();
            var ylabel = otuids.map(item => `OTU_${item}`);
            var wfre = obja.wfreq;
            
            //console.log(ylabel);

            // Trace1 for the top 10 OTU Data
            var trace1 = {
            x: sam_values,
            y: ylabel,
            text: otulabels,
            name: "Top 10 Otu Facts",
            type: "bar",
            orientation: "h"
            };

            var chartData = [trace1];

            var layout = {
                title: "Top 10 Otu Facts",
                xaxis:{title:{text:"Sample_Values"}},
                yaxis: {title:{text:"OTU_IDS"}},

                margin: {
                  l: 100,
                  r: 100,
                  t: 100,
                  b: 100
                }
              };

            Plotly.newPlot("bar", chartData, layout);

            //bubble workshop
            var yvalues = objb.sample_values;
            var xvalues = objb.otu_ids;           
            var colorlist =[];
            var opalist = [];
            var sizelist = [];
            var lengthh = xvalues.length;
           
            for (var i = 0; i < lengthh; i++) {
                var si = getRandomSize();
                var co = getRandomColor();
                var op = getRandomOpacity();
                colorlist.push(co);
                opalist.push(op);
                sizelist.push(si);
            };

            // console.log(colorlist);
            // console.log(opalist);
            // console.log(sizelist);

            var trace2 = {
                x: xvalues,
                y: yvalues,
                mode: 'markers',
                marker: {
                  color: colorlist,
                  opacity: opalist,
                  size: sizelist
                }
              };
              
              var data = [trace2];
              
              var layout = {
                title: 'OTU ID vs. Sample_Values',
                xaxis:{title:{text:"OTU_IDS"}},
                yaxis: {title:{text:"Sample_values"}},
                showlegend: false,
                height: 500,
                width: 800
              };
              
              Plotly.newPlot('bubble', data, layout);

              function getRandomColor() {              
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++) {
                  color += letters[Math.floor(Math.random() * 16)];
                }
                //console.log(color);
                return color;
                }

              function getRandomSize() {
                var inisize = 100;
                var size = Math.floor(Math.random() * inisize) + 1;
                //console.log(size);
                return size;
              }

              function getRandomOpacity() {
                var opa = Math.random();
                //console.log(opa);
                return opa;
              }
           
              var data = [
                {
                  domain: { x: [0, 1], y: [0, 1] },
                  value: wfre || 0,
                  title: { text: "Weekly Belly Button Washing Frequency" },
                  type: "indicator",
                  mode: "gauge+number+delta",
                  //delta: { reference: 4 },
                  gauge: {
                    axis: { range: [null, 10] },
                    steps: [
                      { range: [0, 2], color: "#F5FAF9" },
                      { range: [2, 4], color: "#CAF7F4" },
                      { range: [4, 6], color: "#9BF3ED" },
                      { range: [6, 8], color: "#51DBD2" },
                      { range: [8, 10], color:"#23C7BC" }
                    ],
                    threshold: {
                      line: { color: "red", width: 4 },
                      thickness: 0.75,
                      value: 9
                    }
                  }
                }
              ];
              
              var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
              Plotly.newPlot('gauge', data, layout);
           

            // console.log(si);
            // console.log(co);
            // console.log(op);
            
        }

        charts_show(obj, obs);
    }

    function handleSubmit() {
        // Prevent the page from refreshing
        d3.event.preventDefault();
      
        // Select the input value from the form
        var inpu = d3.select("#selDataset").node().value;
        //console.log(inpu);
      
        // clear the input value
        d3.select("#selDataset").node().value = "";
      
        // Build the plot with the new input
        fill_info_panel(inpu);
      }
    
    d3.selectAll("#selDataset").on("change", handleSubmit);
    
    
});


