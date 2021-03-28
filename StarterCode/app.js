
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


        function charts_show(objb) {
            var sv_obj = {};
            var sam_values = objb.sample_values;
            //console.log(sam_values);

            for (var i = 0; i < sam_values.length; i++) {
                sv_obj[i] = sam_values[i];
            };
            console.log(sv_obj);
        }

        charts_show(obs);
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


