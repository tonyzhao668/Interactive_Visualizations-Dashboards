//data = d3.json("data/data.json");
d3.json("samples.json").then((data) => { 
   //console.log(data);
   var id_list = data.names;
   //console.log(id_list);

   test_id_fill(id_list);
  
});

function test_id_fill(idlist) {
    var sele = d3.select("#selDataset");
    sele.html("");
    for (var i = 0; i < idlist.length; i++) {
        var optionrow = sele.append("option");
        optionrow.text = idlist[i];
        optionrow.attr("value", idlist[i]);
    };
}