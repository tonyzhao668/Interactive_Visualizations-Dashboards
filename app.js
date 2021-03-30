
//read in the data and build the test id list, and info group list
//data = d3.json("data/data.json");
var mtdata;
var samples;
d3.json("samples.json").then((data) => { 
   //console.log(data);
   var id_list = data.names;
   //console.log(id_list);
   // read in the metadata and samples
   mtdata = data.metadata;
   samples = data.samples;

   //build the dropdowm menu
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

    //function to fill the panel info
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

        //function to draw all the charts
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
                title: `Top 10 Otu Facts of Test ID${obja.id}`,
                xaxis:{title:{text:"Sample_Values"}},
                yaxis: {title:{text:"OTU_IDS"}},
                //height: 300,
                //width: 480,

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
            var texts = objb.otu_labels;  

            console.log(texts);
            console.log(yvalues);
            console.log(xvalues);

            var colorlist =[];
            var opalist = [];
            var sizelist = [];
            var lengthh = xvalues.length;
           
            //use sample values to fabricate size list, otu_id to fabricate the color list
            //use random to fabricate the opacity list
            for (var i = 0; i < lengthh; i++) {
                var si = getSize(yvalues[i]);
                var co = getColor(xvalues[i]);
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
                text : texts,
                mode: 'markers',
                marker: {
                  color: colorlist,
                  opacity: opalist,
                  size: sizelist
                }
              };
              
              var data = [trace2];
              
              var layout = {
                title: `OTU ID vs. Sample_Values of Test ID${obja.id}`,
                xaxis:{title:{text:"OTU_IDS"}},
                yaxis: {title:{text:"Sample_values"}},
                showlegend: false,
                height: 500,
                width: 800
              };
              
              Plotly.newPlot('bubble', data, layout);

              //function to make color with each input value
              function getColor(a) { 
                var num = a.toString(16);
                var len = num.length;

                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6 - len; i++) {
                  color += letters[Math.floor(Math.random() * 16)];
                }
                color += num;
                //console.log(color);
                return color;
                }
              
              //function for bubble size with each input value
              function getSize(b) {
                var size = b * 5 > 100 ? 100 : b * 5;
                //var size = Math.floor(Math.random() * inisize) + 1;
                //console.log(size);
                return size;
              }

              //function for opacity value
              function getRandomOpacity() {
                var opa = Math.random();
                //console.log(opa);
                return opa;
              }
             
              //draw the gauge chart
              var data = [
                {
                  domain: { x: [0, 1], y: [0, 1] },
                  value: wfre || 0,
                  title: { text: `Weekly Belly Button Washing Frequency of Test ID${obja.id}` },
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
                      line: { color: "blue", width: 4 },
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
       
        //call to run the charts_show function
        charts_show(obj, obs);
    }
    //function to handle submit
    function handleSubmit() {
        // Prevent the page from refreshing
        d3.event.preventDefault();
      
        // Select the input value from the form
        var inpu = d3.select("#selDataset").node().value;
        //console.log(inpu);
      
        // clear the input value
        d3.select("#selDataset").node().value = "";
      
        //call to run the process with the new input
        fill_info_panel(inpu);
      }
    
    //listion and wait for the dropdown action and to pick up the input 
    d3.selectAll("#selDataset").on("change", handleSubmit);
    
    
});


