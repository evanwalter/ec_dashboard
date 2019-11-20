var tcc_background_color;
var tick_shape="circle"; // line chart only

var vertical_text = false;

tcc_div_chart_counter=1;


class ECDashboard{
	constructor(div_id,my_data,my_layout){
		this.div_id=div_id;
		for (let x=0;x < my_data.length;x++){
			if (my_data[x].qid == undefined) {
				my_data[x].qid = my_data[x].id;
			}
		}
		this.my_data=my_data;
		this.my_layout=my_layout;
		this.evanscharts = new ECCharts();
		this.ec_tables=new EcTables();;
		this.evanscharts.colors(["#4343ee","#ee4333","#fe43ee"]);
		this.run_times=0;
	}
	colors(colors){
		this.evanscharts.colors(colors);
	}
	run(){
		 let div_db = document.getElementById(this.div_id);
		 div_db.innerHTML="";
		
		  let rowctr=0;
		  for (rowctr=0; rowctr< this.my_layout.length; rowctr++)
			{
				let new_divrow=document.createElement("div");
				new_divrow.setAttribute("class","row")
				new_divrow.className="row";
				new_divrow.style.border="none 0px transparent";
				new_divrow.style.textAlign="center";
				div_db.appendChild(new_divrow);
				let next_row_data=this.my_layout[rowctr];
				for(let x=0;x < next_row_data.length;x++){
					if (next_row_data[x] instanceof Array == true)
					{
						let next_row_data_data=[];	
					} else{	
						let divcellname="div_id11__"+rowctr+"_"+x;
						//if (this.run_times > 0) {
						//	let div_db_cellname = document.getElementById(this.divcellname);
						//	div_db_cellname.innerHTML="";
						//}
						let div_span="12" ;
						let div_height=460;
						let div_borderstyle="solid 1px #333";
						if (!(next_row_data[x].height==undefined)) {div_height=next_row_data[x].height}; 
						if (!(next_row_data[x].span==undefined)) {div_span=next_row_data[x].span}; 
						if (!(next_row_data[x].borderstyle==undefined)) {div_borderstyle=next_row_data[x].borderstyle}; 
						let classname="ec-div-box col-md-"+div_span;
						let new_cell=document.createElement("div");
						new_cell.id=divcellname;
						new_cell.className=classname;
						new_cell.setAttribute("class",classname);
						new_cell.style.border=div_borderstyle;
						
						new_divrow.appendChild(new_cell);
						// ------------IF THE NEXT CELL INCLUDES AN ARRAY OF DATA
						let new_cell_subdiv=document.createElement("div");
						new_cell_subdiv.setAttribute("class","row");
						new_cell_subdiv.style.border="solid 0px transparent";
						new_cell_subdiv.className="row";
						new_cell.appendChild(new_cell_subdiv);
						let next_row_data_array = new Array();
						if (next_row_data[x].data instanceof Array == true){
							next_row_data_array=next_row_data[x].data.slice();
						} else {
							next_row_data_array.push(next_row_data[x]);
						}	
						let chart_height=div_height/next_row_data_array.length - 2*next_row_data_array.length;
						for (let y = 0; y < next_row_data_array.length;y++){
								let next_data_section=next_row_data_array[y];
								let new_cell_subcell=document.createElement("div")
								let new_cell_subcell_id=divcellname+"_"+y;
								new_cell_subcell.id=new_cell_subcell_id;
								new_cell_subcell.className="col-md-12";
								new_cell_subcell.setAttribute("class","col-md-12");
								new_cell_subcell.style.border="solid 0px transparent";
								new_cell_subdiv.appendChild(new_cell_subcell);
																
								if ( !(next_data_section.innerHTML==undefined)) {
									new_cell_subcell.style.height=chart_height;
									new_cell.style.height=chart_height;
									let innerHTML=next_data_section.innerHTML;
									if (!(next_data_section.data_filter == undefined)){
											let next_data=my_data.filter(a=>a.qid==next_data_section.data_filter)
											if (next_data.length > 0) {
												if (!(next_data[0].qtext==undefined) ) {
													innerHTML=innerHTML.replace("[qtext]",next_data[0].qtext)
												}
												for (let z=0; z < next_data[0].data.length; z++ ) {
														for (let z2=0;z2 <next_data[0].data[z].length; z2++){
														innerHTML=innerHTML.replace("[item_points-"+z2+"]",next_data[0].item_points[z2]);
														innerHTML=innerHTML.replace("[data-"+z+"-"+z2+"]",next_data[0].data[z][z2]);
														}
													}
											}
										}
									new_cell_subcell.innerHTML=innerHTML;
								  }	else {
									if ( !(next_data_section.data_filter == undefined) ){
										let next_data=this.my_data.filter(a=> a.qid==next_data_section.data_filter )
										if (next_data.length > 0) {
												let charttype="column";
												let colors;
												let chart_label="";
												if (next_data_section.charttype != undefined ){ charttype=next_data_section.charttype } ;
												if (next_data_section.colors != undefined) { colors=next_data_section.colors; }
												if (next_data_section.chart_label != undefined) { chart_label=next_data_section.chart_label; }
												if (next_data_section.qtext != undefined) { chart_label=next_data_section.qtext; }
												if (chart_label==""){
												   chart_label=next_data[0].qtext;
												}
												if (charttype=="table"){
													this.ec_tables.build_table(new_cell_subcell_id,next_data[0].data); 
												}else {
													this.evanscharts.addchart(new_cell_subcell_id,next_data[0].data,next_data[0].item_points,next_data[0].items,charttype,chart_height,colors,chart_label);
												}
											}
										}	
									}  // END ELSE
								}
						}		
					
				}
				
			}
			this.evanscharts.run();	
		this.run_times+=1;
	}  // END run()
	// ENDING THE run()
	resize(){
		this.run();
	}

}









class ECCharts{
	constructor(div_id,data_set,item_points,items,charttype,height,colors,chart_label){
		this.datasets=[]
		this.showlegend=true;
		this.color_array=undefined;
		this.gradient=false;
		this.showscales=true;
		if (!(div_id != undefined)){
			this.datasets.push[div_id,data_set,item_points,items,charttype,height,colors,chart_label]
		}
	}
	colors(color_array){
		this.color_array=color_array;
	}
	
	addchart(div_id,data_set,item_points,items,charttype,height,colors,chart_label){
		this.datasets.push([div_id,data_set,item_points,items,charttype,height,colors,chart_label]);
	}
	
	run(){
		for (let x=0; x < this.datasets.length;x++){
			let div_id=this.datasets[x][0]
			let evanschart_div_width=document.getElementById(this.datasets[x][0]).offsetWidth;
		    //let div_id=div_id;
		    let jdiv_id ="#"+div_id;
			$(jdiv_id).empty();
			
			let showlegend=true;
			let data_set=this.datasets[x][1];
			if (data_set[0] instanceof Array == false)
				{
				   data_set=[data_set];
				   this.showlegend=false;
				};
			let item_points=this.datasets[x][2];
			let items=this.datasets[x][3];
			if (items == undefined){
					items=new Array();
					data_set.map( (next_item) => {items.push("");  });
				  	//for (let x=0; x < data_set.length; x++)
					//{
					//	items.push("");
					//}
					this.showlegend=false;
		     } else
			 { this.showlegend=true; }
			let charttype=this.datasets[x][4]
			if (charttype== undefined) { charttype="column";}
			let height=this.datasets[x][5]
			let colors=this.datasets[x][6]
			let chart_label=this.datasets[x][7];
			
			if (colors == undefined) {colors = this.color_array}
			if (height == undefined) { height=300}
			if (charttype=="pie"){
				items = new Array();
				item_points.map( (next_item,index) => {
					items.push({"name": next_item,"color": colors[index]});
				  })
				this.showlegend=true;
			}
			
		    let my_new_chart = {
          "div_id":div_id,
          "dimensions": { "height":height, "width":evanschart_div_width },
          "charttype": charttype,//"bar",//"column",
          "items": items, // eval(items) ,
          "itempoints": item_points, //eval(item_points) ,
          "data":data_set, //eval(data_set) , 
          "ispercentage": false,
          "chart_label":  chart_label,//"Blah blah blah and blah blab blah and blah blab blah  and blah blab blah  and blah blab blah  [CR]aeate taeea tae ta et aet et a taete",
          "chart_label_position": "top",
          "chart_footnote": "",//"ddddde eetet[CR] et[CR] etetetetetetete\natyeye yey eye y\neyteyeyyyyye  ete y",
          "display_footnote": false, 
		"backgroundcolor" : "transparent",  
          "color_scheme" : "combo", //"herecomesthesun",
		  "colors" : colors,
		"linecolor" : "#111",    
          "additionalsettings": { "showbackground" : true,"linearGradient" : this.gradient, "valueformat" : "%d%", "showlegend" : this.showlegend,"legend_position": "top", "shadeborders" : false, "borderleft": true, "borderright": false,
           "bordertop": false, "borderbottom": true,  "barmargin" : 18, "showscales" : this.showscales,"legend_offset_x": -100,"legend_offset_y": 10}
			}; 
			build_a_timber_creek_chart(my_new_chart)
		}	
	}  // END of run()
	
}


function build_a_timber_creek_chart(my_new_chart)
{
tcc_background_color="transparent"//"#efefff"
tcc_line_color="#000"

if (my_new_chart.backgroundcolor != null) { tcc_background_color=my_new_chart.backgroundcolor; }
if (my_new_chart.backgroundColor != null) { tcc_background_color=my_new_chart.backgroundColor; }
if (my_new_chart.background_color != null) { tcc_background_color=my_new_chart.background_color; }

if (my_new_chart.linecolor != null) { tcc_line_color=my_new_chart.linecolor; }
if (my_new_chart.lineColor != null) { tcc_line_color=my_new_chart.lineColor; }
if (my_new_chart.line_color != null) { tcc_line_color=my_new_chart.line_color; }

var tcc_default_colors = ["#8675ef","#1020fe","#6364fe","#4264fe","#9764f6","#5397fe","#5253ef","#3141ff","#6474fe","#0000cc","#6666ff","#0000e6","#9999ff","#0000ff","#000099","#1919ff","#ccccff","#476b00","#33d685","#197519","#00ff00","#5c8a00 ","#669900","#334600"];
var tcc_tcc_default_colors_combo= ["#0000ff","#b20000","#ffcc00","#197519","#cc0000","#e60000","#ff0000","#ff1919","#990000","#ff3333","#800000","#550000","#ff4D4D","#ff6666","#330000","#4c0000","#660000","#1a0000","#ff8080","#ff9999","#ffb2b2","#ffcccc","#ffe6e6"] 
var tcc_tcc_default_colors_reds= ["#b20000","#cc0000","#e60000","#ff0000","#ff1919","#990000","#ff3333","#800000","#550000","#ff4D4D","#ff6666","#330000","#4c0000","#660000","#1a0000","#ff8080","#ff9999","#ffb2b2","#ffcccc","#ffe6e6"] 
var tcc_tcc_default_colors_blues= ["#0000ff","#5555cc","#0000e6","#9999ff","#0000ff","#000099","#1919ff","#ccccff","#3333ff","#000050","#4d4dff","#000080","#8080ff","#0000b2","#b2b2ff","#9999b2","#0000f3","#00004c","#000066"]
var tcc_tcc_default_colors_greens = ["#476b00","#33d685","#197519","#00ff00","#5c8a00 ","#669900","#334600","#00e600","#527a00","#75a319","#85ad33","#94b84d","#80ff89","#a3c266 ","#b2cc80","#c2d699","#d1e0b2" ]
var tcc_tcc_default_colors_purplehaze= ["#7401DF","#6A0888","#8258FA","#AC58FA","#210B61","#2F0B3A","#DF01D7","#610B4B","#9F81F7","#8904B1","#D0A9F5","#2E2EFE","#BF00FF","#DF01D7","#F5A9D0","#2A0A29","#9A2EFE","#7401DF","#210B61","#8A0886","#380B61","#120A2A","#8A084B","#0000cc","#6666ff","#0000e6","#9999ff","#0000ff","#000099","#1919ff","#ccccff","#3333ff","#000050","#4d4dff","#000080","#8080ff","#0000b2","#b2b2ff","#9999b2","#0000f3","#00004c","#000066"]

var tcc_tcc_default_colors_burgundyblues = ["#660066","#8a084B","#6a0888","#333366","#800710", "#380B61","#7401df","#670000","#990033","#0404ae", "#8A0808","#8a0886","#660033","#663366","#3104B4","#666699","#1B0A2A","#4000FF","#9A2EFE","#240B3B","#8258FA","#AC58FA","#210B61","#2F0B3A","#DF01D7","#610B4B","#9F81F7","#8904B1","#D0A9F5","#2E2EFE","#BF00FF","#DF01D7","#F5A9D0","#2A0A29","#9A2EFE","#7401DF","#210B61","#8A0886","#380B61","#120A2A","#8A084B","#0000cc","#6666ff","#0000e6","#9999ff","#0000ff","#000099","#1919ff","#ccccff","#3333ff","#000050","#4d4dff","#000080","#8080ff","#0000b2","#b2b2ff","#9999b2","#0000f3","#00004c","#000066"]
var tcc_tcc_default_colors_herecomesthesun = ["#ffcc00","#ffff00","#ff9900","#dcdc00","#ff6600","#ffcc66","#ffff66","#ff9966","#ccaa00","#ffff99","#ffcc22","#bbaa00","#ccff00","#cc9322","#efdd1f","#feee25","#ccbc33","#ddff33",    "#ffcc00","#ffff00","#ff9900","#dcdc00","#ff6600","#ffcc66","#ffff66","#ff9966","#ccaa00","#ffff99","#ffcc22","#bbaa00","#ccff00","#cc9322","#efdd1f","#feee25","#ccbc33","#ddff33",   "#ff9900","#ff6600","#ffcc66"]

tcc_default_color_scheme="";
if (my_new_chart.tcc_default_colors != null){ tcc_default_color_scheme=my_new_chart.tcc_default_colors;}
if (my_new_chart.default_colours != null){ tcc_default_color_scheme=my_new_chart.default_colours;}
if (my_new_chart.tcc_default_color_scheme != null){ tcc_default_color_scheme=my_new_chart.tcc_default_color_scheme;}
if (my_new_chart.default_colour_scheme != null){ tcc_default_color_scheme=my_new_chart.default_colour_scheme;}
if (my_new_chart.color_scheme != null){ tcc_default_color_scheme=my_new_chart.color_scheme;}
if (my_new_chart.colour_scheme != null){ tcc_default_color_scheme=my_new_chart.colour_scheme; }
if (tcc_default_color_scheme != "")  {
if (tcc_default_color_scheme.indexOf("combo")>=0) { tcc_default_colors= tcc_tcc_default_colors_combo; }
if (tcc_default_color_scheme.indexOf("red")>=0) { tcc_default_colors= tcc_tcc_default_colors_reds; }
if (tcc_default_color_scheme.indexOf("blue")>=0) { tcc_default_colors= tcc_tcc_default_colors_blues; }
if (tcc_default_color_scheme.indexOf("green")>=0) { tcc_default_colors= tcc_tcc_default_colors_greens; }
if (tcc_default_color_scheme.indexOf("purplehaze")>=0) { tcc_default_colors= tcc_tcc_default_colors_purplehaze; } 
if (tcc_default_color_scheme.indexOf("burgundyblue")>=0) { tcc_default_colors= tcc_tcc_default_colors_burgundyblues; } 
if (tcc_default_color_scheme.indexOf("thesun")>=0) { tcc_default_colors= tcc_tcc_default_colors_herecomesthesun; } 
}
var div_id=my_new_chart.div_id;
var svgwidth=my_new_chart.dimensions.width;
var svgheight=my_new_chart.dimensions.height;
var chart_type="column";
if (my_new_chart.charttype != null)  {chart_type=my_new_chart.charttype; }

var myitems=new Array(my_new_chart.items.length);
var myitemcolors = new Array(my_new_chart.items.length);

// Assigning the items
for (x=0; x < my_new_chart.items.length;x++)
{
	if(my_new_chart.items[x].name != null) {  myitems[x]=my_new_chart.items[x].name; }
	 else {  if(my_new_chart.items[x] != null) { myitems[x]=my_new_chart.items[x];  } }
}
// Assigning the colours
for (x=0; x < my_new_chart.items.length;x++)
{
    mycolor=check_color(my_new_chart.items[x].color);
	if(my_new_chart.items[x].color != null) {  myitemcolors[x]=mycolor }
	else {
		if (my_new_chart.colors != undefined ){
		myitemcolors[x]=my_new_chart.colors[x];
			
		} else {
		myitemcolors[x]=tcc_default_colors[x];
		}
		}
}

var mydata = my_new_chart.data;
if (mydata[0] instanceof Array == false)
{
   mydata=[mydata];
};
var mydata_text=[""];
if (my_new_chart.data_text != null)
{
    mydata_text=my_new_chart.data_text;
} else
{
    if (my_new_chart.data != null)
    {
        mydata_text=my_new_chart.data;
    }
}
//alert (mydata_text);
if (mydata_text[0] instanceof Array == false)
{
   mydata_text=[mydata_text];
};
//alert (mydata_text);
/*
var mydata_details=[""];
if (my_new_chart.data != null)
{
    mydata_details=my_new_chart.data;
}
*/
var myitempts = new Array(mydata[0].length);
if (my_new_chart.itempoints != null)
{
	for (x=0; x <my_new_chart.itempoints.length;x++)
	{
		if (x< myitempts.length)
		{
			myitempts[x]=my_new_chart.itempoints[x];
		}
	}
}

var mylineitems = [];
var mylinedata = [];
var mylinecolors = [];
if (my_new_chart.lineitems != null)
{
    mylineitems = new Array(my_new_chart.lineitems);
    mylinecolors = new Array(my_new_chart.lineitems);
    
    for (x=0; x < my_new_chart.lineitems.length;x++)
    {
	    if(my_new_chart.lineitems[x].name != null) {   mylineitems[x]=my_new_chart.lineitems[x].name; }
	    if(my_new_chart.lineitems[x].color != null) {  mylinecolors[x]=my_new_chart.lineitems[x].color; }
    }
    mylinedata= my_new_chart.linedata;
    if (mylinedata[0] instanceof Array == false)
    {
        mylinedata=[mylinedata];
    }
}

var chart_label="";
var chart_label_position="none";
var chart_label_class="tcc_chartlabel";
var bIsPercent=true;
if (my_new_chart.chart_label != null) 
    { 
        if (my_new_chart.chart_label.name != null) {  chart_label = my_new_chart.chart_label.name;  }  else { chart_label = my_new_chart.chart_label; }
        if (my_new_chart.chart_label.class != null) {  chart_label_class = my_new_chart.chart_label.class;  }  
        if (my_new_chart.chart_label.position != null) {  chart_label_position = my_new_chart.chart_label.position;  }         
        
    };
if (my_new_chart.chart_label_position != null) { chart_label_position = my_new_chart.chart_label_position; };
if (my_new_chart.ispercentage != null) { bIsPercent = my_new_chart.ispercentage; };

var footnotes="";
var footnotes_class="tcc_footnote";
if (my_new_chart.footnotes != null) 
    { 
        if (my_new_chart.footnotes.name != null) {  footnotes = my_new_chart.footnotes.name;  }  else { footnotes = my_new_chart.footnotes; }
        if (my_new_chart.footnotes.class != null) {  footnotes_class = my_new_chart.footnotes.class;  }     
    };
if (my_new_chart.chart_footnote != null) 
    { 
        if (my_new_chart.chart_footnote.name != null) {  footnotes = my_new_chart.chart_footnote.name;  }  else { footnotes = my_new_chart.chart_footnote; }
        if (my_new_chart.chart_footnote.class != null) {  footnotes_class = my_new_chart.chart_footnote.class;  }     
    };

var barmargin = 1;
var bShowLegend=true;
var bShowScales=true;
var bShowBackground=false;
var valueformat="%d";
var bBar_Borders=true;
var bColumn_Borders=true;
var bShade_Borders=false;
var bHideTickMarks=false;
var bLinearGradient=false;

var static_max_value_on_scale=-1;
var static_number_of_ticks=-1;

var bBorderLeft=false;
var bBorderRight=false;
var bBorderTop=false;
var bBorderBottom=false;
var item_class="";
var value_text_class="";
var bHorizontalLines=true;
var bVerticalLines=false;
var bShowValues=true;
var legend_position="right";
if (chart_type.toLowerCase()=="stackedbarrel") { bShowValues=false; }


// IF THERE ARE NO ITEMS DEFAULT TO NOT SHOW LEGEND
if (chart_type.toLowerCase() != "pie") {
if (my_new_chart.items == null) { bShowLegend=false; }
	else {  if (my_new_chart.items==[]) { bShowLegend=false; }
		else { if (my_new_chart.items[0]=="") {bShowLegend=false; }  }
	    }
}

if (my_new_chart.additionalsettings != null) {

    if (my_new_chart.additionalsettings.horizontal_lines != null) { bHorizontalLines = my_new_chart.additionalsettings.horizontal_lines; }
    if (my_new_chart.additionalsettings.vertical_lines != null) { bVerticalLines = my_new_chart.additionalsettings.vertical_lines; }
    if (my_new_chart.additionalsettings.showvalues != null) { bShowValues = my_new_chart.additionalsettings.showvalues; }
    if (my_new_chart.additionalsettings.item_class != null) { item_class = my_new_chart.additionalsettings.item_class; }
    if (my_new_chart.additionalsettings.value_text_class != null) { value_text_class = my_new_chart.additionalsettings.value_text_class; }
    if (my_new_chart.additionalsettings.barmargin != null) { barmargin = my_new_chart.additionalsettings.barmargin; }
    if (my_new_chart.additionalsettings.showlegend != null) { bShowLegend = my_new_chart.additionalsettings.showlegend; }
    if (my_new_chart.additionalsettings.displaylegend != null) { bShowLegend = my_new_chart.additionalsettings.displaylegend; }
    if (my_new_chart.additionalsettings.showscales != null) { bShowScales = my_new_chart.additionalsettings.showscales; }
    if (my_new_chart.additionalsettings.showbackground != null) { bShowBackground = my_new_chart.additionalsettings.showbackground; }
    if (my_new_chart.additionalsettings.columnborders != null) { bColumn_Borders = my_new_chart.additionalsettings.columnborders;  bBar_Borders = my_new_chart.additionalsettings.columnborders;}
    if (my_new_chart.additionalsettings.barborders != null) { bColumn_Borders = my_new_chart.additionalsettings.barborders;  bBar_Borders = my_new_chart.additionalsettings.barborders;}
    if (my_new_chart.additionalsettings.shadeborders != null) { bShade_Borders = my_new_chart.additionalsettings.shadeborders; }
    if (my_new_chart.additionalsettings.linearGradient != null) { bLinearGradient = my_new_chart.additionalsettings.linearGradient; }
    if (my_new_chart.additionalsettings.hidetickmarks != null) { bHideTickMarks = my_new_chart.additionalsettings.hidetickmarks; }
    if (my_new_chart.additionalsettings.showtickmarks != null) { if (my_new_chart.additionalsettings.showtickmarks==false) { bHideTickMarks=true; } }

    if (my_new_chart.additionalsettings.max_value_on_scale != null) { static_max_value_on_scale = my_new_chart.additionalsettings.max_value_on_scale; }
    if (my_new_chart.additionalsettings.number_of_ticks != null) { static_number_of_ticks = my_new_chart.additionalsettings.number_of_ticks; }

    if (my_new_chart.additionalsettings.verticaltext != null)  { if (my_new_chart.additionalsettings.verticaltext==true) { vertical_text=true; }  if (my_new_chart.additionalsettings.verticaltext==false) { vertical_text=false; }}  
    if (my_new_chart.additionalsettings.valueformat != null) 
	{ valueformat= my_new_chart.additionalsettings.valueformat; }
//	else {   if (bIsPercent == true) { valueformat="%d%"; }
//		}
    if (my_new_chart.additionalsettings.borderleft != null) { bBorderLeft = my_new_chart.additionalsettings.borderleft; }
    if (my_new_chart.additionalsettings.borderright != null) { bBorderRight = my_new_chart.additionalsettings.borderright; }
    if (my_new_chart.additionalsettings.bordertop != null) { bBorderTop = my_new_chart.additionalsettings.bordertop; }
    if (my_new_chart.additionalsettings.borderbottom != null) { bBorderBottom = my_new_chart.additionalsettings.borderbottom; }
   

}
if (bLinearGradient==true) { bShade_Borders=false;  };

if (chart_type.toLowerCase()=="line")
    {
	    build_line_chart(div_id,svgwidth,svgheight,myitems,myitempts,mydata,myitemcolors,
	    bShowLegend,bShowScales,chart_label,chart_label_class,chart_label_position,
	    footnotes,footnotes_class,bIsPercent,bShowBackground,valueformat,
	    static_max_value_on_scale,static_number_of_ticks,item_class,value_text_class,legend_position)
    }
if (chart_type.toLowerCase()=="bar")
    {
    build_bar_chart(div_id, svgwidth, svgheight, myitems, mylineitems, myitempts, mydata, mylinedata, myitemcolors, mylinecolors,
    bShowLegend, bShowScales, chart_label,chart_label_class, chart_label_position,
    footnotes,footnotes_class,bIsPercent, barmargin, bShowBackground, valueformat,
    bBar_Borders, bShade_Borders, bLinearGradient, bHideTickMarks,
	bBorderLeft,bBorderRight,bBorderTop,bBorderBottom,item_class,value_text_class,legend_position)
    }
if (chart_type.toLowerCase() == "column") {
    build_column_chart(div_id, svgwidth, svgheight, myitems, mylineitems, myitempts, mydata, mylinedata, myitemcolors, mylinecolors,
   	bShowLegend, bShowScales, false, chart_label,chart_label_class, chart_label_position,
	footnotes,footnotes_class, bIsPercent, barmargin, bShowBackground, valueformat,
	bColumn_Borders, bShade_Borders, bLinearGradient,bHideTickMarks,
    static_max_value_on_scale,static_number_of_ticks,bBorderLeft,bBorderRight,bBorderTop,bBorderBottom,item_class,value_text_class,legend_position)
}
if (chart_type.toLowerCase() == "stacked") {
    build_stacked_chart(div_id, svgwidth, svgheight, myitems, mylineitems, myitempts, mydata, mylinedata, myitemcolors, mylinecolors,
     bShowLegend, bShowScales, false, chart_label,chart_label_class, chart_label_position,footnotes,footnotes_class,
      bIsPercent, barmargin, bShowBackground, valueformat, bColumn_Borders, bShade_Borders, bHideTickMarks,item_class,value_text_class)
}
if (chart_type.toLowerCase() == "pie") {
    build_pie_chart(div_id, svgwidth, svgheight, myitems, myitempts, mydata, myitemcolors,
    bShowLegend, bShowScales, chart_label,chart_label_class, chart_label_position,
    footnotes,footnotes_class, bIsPercent,bShowBackground,valueformat,item_class,value_text_class,legend_position)
}
if (chart_type.toLowerCase() == "radar") {
    build_radar_chart(div_id, svgwidth, svgheight, myitems, myitempts, mydata, myitemcolors,
    bShowLegend, bShowScales, chart_label,chart_label_class, chart_label_position,
    footnotes,footnotes_class, bIsPercent,bShowBackground,valueformat,item_class,value_text_class,legend_position)
}
if (chart_type.toLowerCase()=="wave")
    {
	    build_wave_chart(div_id,svgwidth,svgheight,myitems,myitempts,mydata,myitemcolors,
	    bShowLegend,bShowScales,chart_label,chart_label_class,chart_label_position,
	    footnotes,footnotes_class,bIsPercent,bShowBackground,valueformat,
	    static_max_value_on_scale,static_number_of_ticks,item_class,value_text_class,legend_position)
    }

if (chart_type.toLowerCase()=="stackedwave")
    {
	    build_stacked_wave_chart(div_id,svgwidth,svgheight,myitems,myitempts,mydata,mydata_text,myitemcolors,
	    bShowLegend,bShowScales,chart_label,chart_label_class,chart_label_position,
	    footnotes,footnotes_class,bIsPercent,bShowBackground,valueformat,
	    static_max_value_on_scale,static_number_of_ticks,item_class,value_text_class,legend_position)
    }
if (chart_type.toLowerCase()=="stackedbarrel")
    {
	    build_stacked_barrel_chart(div_id,svgwidth,svgheight,myitems,myitempts,mydata,mydata_text,myitemcolors,
	    bShowLegend,bShowScales,bHorizontalLines,bVerticalLines,bShowValues,
	    chart_label,chart_label_class,chart_label_position,
	    footnotes,footnotes_class,bIsPercent,bShowBackground,valueformat,
	    static_max_value_on_scale,static_number_of_ticks,item_class,value_text_class,legend_position)
    }

}



// function build_column_chart(div_id,svgwidth,svgheight,items,lineitems,myitempts,mydata_multiarray,mylinedata,colorset,linecolors,bShowLegend,bShowScales,bSingleDimensionArray,chart_label,chart_label_position,bIsPercent)

function get_background(colour,x,y,width,height)
{
        var bkgrd =document.createElementNS("http://www.w3.org/2000/svg", "rect");
            bkgrd.setAttribute("x", x);
            bkgrd.setAttribute("y", y);
            bkgrd.setAttribute("width", width);
            bkgrd.setAttribute("height", height);
            bkgrd.setAttribute("fill", colour);
	return bkgrd;
}
function write_line_of_text(text,x,y,fill,class_name)
{
   var cl1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
              cl1.setAttribute("y",y);
              cl1.setAttribute("x",x);
              cl1.setAttribute("fill", fill);
              cl1.setAttribute("class",class_name);
              cl1.textContent=text;
    return cl1
}
function write_line_of_text_id(text,x,y,fill,class_name,style,text_id)
{
   var cl1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
              cl1.setAttribute("y",y);
              cl1.setAttribute("x",x);
              cl1.setAttribute("fill", fill);
              if (class_name != "") {cl1.setAttribute("class",class_name);}
              if (style != "") {cl1.setAttribute("style",style);}
              if (text_id != "") {cl1.setAttribute("id",text_id)}              
              cl1.textContent=text;
    return cl1
}
function write_line(x1,x2,y1,y2,stroke,strokewidth,strokelinecap,lineid)
{
   var l1 =  document.createElementNS("http://www.w3.org/2000/svg", "line");
                l1.setAttribute("x1", x1);
                l1.setAttribute("x2", x2);
                l1.setAttribute("y1", y1);
                l1.setAttribute("y2", y2);
                l1.setAttribute("stroke", stroke); 
                if (strokewidth != "")
                {
                     l1.setAttribute("stroke-width",strokewidth);
                }
                else
                {
                    l1.setAttribute("stroke-width","1");
                }
                if (strokelinecap != "")
                {
                    l1.setAttribute("stroke-linecap", strokelinecap);
                }
                if (lineid != "")
                {
                    l1.setAttribute("id", lineid);
                }
                
    return l1
}

///****************************************************************************************************************///
//----------------------------------------- BUILD A LINE CHART -----------------------------------------------------//
function build_line_chart(div_id,svgwidth,svgheight,myitems,myitempts,mylinedata,mylinecolors,bShowLegend,bShowScales,
    chart_label,chart_label_class,chart_label_position,footnotes,footnotes_class,bIsPercent,bShowBackground,
    valueformat,static_max_value_on_scale,static_number_of_ticks,item_class,value_text_class,legend_position)
{
    var NS="http://www.w3.org/2000/svg";
    var svg=document.createElementNS(NS,"svg");
    svg.setAttribute("width",svgwidth);
    svg.setAttribute("height",svgheight);
    svg.setAttribute("fill","transparent");
    svg.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"svg");

    bHorizontalLines=true;//bHorizontalLines=bShowScales;

//    var chartwidth=svgwidth-25;
    var chartwidth=svgwidth*1.07;
//    var chartheight=svgheight-100;
    var chartheight=svgheight-50;//(svgheight/5);
	if (chartwidth < 500) { legend_position="top"; }

    legendwidth=150;
   
    if (bShowLegend)
     { 
        for (i=0; i<myitems.length; i++)
        {
            if (myitems[i].length > 30) { legendwidth=175; }
            if (myitems[i].length > 35) { legendwidth=210; }
            if (myitems[i].length > 40) { legendwidth=250; }
        }
        if (legendwidth > (chartwidth/2)) { legendwidth=chartwidth/3; }
        chartwidth=chartwidth-legendwidth;
     }

    var max_value_on_scale=100;
    percentage_suffix="%";

    if (bIsPercent==false)
    {
        max_value_on_scale=0;
	    percentage_suffix="";
	    max_value_on_scale=calculate_mylinedata(max_value_on_scale,mylinedata);
    }  else
    {
        if (valueformat=="") { valueformat="%d"; percentage_suffix="%"; }
    } 
    tickcounter=5;
    if (static_max_value_on_scale > 0)  { max_value_on_scale=static_max_value_on_scale;  } 
    if (static_number_of_ticks > 0)   { tickcounter=static_number_of_ticks;  } 
    
//    heightmultiplier=1.5;
    heightmultiplier=chartheight/200;
    linewidth=(chartwidth)/mylinedata[0].length;
    
    //--------------- CHART LABELS -------------------------------------//
        // LABEL ON TOP
    if (chart_label_position=="top")
    {
            chart_label_text_array=chart_label.split("[CR]");
            for (i=0;i<chart_label_text_array.length; i++)
            {
                svg.appendChild(write_line_of_text(chart_label_text_array[i],50,15+(15*i),"#333",chart_label_class));
            }
    }
    // LABEL ON BOTTOM
    if (chart_label_position=="bottom")
    {
            chart_label_text_array=chart_label.split("[CR]");
            for (i=0;i<chart_label_text_array.length; i++)
            {    
                svg.appendChild(write_line_of_text(chart_label_text_array[i],50,chartheight+15+(15*i),"#333",chart_label_class));
            }
    }
    // FOOTNOTES
    if (footnotes!="")
    {
        afootnotes=footnotes.split("\n");       
        vpos=0;
        for (f=0; f < afootnotes.length; f++)
        {
            svg.appendChild(write_line_of_text(afootnotes[f],50,chartheight+30+vpos,"#333",footnotes_class));
            vpos+=9;
        }
    }
    // BACKGROUND
    if (bShowBackground == true) {	svg.appendChild(get_background(tcc_background_color,50,50,chartwidth-linewidth,100*heightmultiplier));
    }
    //--------------- HORIZONTAL LINES-------------------------------------//
    if (bHorizontalLines==true)
    {
        //tickcounter=5; // THE NUMBER OF TICKS
        tickcount=100/tickcounter; // 100 IS THE MAX NUMBER - 100%
        tickcountvalue = max_value_on_scale / tickcounter;

        for (x=0; x < tickcounter; x++) 
        {
                 svg.appendChild(write_line(45,50+chartwidth-linewidth,50+((tickcount*heightmultiplier)*x),50+((tickcount*heightmultiplier)*x),tcc_line_color,".1","round",""));
               
                if (bShowScales==true)
                {
                    svg.appendChild(write_line_of_text(tickcountvalue * (tickcounter - x) + percentage_suffix,25,50+((tickcount*heightmultiplier)*x)+5,"#333","tcc_tick_values"));
                }
        }
     /*   var l1=document.createElementNS("http://www.w3.org/2000/svg", "line");
                l1.setAttribute("x1", 45);
                l1.setAttribute("x2", 50+chartwidth-linewidth);
                l1.setAttribute("y1", 50+((tickcount*heightmultiplier)*tickcounter));
                l1.setAttribute("y2", 50+((tickcount*heightmultiplier)*tickcounter));
                l1.setAttribute("stroke", tcc_line_color);
                l1.setAttribute("stroke-width", ".1");
                svg.appendChild(l1);  */
                svg.appendChild(write_line(45,50+chartwidth-linewidth,50+((tickcount*heightmultiplier)*tickcounter),50+((tickcount*heightmultiplier)*tickcounter),tcc_line_color,".1","round",""));

    }
    
   
    //--------------- ADD THE DATA LINES-------------------------------------//
    for (x=0; x < mylinedata[0].length; x++)
    {
        for (y=0; y< mylinedata.length; y++)
        {
            if (x < mylinedata[0].length-1)
            {
                var mld2 =document.createElementNS("http://www.w3.org/2000/svg", "line");
                mld2.setAttribute("x1", 50+(linewidth*x));
                mld2.setAttribute("x2", 50+(linewidth*(x+1)));
                mld2.setAttribute("y1", 50+(100*heightmultiplier- (100/max_value_on_scale)*mylinedata[y][x]*heightmultiplier));
                mld2.setAttribute("y2", 50+(100*heightmultiplier- (100/max_value_on_scale)*mylinedata[y][x+1]*heightmultiplier));  
                mld2.setAttribute("stroke", mylinecolors[y]);  
                mld2.setAttribute("stroke-width", "1");
                if (item_class != "") {  mld2.setAttribute("class",item_class);     }       
		        mld2.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"line"+x+"-"+y);
                svg.appendChild(mld2);  
            }               
            // ADD THE CIRCLE
            if (tick_shape=="circle")
            {
                var cd2=document.createElementNS("http://www.w3.org/2000/svg", "circle");
                cd2.setAttribute("cx",50+(linewidth*x));
                cd2.setAttribute("cy",50+(100*heightmultiplier- (100/max_value_on_scale)*mylinedata[y][x]*heightmultiplier));
                cd2.setAttribute("r",2);
                cd2.setAttribute("fill",mylinecolors[y]);
                if (item_class != "") {  cd2.setAttribute("class",item_class);     }
		        cd2.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"circle"+x+"-"+y);
                svg.appendChild(cd2);  
            }
            // ADD TEXT  valueformat
            if (valueformat != "")
            {
            var vtext=document.createElementNS("http://www.w3.org/2000/svg", "text");
                vtext.setAttribute("x",50+(linewidth*x));
                vtext.setAttribute("y",50+(100*heightmultiplier- (100/max_value_on_scale)*mylinedata[y][x]*heightmultiplier)-10);
                vtext.setAttribute("fill",mylinecolors[y]);
                vtext.setAttribute("class","tcc_values");
                vtext.textContent=valueformat.replace("%d",mylinedata[y][x]).replace("[[value]]",mylinedata[y][x]).replace("[value]",mylinedata[y][x])+percentage_suffix;
		        vtext.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"label"+x+"-"+y);
                svg.appendChild(vtext);  
            }
            // ADDING THE HIDDEN LINE
 /*           var hll1 =document.createElementNS("http://www.w3.org/2000/svg", "line");
                hll1.setAttribute("x1", 50+(linewidth*x));
                hll1.setAttribute("x2", 50+(linewidth*(x+1)));
                hll1.setAttribute("y1", 50+(100*heightmultiplier- (100/max_value_on_scale)*mylinedata[y][x]*heightmultiplier));
				if (mylinedata[y].length > x){
                hll1.setAttribute("y2", 50+(100*heightmultiplier- (100/max_value_on_scale)*mylinedata[y][x+1]*heightmultiplier)); 
				} else {
				hll1.setAttribute("y2", 50+(100*heightmultiplier- (100/max_value_on_scale)*mylinedata[y][x]*heightmultiplier)); 
					
				}
                hll1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"linechart-linehidden"+x);
                hll1.setAttribute("stroke", "transparent");
                hll1.setAttribute("onclick","tcc_item_click('line','"+div_id+"-"+tcc_div_chart_counter+"svg','"+div_id+"-"+tcc_div_chart_counter+"linechart-legendtext"+y+"','"+div_id+"-"+tcc_div_chart_counter+"line','"+mylinedata[0].length+"','"+y+"');");
                svg.appendChild(hll1);    
   */     }

        var t2 =document.createElementNS("http://www.w3.org/2000/svg", "line");
            t2.setAttribute("x1", 50+(linewidth*x));
            t2.setAttribute("x2", 50+(linewidth*x));
            t2.setAttribute("y1", 50+((20*heightmultiplier)*5));
            t2.setAttribute("y2", 50+((20*heightmultiplier)*5)+5);  
            t2.setAttribute("stroke", "#222");  
            svg.appendChild(t2);  
            if (x < myitempts.length)
            {

        if (vertical_text == true)
        {
                 var ipt1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
   		            xpos=50+(linewidth*x);
                    ypos=50+((20*heightmultiplier)*5)+10;
                    ipt1.setAttribute("transform","translate("+xpos+","+ypos+")rotate(90)");
                    ipt1.textContent=myitempts[x];
                    ipt1.setAttribute("fill", "#333");
                    ipt1.setAttribute("class","tcc_values");

                    ipt1.textContent=myitempts[x];
                    svg.appendChild(ipt1);       
	} else
	{


       var ipt1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
               // ipt1.setAttribute("x", 5);
               // ipt1.setAttribute("y", 50+(barheight*(x)*items.length)+5);
                ipt1.setAttribute("x", 50+(linewidth*x));
                ipt1.setAttribute("y", 50+((20*heightmultiplier)*5)+15); 
                ipt1.setAttribute("fill", "#333");
                ipt1.setAttribute("class","tcc_values");
               
		next_label=myitempts[x]
		if ((next_label.length*4)<linewidth)
		{
                	var iptxt1=document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                	//iptxt1.setAttribute("x", 5);
                	//iptxt1.setAttribute("y", 50+(barheight*(x)*items.length)+(barheight*items.length)/3);
                	iptxt1.setAttribute("x", 50+(linewidth*x));
                	iptxt1.setAttribute("y", 50+((20*heightmultiplier)*5)+15); 
			iptxt1.setAttribute("fill", "#333");
                	iptxt1.setAttribute("class","tcc_values_1");
                	iptxt1.textContent=myitempts[x];
                	ipt1.appendChild(iptxt1);
                } else
		{
			next_label_array=next_label.split(" ");
			next_label="";
			label_rowctr=0;
			for(actr=0;actr<next_label_array.length; actr++)
			{
				if (next_label=="")
				{
					next_label=next_label_array[actr];
				} else
				{
					next_label=next_label+" "+next_label_array[actr];
				}	
				if ((actr+1)==next_label_array.length)
				{
              				var aiptxt1=document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                				//aiptxt1.setAttribute("x", 5);
                				//aiptxt1.setAttribute("y", label_rowctr+50+(barheight*(x)*items.length)+(barheight*items.length)/3);
                				aiptxt1.setAttribute("x", 50+(linewidth*x));
                				aiptxt1.setAttribute("y", label_rowctr+50+((20*heightmultiplier)*5)+15); 
						aiptxt1.setAttribute("fill", "#333");
                				aiptxt1.setAttribute("class","tcc_values");
                				aiptxt1.textContent=(next_label);
                				ipt1.appendChild(aiptxt1);
				} else
				{
					if (((next_label+" "+next_label_array[actr+1]).length*4)>linewidth)
					{
              				var aiptxt1=document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                				//aiptxt1.setAttribute("x", 5);
                				//aiptxt1.setAttribute("y", label_rowctr+50+(barheight*(x)*items.length)+(barheight*items.length)/3);
                				aiptxt1.setAttribute("x", 50+(linewidth*x));
                				aiptxt1.setAttribute("y", label_rowctr+50+((20*heightmultiplier)*5)+15); 
						aiptxt1.setAttribute("fill", "#333");
                				aiptxt1.setAttribute("class","tcc_values");
                				aiptxt1.textContent=(next_label);
                				ipt1.appendChild(aiptxt1);
					next_label="";
					label_rowctr=label_rowctr+8;
					}
				}
			};
		}
                svg.appendChild(ipt1);   
	}	


            }
        }
    
    //--------------- ADD THE LEGEND -------------------------------------//
    if (bShowLegend)
    {
		
if (legend_position	== "top") {
			for (x=0;x < myitems.length;x++)
				{
					var lr1 =document.createElementNS("http://www.w3.org/2000/svg", "rect");
						lr1.setAttribute("x",50+( (chartwidth/myitems.length*.85)*x ));
						lr1.setAttribute("width", 7);
						lr1.setAttribute("y", 25);
						lr1.setAttribute("height", 7);
						lr1.setAttribute("fill", mylinecolors[x]);
						lr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"columnchart-legendbox"+x);
						svg.appendChild(lr1);		  
					var lt1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
						lt1.setAttribute("x",50+((chartwidth/myitems.length*.85)* x )+15);
						lt1.setAttribute("y", 35);
						lt1.setAttribute("fill", "#333");
						lt1.setAttribute("class","legendtext");
						lt1.setAttribute("name",div_id+"-"+tcc_div_chart_counter+"columnchartzz"+x);
						lt1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"columnchart-legendtext"+x);					   
						lt1.textContent=myitems[x];
						svg.appendChild(lt1); 
				}
	  } else {		
        for (x=0;x < myitems.length;x++)
        {
            var lr1 =document.createElementNS("http://www.w3.org/2000/svg", "rect");
                //lr1.setAttribute("x", 100+chartwidth-linewidth+10);   // CHANGED 2013-11-30
                lr1.setAttribute("x", 50+chartwidth-(linewidth/2)+10);
                lr1.setAttribute("width", 10);
                lr1.setAttribute("y", 50+(x*15));
                lr1.setAttribute("height", 10);
                if (item_class != "") {  lr1.setAttribute("class",item_class);     }
                lr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"linechart-legendbox"+x);
                lr1.setAttribute("name",div_id+"-"+tcc_div_chart_counter+"linechartzz"+x);
                lr1.setAttribute("fill", mylinecolors[x]);
                svg.appendChild(lr1);
            var lt1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
                //lt1.setAttribute("x", 100+chartwidth-linewidth+25);
                lt1.setAttribute("x", 50+chartwidth-(linewidth/2)+25);
                lt1.setAttribute("y", 50+(x*15)+10);
                lt1.setAttribute("fill", "#333");
                lt1.setAttribute("class","legendtext");
                lt1.setAttribute("name",div_id+"-"+tcc_div_chart_counter+"linechartzz"+x);
                lt1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"linechart-legendtext"+x);
               
                lt1.textContent=myitems[x];
                svg.appendChild(lt1);  

            var hlr1 =document.createElementNS("http://www.w3.org/2000/svg", "rect");
                hlr1.setAttribute("x", 50+chartwidth-(linewidth/2)+10);
                hlr1.setAttribute("width", 200);
                hlr1.setAttribute("y", 50+(x*15));
                hlr1.setAttribute("height", 10);
                hlr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"linechart-legendhidden"+x);
                hlr1.setAttribute("fill", "transparent");
                hlr1.setAttribute("onclick","tcc_item_click('line','"+div_id+"-"+tcc_div_chart_counter+"svg','"+div_id+"-"+tcc_div_chart_counter+"linechart-legendtext"+x+"','"+div_id+"-"+tcc_div_chart_counter+"line','"+mylinedata[0].length+"','"+x+"');");
                svg.appendChild(hlr1);              
         }
		 
	  } 
    }
    document.getElementById(div_id).appendChild(svg);
    tcc_div_chart_counter+=1;
}  //------------------------------ END FUNCTION BUILD LINE CHART---------------------------------------------------//




//----------------------------------------- BUILD A BAR CHART -----------------------------------------------------//
function build_bar_chart(div_id, svgwidth, svgheight, items, lineitems, myitempts, mydata, mylinedata, colorset, linecolors, bShowLegend, bShowScales, 
chart_label,chart_label_class, chart_label_position,footnotes,footnotes_class, bIsPercent, barmargin, bShowBackground, valueformat,
bBarBorders, bShadeBorders,bLinearGradient, bHideTickMarks,bBorderLeft,bBorderRight,bBorderTop,bBorderBottom,item_class,value_text_class,legend_position)
{

    var NS="http://www.w3.org/2000/svg";     
    var svg=document.createElementNS(NS,"svg");
	
    var margin_left=80;
    bVerticalLines=bShowScales;
        
    var chartwidth=svgwidth*.80;
    //var chartheight=svgheight-100;
	var chartheight=svgheight*.65;

    var max_value_on_scale=100;
    percentage_suffix="%";

    if (bIsPercent==false)
    {
	    max_value_on_scale=0;
	    percentage_suffix="";
	    max_value_on_scale=calculate_mylinedata(max_value_on_scale,mydata);
    }  else
    {
        if (valueformat=="") { valueformat="%d"; percentage_suffix="%"; }
    } 
//    if (bShowLegend) { chartwidth=chartwidth-200; }
    legendwidth=150;
    
    if (bShowLegend)
     { 
        for (i=0; i<items.length; i++)
        {
            if (items[i].length > 30) { legendwidth=175; }
            if (items[i].length > 35) { legendwidth=210; }
            if (items[i].length > 40) { legendwidth=250; }
        }
        if (legendwidth > (chartwidth/2)) { legendwidth=chartwidth/3; }
        chartwidth=chartwidth-legendwidth;
     }

    svg.setAttribute("width",svgwidth);
    svg.setAttribute("height",svgheight);
    svg.setAttribute("fill","transparent");
    svg.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"svg");

    barwidth=(chartwidth-80)/(mydata.length*mydata[0].length);
    barheight=chartheight/(mydata.length*mydata[0].length);
    
    heightmultiplier=2;
    widthmultiplier=chartwidth/145;
    
    column_shadectr=0;
    if (bShadeBorders == true)
    {
         if (barheight <= 25) { column_shadectr=2; }
         if (barheight > 25) { column_shadectr=3; }
         if (barheight > 35) { column_shadectr=4; }
         if (barheight > 45) { column_shadectr=5; }
         if (barheight > 55) { column_shadectr=6; }
         if (barheight > 65) { column_shadectr=7; }  
    }

    //--------------- CHART LABELS -------------------------------------//
    // LABEL ON TOP
    if (chart_label_position=="top")
    {
			if (chart_label.length*6>chartwidth) {
				chartarray=chart_label.split(" ");
				let chart_new_label="";
				let chart_new_label_row="";
				for(i=0;i < chartarray.length;i++){
					if ((chart_new_label_row.length+chartarray[i].length)*6 > chartwidth )
					{
						if (chart_new_label==""){
							chart_new_label= chart_new_label_row;
						} else {
							chart_new_label= chart_new_label+"[CR]"+ chart_new_label_row;
						}
						chart_new_label_row=chartarray[i];
					}
					else {
						chart_new_label_row=chart_new_label_row+" "+chartarray[i];
					}
				}
				chart_label=chart_new_label+"[CR]"+chart_new_label_row;
            
			}
			//chart_label=chart_label.length*7+" "+chartwidth+" "+chart_label;
			chart_label_text_array=chart_label.split("[CR]");
			
            for (i=0;i<chart_label_text_array.length; i++)
            {
                svg.appendChild(write_line_of_text(chart_label_text_array[i],0,15+(15*i),"#333",chart_label_class));
            }
    }
    // LABEL ON BOTTOM
    if (chart_label_position=="bottom")
    {
            chart_label_text_array=chart_label.split("[CR]");
            for (i=0;i<chart_label_text_array.length; i++)
            {    
                svg.appendChild(write_line_of_text(chart_label_text_array[i],100,50+chartheight+40+(15*i),"#333",chart_label_class));
            }
    }    
    
    // FOOTNOTES
    if (footnotes!="")
    {
        afootnotes=footnotes.replace("[CR]","\n").split("\n");       
        vpos=0;
        for (f=0; f < afootnotes.length; f++)
        {
            svg.appendChild(write_line_of_text(afootnotes[f],50,50+chartheight+30+vpos,"#333",footnotes_class));           
            vpos+=9;
        }
    }
    // BACKGROUND
    if (bShowBackground == true)
    {
	svg.appendChild(get_background(tcc_background_color,margin_left,50,widthmultiplier*100,chartheight));
     }    
	 
	
	 
    //---------------  VERTICAL LINES -------------------------------------//
    if (bVerticalLines)
    {
        tickcounter=5;//2;//10;//
        tickcount=100/tickcounter; // 100 IS THE MAX NUMBER - 100%
        tickcountvalue = max_value_on_scale / tickcounter;
    
        for (x=1; x <= tickcounter; x++)  //   for (x=0; x < 10; x++)   -- for every 10 points
        {
            if (bHideTickMarks != true)
            {
                var l1=document.createElementNS("http://www.w3.org/2000/svg", "line");
                    l1.setAttribute("x1", margin_left+((tickcount*widthmultiplier)*x)); 
                    l1.setAttribute("x2", margin_left+((tickcount*widthmultiplier)*x)); 
                    l1.setAttribute("y1", 50);
                    l1.setAttribute("y2", 50+chartheight);
                    l1.setAttribute("stroke", tcc_line_color);  // style="stroke:red;stroke-width:2"
                    l1.setAttribute("stroke-width", ".2");
                    svg.appendChild(l1);  
            }
            var lt1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
                lt1.setAttribute("y", 50+chartheight+20);
                lt1.setAttribute("x", margin_left+((tickcount*widthmultiplier)*x)-15);
                lt1.setAttribute("fill", "#333");
                lt1.setAttribute("class","tcc_values");
                lt1.textContent = tickcountvalue * (x) + percentage_suffix;
                svg.appendChild(lt1);
        }
    }
     //ADDING THE LEFT BORDERS     
   if (bBorderLeft==true) {
    svg.appendChild(write_line(margin_left,margin_left,50,50+chartheight,"#000","1","round","barchart-"+div_id+"-left-border-"+tcc_div_chart_counter)); };
    //svg.appendChild(write_line(100,100,50,100+((tickcount*heightmultiplier)*tickcounter),"#000","1","round","barchart-"+div_id+"-left-border-"+tcc_div_chart_counter)); };
   //ADDING THE RIGHT BORDERS     
   if (bBorderRight==true) {
    svg.appendChild(write_line(chartwidth-30,chartwidth-30,50,50+((tickcount*heightmultiplier)*tickcounter),"#000","1","round","barchart-"+div_id+"-right-border-"+tcc_div_chart_counter)); };
   //ADDING THE TOP BORDERS     
   if (bBorderTop==true) {
    svg.appendChild(write_line(margin_left,chartwidth-80,50,50,"#000","1","round","barchart-"+div_id+"-top-border-"+tcc_div_chart_counter));};
   //ADDING THE BOTTOM BORDERS     
   if (bBorderBottom==true) {
    svg.appendChild(write_line(margin_left,chartwidth,50+chartheight,50+chartheight,"#000","1","round","barchart-"+div_id+"-bottom-border-"+tcc_div_chart_counter));};
    //svg.appendChild(write_line(100,chartwidth,50+((tickcount*heightmultiplier)*tickcounter),50+((tickcount*heightmultiplier)*tickcounter),"#000","1","round","barchart-"+div_id+"-bottom-border-"+tcc_div_chart_counter));};

    for (x = 0; x < mydata[0].length; x++)
    {
        for (y=0;y < items.length; y++)
        {
            nextpos=(x*items.length)+y;

        
        if (bLinearGradient==true)
        {
            var mydefs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
                    mydefs.setAttribute("id",div_id+"mydefs"+x+"_"+y);
	        var grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
		            grad.setAttribute("id",div_id+"-lg-"+tcc_div_chart_counter+"bar"+x+"-"+y);            
		            grad.setAttribute("x1","0%");
		            grad.setAttribute("x2","100%");
		            grad.setAttribute("y1","0%");
		            grad.setAttribute("y2","0%");
		            mydefs.appendChild(grad);

            var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                    stop1.setAttribute("id", div_id+"myStop1"+x+"-"+y);
                    stop1.setAttribute("offset", "5%");
                    stop1.setAttribute("stop-color", "#eeeeee");
                    grad.appendChild(stop1);

          var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                    stop2.setAttribute("id", div_id+"myStop2"+x+"-"+y);
                    stop2.setAttribute("offset", "90%");
                    stop2.setAttribute("stop-color", colorset[y]);
                    grad.appendChild(stop2);          
            svg.appendChild(mydefs);           

         }
         var r1 =  document.createElementNS("http://www.w3.org/2000/svg", "rect");
            r1.setAttribute("x", margin_left);
            r1.setAttribute("width", mydata[y][x] * widthmultiplier * (100 / max_value_on_scale));
            r1.setAttribute("y", 50+(barheight*nextpos));
            r1.setAttribute("height",barheight-barmargin);
            r1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"bar"+x+"-"+y);
            if (bLinearGradient==true) {
                r1.setAttribute("fill", "url(#"+div_id+"-lg-"+tcc_div_chart_counter+"bar"+x+"-"+y+")");
            } else
            {
                r1.setAttribute("fill", colorset[y]);
            }

            if (item_class != "") {  r1.setAttribute("class",item_class);     }            
            //r1.setAttribute("fill", colorset[y]);
            //r1.setAttribute("fill", "url(#"+div_id+"-lg-"+tcc_div_chart_counter+"bar"+x+"-"+y+")");
            //r1.setAttribute("fill","url(mydefs"+x+"_"+y+")");
            svg.appendChild(r1);         
         
         

           var hlr1 =document.createElementNS("http://www.w3.org/2000/svg", "rect");
                hlr1.setAttribute("x", margin_left);
                hlr1.setAttribute("width", mydata[y][x] * widthmultiplier * (100 / max_value_on_scale)+5);
                hlr1.setAttribute("y", 50+(barheight*nextpos));
                hlr1.setAttribute("height", barheight-barmargin);
                hlr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"barchart-bartranshidden"+x);
                hlr1.setAttribute("fill", "transparent");
              
                if (bBarBorders == true)
                {
                    hlr1.setAttribute("onclick","tcc_item_bar_click('bar','"+div_id+"-"+tcc_div_chart_counter+"svg','"+div_id+"-"+tcc_div_chart_counter+"barchart-legendtext"+y+"','"+div_id+"-"+tcc_div_chart_counter+"bar','"+mydata[0].length+"','"+y+"','"+div_id+"-"+tcc_div_chart_counter+"barborder','"+column_shadectr+"');");
                } else
                {
                    hlr1.setAttribute("onclick","tcc_item_bar_click('bar','"+div_id+"-"+tcc_div_chart_counter+"svg','"+div_id+"-"+tcc_div_chart_counter+"barchart-legendtext"+y+"','"+div_id+"-"+tcc_div_chart_counter+"bar','"+mydata[0].length+"','"+y+"','','"+column_shadectr+"');");
                }   
                         
             svg.appendChild(hlr1);        

            //--------- BAR BORDERS-------------------------------------------// 
            if (bBarBorders == true)
            {
                        var lr1 =  document.createElementNS("http://www.w3.org/2000/svg", "line");
                            lr1.setAttribute("x1", margin_left+mydata[y][x] * widthmultiplier * (100 / max_value_on_scale));
                            lr1.setAttribute("x2", margin_left+mydata[y][x] * widthmultiplier * (100 / max_value_on_scale));
                            lr1.setAttribute("y1", 50+(barheight*nextpos));
                            lr1.setAttribute("y2", 50+(barheight*nextpos)+barheight-barmargin);
                            lr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"barborderright"+x+"-"+y);
                            if (item_class != "") {  lr1.setAttribute("class",item_class);     }
                            lr1.setAttribute("stroke", "#000000");
                            lr1.setAttribute("stroke-width", ".5");
                            svg.appendChild(lr1);    

                        var lr1a =  document.createElementNS("http://www.w3.org/2000/svg", "line");
                            lr1a.setAttribute("x1", margin_left);
                            lr1a.setAttribute("x2", margin_left+mydata[y][x] * widthmultiplier * (100 / max_value_on_scale));
                            lr1a.setAttribute("y1", 50+(barheight*nextpos));
                            lr1a.setAttribute("y2", 50+(barheight*nextpos));
                            lr1a.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"barbordertop"+x+"-"+y);
                            if (item_class != "") {  lr1a.setAttribute("class",item_class);     }
                            lr1a.setAttribute("stroke", "#000000");
                            lr1a.setAttribute("stroke-width", ".5");
                            svg.appendChild(lr1a);      
                        var lr1a =  document.createElementNS("http://www.w3.org/2000/svg", "line");
                            lr1a.setAttribute("x1", margin_left);
                            lr1a.setAttribute("x2", margin_left+mydata[y][x] * widthmultiplier * (100 / max_value_on_scale));
                            lr1a.setAttribute("y1", 50+(barheight*nextpos+barheight-barmargin));
                            lr1a.setAttribute("y2", 50+(barheight*nextpos+barheight-barmargin));
                            lr1a.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"barborderbottom"+x+"-"+y);
                            if (item_class != "") {  lr1a.setAttribute("class",item_class);     }
                            lr1a.setAttribute("stroke", "#000000"); 
                            lr1a.setAttribute("stroke-width", ".5");
                            svg.appendChild(lr1a);      
               }

            //SHADING THE BORDERS
            if (bShadeBorders == true)
            {
                 shadecolor=shade(colorset[y],"l");
                 shadectr=2;
                 if (barheight > 25) { shadectr=3; }
                 if (barheight > 35) { shadectr=4; }
                 if (barheight > 45) { shadectr=5; }

                 while ((shadectr >=0) &&
                  ((margin_left+mydata[y][x] * widthmultiplier * (100 / max_value_on_scale)-shadectr )>
                            (margin_left) ) ) 
                 {                  
                        var lr1 =  document.createElementNS("http://www.w3.org/2000/svg", "line");
                            lr1.setAttribute("x1", margin_left);
                            lr1.setAttribute("x2", margin_left+mydata[y][x] * widthmultiplier * (100 / max_value_on_scale)-shadectr);
                            lr1.setAttribute("y1", 50+(barheight*nextpos)+shadectr);
                            lr1.setAttribute("y2", 50+(barheight*nextpos)+shadectr);
                            lr1.setAttribute("stroke", shadecolor);
                            lr1.setAttribute("stroke-width", "1");
                            if (item_class != "") {  lr1.setAttribute("class",item_class);     }
                            lr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"bartopshade-"+shadectr+"-"+x+"-"+y);
                            svg.appendChild(lr1);   
                        shadecolor=shade(shadecolor,"l");
                        shadecolor=shade(shadecolor,"l");
                        shadectr=shadectr-1;
                 }   

                 shadecolor=shade(colorset[y],"l");
                 shadectr=2;
                 if (barheight > 25) { shadectr=3; }
                 if (barheight > 35) { shadectr=4; }
                 if (barheight > 45) { shadectr=5; }

                 while ((shadectr >=0) &&
                  ((margin_left+mydata[y][x] * widthmultiplier * (100 / max_value_on_scale)-shadectr )>
                            (margin_left) ) ) 
                 {
                  
                        var lr1 =  document.createElementNS("http://www.w3.org/2000/svg", "line");
                            lr1.setAttribute("x1", margin_left);
                            lr1.setAttribute("x2", margin_left+mydata[y][x] * widthmultiplier * (100 / max_value_on_scale)-shadectr);
                            lr1.setAttribute("y1", 50+(barheight*nextpos+barheight-barmargin)-shadectr);
                            lr1.setAttribute("y2", 50+(barheight*nextpos+barheight-barmargin)-shadectr);
                            lr1.setAttribute("stroke", shadecolor);
                            lr1.setAttribute("stroke-width", "1");
                            if (item_class != "") {  lr1.setAttribute("class",item_class);     }
                            lr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"barbottomshade-"+shadectr+"-"+x+"-"+y);
                            svg.appendChild(lr1);   
                        shadecolor=shade(shadecolor,"d");
                        shadectr=shadectr-1;
                 }               
            
                 shadecolor=shade(colorset[y],"l");
                 shadectr=2;
                 if (barheight > 25) { shadectr=3; }
                 if (barheight > 35) { shadectr=4; }
                 if (barheight > 45) { shadectr=5; }

                 while ((shadectr >=0) &&
                  ((margin_left+mydata[y][x] * widthmultiplier * (100 / max_value_on_scale)-shadectr )>
                            (margin_left) ) ) 
                 {
                  
                        var lr1 =  document.createElementNS("http://www.w3.org/2000/svg", "line");
                            lr1.setAttribute("x1", (margin_left+mydata[y][x] * widthmultiplier * (100 / max_value_on_scale))-shadectr);
                            lr1.setAttribute("x2", (margin_left+mydata[y][x] * widthmultiplier * (100 / max_value_on_scale))-shadectr);
                            lr1.setAttribute("y1", 50+(barheight*nextpos)+(shadectr));
                            lr1.setAttribute("y2", 50+(barheight*nextpos)+barheight-barmargin-(shadectr));
                            lr1.setAttribute("stroke", shadecolor);
                            lr1.setAttribute("stroke-width", "1");
                            lr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"barrightshade-"+shadectr+"-"+x+"-"+y);
                            if (item_class != "") {  lr1.setAttribute("class",item_class);     }
                            svg.appendChild(lr1);   
                        shadecolor=shade(shadecolor,"l");
                        shadecolor=shade(shadecolor,"l");
                        shadectr=shadectr-1;
                 }                          
            }

            // ADDING THE TEXT
            var t1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
            t1.setAttribute("x", margin_left + (mydata[y][x] * widthmultiplier * (100 / max_value_on_scale)) + 5);
                t1.setAttribute("y", 50+(barheight*nextpos)+(barheight/2));
                t1.setAttribute("fill", "#333");
                if (barheight < 30)
                {
                    t1.setAttribute("class","tcc_values");
                } else
                {
                     t1.setAttribute("class","tcc_values_1");
                }
              
                t1.textContent = valueformat.replace("%d", mydata[y][x]).replace("[[value]]", mydata[y][x]).replace("[value]", mydata[y][x])+ percentage_suffix;
                t1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"bartext"+x+"-"+y);
                svg.appendChild(t1);
        }            

        var t2 =document.createElementNS("http://www.w3.org/2000/svg", "line");
        t2.setAttribute("x1", margin_left*.95);
        t2.setAttribute("x2", margin_left);
        t2.setAttribute("y1", 50+(barheight*x*items.length));
        t2.setAttribute("y2", 50+(barheight*x*items.length));  
        t2.setAttribute("stroke", "#222");  
        svg.appendChild(t2);  

	// ADDING THE ITEM LABELS
        if (x < myitempts.length)
        {
             var ipt1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
                ipt1.setAttribute("x", 5);
                ipt1.setAttribute("y", 50+(barheight*(x)*items.length)+5);
                ipt1.setAttribute("fill", "#333");
                ipt1.setAttribute("class","tcc_values");
               
		next_label=myitempts[x]
		if ((next_label.length*4)<75)
		{
                	var iptxt1=document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                	iptxt1.setAttribute("x", 5);
                	iptxt1.setAttribute("y", 50+(barheight*(x)*items.length)+(barheight*items.length)/3);
                	iptxt1.setAttribute("fill", "#333");
                	iptxt1.setAttribute("class","tcc_values");
                	iptxt1.textContent=myitempts[x];
                	ipt1.appendChild(iptxt1);
                } else
		{
			next_label_array=next_label.split(" ");
			next_label="";
			label_rowctr=0;
			for(actr=0;actr<next_label_array.length; actr++)
			{
				if (next_label=="")
				{
					next_label=next_label_array[actr];
				} else
				{
					next_label=next_label+" "+next_label_array[actr];
				}	
				if ((actr+1)==next_label_array.length)
				{
              				var aiptxt1=document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                				aiptxt1.setAttribute("x", 5);
                				aiptxt1.setAttribute("y", label_rowctr+50+(barheight*(x)*items.length)+(barheight*items.length)/3);
                				aiptxt1.setAttribute("fill", "#333");
                				aiptxt1.setAttribute("class","values");
                				aiptxt1.textContent=(next_label);
                				ipt1.appendChild(aiptxt1);
				} else
				{
					//alert(next_label+" "+next_label_array[actr+1]);
				 	//alert((next_label+" "+next_label_array[actr+1]).length);
					if (((next_label+" "+next_label_array[actr+1]).length*4)>70)
					{
              				var aiptxt1=document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                				aiptxt1.setAttribute("x", 5);
                				aiptxt1.setAttribute("y", label_rowctr+50+(barheight*(x)*items.length)+(barheight*items.length)/3);
                				aiptxt1.setAttribute("fill", "#333");
                				aiptxt1.setAttribute("class","values");
                				aiptxt1.textContent=(next_label);
                				ipt1.appendChild(aiptxt1);
					next_label="";
					label_rowctr=label_rowctr+8;
					}
				}
			};
		}
                svg.appendChild(ipt1);       
        }                
    }

    //---------------  ADDING THE LINES -------------------------------------//
    if (mylinedata != null)
    {
        if (mylinedata.length > 0)
        {
            lineheight=mydata.length*barheight;
            for (x=0; x < mylinedata[0].length; x++)
            {
                if (x < mylinedata[0].length-1)
                {
                    for (y=0; y< mylinedata.length; y++)
                    {
                        var mld2 =document.createElementNS("http://www.w3.org/2000/svg", "line");
                        mld2.setAttribute("x1", margin_left+(mylinedata[y][x]*widthmultiplier*(100/max_value_on_scale)));
                        mld2.setAttribute("x2", margin_left+(mylinedata[y][x+1]*widthmultiplier*(100/max_value_on_scale)));  
                        mld2.setAttribute("y1", 50+(lineheight/2)+(lineheight*x));
                        mld2.setAttribute("y2", 50+(lineheight/2)+(lineheight*(x+1)));
                        mld2.setAttribute("stroke", linecolors[y]);  
                        mld2.setAttribute("stroke-width", "2");
                        if (item_class != "") {  mld2.setAttribute("class",item_class);     }
                        svg.appendChild(mld2);  
                    }
                }
            }    
        }
    }
    
    //----------------------------------------  ADDING THE LEGEND -------------------------------------//
    if (bShowLegend)
    {
        for (x=0;x < items.length;x++)
        {
            var lr1 =document.createElementNS("http://www.w3.org/2000/svg", "rect");
                lr1.setAttribute("x", (widthmultiplier*100+100)+5);
                lr1.setAttribute("width", 10);
                lr1.setAttribute("y", 50+(x*15));
                lr1.setAttribute("height", 10);
                lr1.setAttribute("fill", colorset[x]);
                if (item_class != "") {  lr1.setAttribute("class",item_class);     }
                lr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"barchart-legendbox"+x);
                svg.appendChild(lr1);
            var lt1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
                lt1.setAttribute("x", (widthmultiplier*100+100)+20);
                lt1.setAttribute("y", 50+(x*15)+10);
                lt1.setAttribute("fill", "#333");
                lt1.setAttribute("class","legendtext");
                lt1.setAttribute("name",div_id+"-"+tcc_div_chart_counter+"barchartzz"+x);
                lt1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"barchart-legendtext"+x);
                lt1.textContent=items[x];
                svg.appendChild(lt1);                
                
                var hlr1 =document.createElementNS("http://www.w3.org/2000/svg", "rect");
                hlr1.setAttribute("x", (widthmultiplier*100+100)+5);
                hlr1.setAttribute("width", 200);
                hlr1.setAttribute("y", 50+(x*15));
                hlr1.setAttribute("height", 10);
                hlr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"barchart-legendhidden"+x);
                hlr1.setAttribute("fill", "transparent");
                if (bBarBorders == true)
                {
                    hlr1.setAttribute("onclick","tcc_item_bar_click('bar','"+div_id+"-"+tcc_div_chart_counter+"svg','"+div_id+"-"+tcc_div_chart_counter+"barchart-legendtext"+x+"','"+div_id+"-"+tcc_div_chart_counter+"bar','"+mydata[0].length+"','"+x+"','"+div_id+"-"+tcc_div_chart_counter+"barborder','"+column_shadectr+"');");
                } else
                {
                    hlr1.setAttribute("onclick","tcc_item_bar_click('bar','"+div_id+"-"+tcc_div_chart_counter+"svg','"+div_id+"-"+tcc_div_chart_counter+"barchart-legendtext"+x+"','"+div_id+"-"+tcc_div_chart_counter+"bar','"+mydata[0].length+"','"+x+"','','"+column_shadectr+"');");
                }                   
                svg.appendChild(hlr1);              

         }
        if (mylinedata != null)
        {
            if (mylinedata.length > 0)
            {
                for (x=0;x < lineitems.length;x++)
                {
                    var lr1 =document.createElementNS("http://www.w3.org/2000/svg", "rect");
                        lr1.setAttribute("x", (widthmultiplier*100+100)+5);
                        lr1.setAttribute("width", 10);
                        lr1.setAttribute("y", 50+(items.length*15)+(x*15));
                        lr1.setAttribute("height", 10);
                        lr1.setAttribute("fill", linecolors[x]);
                        svg.appendChild(lr1);
                    var lt1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
                        lt1.setAttribute("x",(widthmultiplier*100+100)+20);
                        lt1.setAttribute("y", 50+(items.length*15)+(x*15)+10);
                        lt1.setAttribute("fill", "#333");
                        lt1.setAttribute("class","legendtext");
                        lt1.setAttribute("name",div_id+"barchartlinezz"+x);
                        lt1.setAttribute("id",div_id+"barchartline-legendtext"+x);
                       
                        lt1.textContent=lineitems[x];
                        svg.appendChild(lt1);                
                 }
             }
         }
    }
    document.getElementById(div_id).appendChild(svg);
    tcc_div_chart_counter+=1;


}  //------------------------------ END FUNCTION BUILD BAR CHART--------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------------------------------------------------------------------//



//----------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------- BUILD A STACKED CHART ------------------------------------------------------------------------------//
function build_stacked_chart(div_id, svgwidth, svgheight, items, lineitems, myitempts, mydata, mylinedata, colorset, linecolors, bShowLegend, bShowScales, bSingleDimensionArray,
chart_label,chart_label_class, chart_label_position,footnotes,footnotes_class, bIsPercent,
barmargin, bShowBackground, valueformat, bColumn_Borders, bShadeBorders, bHideTickMarks,item_class,value_text_class,legend_position)
{

    var NS="http://www.w3.org/2000/svg";     
    var svg=document.createElementNS(NS,"svg");

    bHorizontalLines=bShowScales;
        
    var chartwidth=svgwidth;
    var chartheight=svgheight-50;

    var max_value_on_scale = 100;
    percentage_suffix="%";

    if (bIsPercent==false)
    {
//	    max_value_on_scale=0;
	    percentage_suffix="";
//	    max_value_on_scale=calculate_mylinedata(max_value_on_scale,mydata);
    }  else
    {
        if (valueformat=="") { valueformat="%d"; percentage_suffix="%"; }
    } 

    legendwidth=150;
    
    if (bShowLegend)
     { 
        for (i=0; i<items.length; i++)
        {
            if (items[i].length > 30) { legendwidth=175; }
            if (items[i].length > 35) { legendwidth=210; }
            if (items[i].length > 40) { legendwidth=250; }
        }
        if (legendwidth > (chartwidth/2)) { legendwidth=chartwidth/3; }
        chartwidth=chartwidth-legendwidth;
     }

    svg.setAttribute("width",svgwidth);
    svg.setAttribute("height",svgheight);
    svg.setAttribute("fill","transparent");
    svg.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"svg");

    barwidth=(chartwidth-80)/(mydata.length*mydata[0].length);
    
    heightmultiplier=chartheight/200;

    //--------------- CHART LABELS -------------------------------------//
    if (chart_label_position=="top")
    {
            chart_label_text_array=replace_all(chart_label,"[CR]","\n").split("\n");
            for (i=0;i<chart_label_text_array.length; i++)            {
                svg.appendChild(write_line_of_text(chart_label_text_array[i],50,15+(15*i),"#333",chart_label_class));
                if (i > 0) {chartheight=chartheight-10; chartlabel_height=chartlabel_height-10;}
            }
    }
    // LABEL ON BOTTOM
    if (chart_label_position=="bottom")
    {
            chart_label_text_array=replace_all(chart_label,"[CR]","\n").split("\n");
            for (i=0;i<chart_label_text_array.length; i++)            {    
               svg.appendChild(write_line_of_text(chart_label_text_array[i],50,chartheight-40+(15*i),"#333",chart_label_class));
            }
    }      
    // FOOTNOTES
    if (footnotes!="")
    {
        afootnotes=footnotes.split("\n");    
        vpos=0;
        for (f=0; f < afootnotes.length; f++)
        {
            next_afootnotes_split=afootnotes[f].split("[CR]");
            for (nf=0; nf< next_afootnotes_split.length; nf++)
            {
                svg.appendChild(write_line_of_text(next_afootnotes_split[nf],20,chartheight+25+vpos,"#333",footnotes_class));           
                vpos+=9;
            }
        }
    }
    // BACKGROUND
    if (bShowBackground == true)
    {
        var bkgrd =document.createElementNS("http://www.w3.org/2000/svg", "rect");
            bkgrd.setAttribute("x", 50);
            bkgrd.setAttribute("width", chartwidth-80);
            bkgrd.setAttribute("y", 50);
//            bkgrd.setAttribute("height", chartheight-150);
//            bkgrd.setAttribute("height", max_value_on_scale*heightmultiplier);
            bkgrd.setAttribute("height", 100*heightmultiplier);
            bkgrd.setAttribute("fill", tcc_background_color);
            svg.appendChild(bkgrd);
    }
    //---------------  HORIZONTAL LINES -------------------------------------//
    if (bHorizontalLines)
    {
        tickcounter=5;//2;//10;//
        tickcount=100/tickcounter; // 100 IS THE MAX NUMBER - 100%
        tickcountvalue = max_value_on_scale / tickcounter;
    
        for (x=0; x < tickcounter; x++)  //   for (x=0; x < 10; x++)   -- for every 10 points
        {
            var l1=document.createElementNS("http://www.w3.org/2000/svg", "line");
                l1.setAttribute("x1", 45);
                l1.setAttribute("x2", chartwidth-30);
                l1.setAttribute("y1", 50+((tickcount*heightmultiplier)*x));//   l1.setAttribute("y1", 50+((10*heightmultiplier)*x))  -- for every 10 points
                l1.setAttribute("y2", 50+((tickcount*heightmultiplier)*x)); //  l1.setAttribute("y2", 50+((10*heightmultiplier)*x))
                l1.setAttribute("stroke", tcc_line_color);  // style="stroke:red;stroke-width:2"
                l1.setAttribute("stroke-width", ".2");
                svg.appendChild(l1);  

            var lt1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
                lt1.setAttribute("x", 25);
                lt1.setAttribute("y", 50+((tickcount*heightmultiplier)*x)+5);
                lt1.setAttribute("fill", "#333");
                lt1.setAttribute("class","tcc_values");
               
                lt1.textContent=tickcountvalue*(tickcounter-x)+percentage_suffix;
                svg.appendChild(lt1);
        }
    }
    
    //---------------  ADDING THE COLUMN BARS -------------------------------------//
       for (x=0; x < mydata[0].length; x++)
        {
                nextpos=(x*items.length);
                accumheight=0;
                columnbase=0;
                columncount=0;
                
                for (z=0;z < items.length; z++)
                {
                    columnbase=columnbase+mydata[z][x];
                    columncount+=1;
                }
                barposition=0;
                if (columncount >1) {  barposition= ((barwidth-barmargin)*(columncount/2))-(barwidth/2); }
                
                for (y=0;y < items.length; y++)
                {
                   
                    var r2=  document.createElementNS("http://www.w3.org/2000/svg", "rect");
                        r2.setAttribute("x", 50+(barwidth*nextpos)+(barposition));
                        r2.setAttribute("width", barwidth-barmargin);
                        r2.setAttribute("y", 50+(100*heightmultiplier-  (((mydata[y][x]+accumheight)/columnbase)*100*heightmultiplier*(100/max_value_on_scale)) ) );
                        r2.setAttribute("height", ((mydata[y][x]/columnbase)*100)*heightmultiplier*(100/max_value_on_scale));
                        r2.setAttribute("fill", colorset[y]);
                        svg.appendChild(r2);                 
                    
                    if (bColumn_Borders==true)
                    {
                        //   BORDERS AROUND THE COLUMNS
                        var lr1 =  document.createElementNS("http://www.w3.org/2000/svg", "line");
                            lr1.setAttribute("x1", 50+(barwidth*nextpos)+(barposition));
                            lr1.setAttribute("x2", 50+(barwidth*nextpos)+(barposition)+barwidth-barmargin);
                            lr1.setAttribute("y1", 50+(100*heightmultiplier-  (((mydata[y][x]+accumheight)/columnbase)*100*heightmultiplier*(100/max_value_on_scale)) ) );
                            lr1.setAttribute("y2", 50+(100*heightmultiplier-  (((mydata[y][x]+accumheight)/columnbase)*100*heightmultiplier*(100/max_value_on_scale)) ) );
                            lr1.setAttribute("stroke", "#000000");
                            lr1.setAttribute("stroke-width", ".5");
                            svg.appendChild(lr1);      
                        var lr1a =  document.createElementNS("http://www.w3.org/2000/svg", "line");
                            lr1a.setAttribute("x1", 50+(barwidth*nextpos)+(barposition));
                            lr1a.setAttribute("x2", 50+(barwidth*nextpos)+(barposition));
                            lr1a.setAttribute("y1", 50+(100*heightmultiplier-  (((mydata[y][x]+accumheight)/columnbase)*100*heightmultiplier*(100/max_value_on_scale)) ) );
                            lr1a.setAttribute("y2", 50+(100*heightmultiplier));
                            lr1a.setAttribute("stroke", "#000000");
                            lr1a.setAttribute("stroke-width", ".5");
                            svg.appendChild(lr1a);      
                        var lr1ab =  document.createElementNS("http://www.w3.org/2000/svg", "line");
                            lr1ab.setAttribute("x1", 50+(barwidth*nextpos)+(barposition)+barwidth-barmargin);
                            lr1ab.setAttribute("x2", 50+(barwidth*nextpos)+(barposition)+barwidth-barmargin);
                            lr1ab.setAttribute("y1", 50+(100*heightmultiplier-  (((mydata[y][x]+accumheight)/columnbase)*100*heightmultiplier*(100/max_value_on_scale)) ) );
                            lr1ab.setAttribute("y2", 50+(100*heightmultiplier));
                            lr1ab.setAttribute("stroke", "#000000"); 
                            lr1ab.setAttribute("stroke-width", ".5");
                            svg.appendChild(lr1ab);      
                    }                                  

                    // ADDING THE VALUES TO THE BARS
                    var t1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
                        t1.setAttribute("x", 50+(barwidth*nextpos)+(barposition));
                        t1.setAttribute("y", 50+(100*heightmultiplier-  (((mydata[y][x]+accumheight)/columnbase)*100*heightmultiplier*(100/max_value_on_scale)) )+10 );
                        t1.setAttribute("fill", "#333");
                        t1.setAttribute("style", "font: 'Arial' 6px");
                        if (barwidth > 40) { t1.setAttribute("class","tcc_values_2");    } 
                        if (barwidth > 30) { t1.setAttribute("class","tcc_values_1");  } 
                        if (barwidth <= 30) { t1.setAttribute("class","tcc_values"); }
                        t1.textContent = valueformat.replace("%d", mydata[y][x]).replace("[[value]]", mydata[y][x]).replace("[value]", mydata[y][x]) + percentage_suffix;
                        svg.appendChild(t1);

                accumheight=accumheight+  mydata[y][x];   
                }            
                   
                // TICK MARKS
                if (bHideTickMarks== false)
                {
                    var t2 =document.createElementNS("http://www.w3.org/2000/svg", "line");
                        t2.setAttribute("x1", 50+(barwidth*x*items.length));
                        t2.setAttribute("x2", 50+(barwidth*x*items.length));
                        t2.setAttribute("y1", 50+((20*heightmultiplier)*5));
                        t2.setAttribute("y2", 50+((20*heightmultiplier)*5)+5);  
                        t2.setAttribute("stroke", "#222"); 
						t2.setAttribute("class","tcc_tick_values");
                        svg.appendChild(t2);  
                }
                var ipt1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
                    ipt1.setAttribute("x", 50+(barwidth*x*items.length)+10);
                    ipt1.setAttribute("y", 50+((20*heightmultiplier)*5)+20);
                    ipt1.setAttribute("fill", "#333");
                    //ipt1.setAttribute("class","values");
                    if (barwidth < 30)
                    {
                        ipt1.setAttribute("class","tcc_values");
                    } else
                    {
                        ipt1.setAttribute("class","tcc_values_1");
                    }
                    
		        var nextitempt=myitempts[x].split("\n");
		       // alert(myitempts[x]+" " +myitempts[x].length + "  " +barwidth+" " + items.length);
	            for (z=0;z<nextitempt.length;z++)
			    {
			        if (nextitempt[z].length*5 < (barwidth*items.length))
			        {
                    		var iptxt1=document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                    		    if (myitempts[x].length*5 < (barwidth*items.length))
                    		    {
                        		    iptxt1.setAttribute("x", 50+(barwidth*x*items.length)+(barwidth*items.length)/2-(myitempts[x].length/2)*7);
                        		}
                        		else
                        		{
                        		    iptxt1.setAttribute("x", 50+(barwidth*x*items.length) );
                        		}
                        		iptxt1.setAttribute("y", 50+((20*heightmultiplier)*5)+20+(10*z));
                        		iptxt1.setAttribute("fill", "#333");
                        		iptxt1.setAttribute("class","tcc_values");
                        		iptxt1.textContent=nextitempt[z];
                        		ipt1.appendChild(iptxt1);
                     } else
                     {
                        var nextitempt2=nextitempt[z].split(" ");
                        var nextitemptstg="";
                        var nextitemptstgpre="";
                        var ictr=0;
                        for (z2=0;z2< nextitempt2.length; z2++)
                        {
                            if (nextitemptstgpre=="") { nextitemptstgpre = nextitempt2[z2]; } else { nextitemptstgpre=nextitemptstgpre+" "+nextitempt2[z2]; }
                            
                            if ((nextitemptstgpre.length*5) > (barwidth*items.length))
                            {
                    		    var iptxt1=document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                        		    iptxt1.setAttribute("x", 50+(barwidth*x*items.length) );
                        		    iptxt1.setAttribute("y", 50+((20*heightmultiplier)*5)+20+(10*z+(10*ictr)));
                        		    iptxt1.setAttribute("fill", "#333");
                        		    iptxt1.setAttribute("class","tcc_values");
                        		    iptxt1.textContent=nextitemptstg;
                        		    ipt1.appendChild(iptxt1);
                        	    nextitemptstgpre= nextitempt2[z2];
                        	    ictr=ictr+1;
                            }
                            nextitemptstg=nextitemptstgpre;
                        }
                		    var iptxt1=document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                        		    iptxt1.setAttribute("x", 50+(barwidth*x*items.length) );
                        		    iptxt1.setAttribute("y", 50+((20*heightmultiplier)*5)+20+(10*z+(10*ictr)));
                        		    iptxt1.setAttribute("fill", "#333");
                        		    iptxt1.setAttribute("class","tcc_values");
                        		    iptxt1.textContent=nextitemptstg;
                        		    ipt1.appendChild(iptxt1);
                        	    nextitemptstgpre= nextitempt2[z2];
                     }
			    }
                   // ipt1.textContent=myitempts[x];
                 svg.appendChild(ipt1);       
           }
   
    
    //---------------  ADDING THE LINES -------------------------------------//
    if (mylinedata != null)
    {
        if (mylinedata.length > 0)
        {
            linewidth=mydata.length*barwidth;
            for (x=0; x < mylinedata[0].length; x++)
            {
                if (x < mylinedata[0].length-1)
                {
                    for (y=0; y< mylinedata.length; y++)
                    {
                        var mld2 =document.createElementNS("http://www.w3.org/2000/svg", "line");
                        mld2.setAttribute("x1", 50+(linewidth/2)+(linewidth*x));
                        mld2.setAttribute("x2", 50+(linewidth/2)+(linewidth*(x+1)));
                        mld2.setAttribute("y1", 50+(100*heightmultiplier- mylinedata[y][x]*heightmultiplier*(100/max_value_on_scale)));
                        mld2.setAttribute("y2", 50+(100*heightmultiplier- mylinedata[y][x+1]*heightmultiplier*(100/max_value_on_scale)));  
                        mld2.setAttribute("stroke", linecolors[y]);  
                        mld2.setAttribute("stroke-width", "2");
                        svg.appendChild(mld2);  
                    }
                }
            }    
        }
    }
    
    //---------------  ADDING THE LEGEND -------------------------------------//
    if (bShowLegend)
    {
        for (x=0;x < items.length;x++)
        {
            var lr1 =document.createElementNS("http://www.w3.org/2000/svg", "rect");
                lr1.setAttribute("x", chartwidth+5);
                lr1.setAttribute("width", 10);
                lr1.setAttribute("y", 50+(x*15));
                lr1.setAttribute("height", 10);
                lr1.setAttribute("fill", colorset[x]);
                svg.appendChild(lr1);
            var lt1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
                lt1.setAttribute("x", chartwidth+20);
                lt1.setAttribute("y", 50+(x*15)+10);
                lt1.setAttribute("fill", "#333");
                lt1.setAttribute("class","legendtext");
               
                lt1.textContent=items[x];
                svg.appendChild(lt1);                
         }
        if (mylinedata != null)
        {
            if (mylinedata.length > 0)
            {
                for (x=0;x < lineitems.length;x++)
                {
                    var lr1 =document.createElementNS("http://www.w3.org/2000/svg", "rect");
                        lr1.setAttribute("x", chartwidth+5);
                        lr1.setAttribute("width", 10);
                        lr1.setAttribute("y", 50+(items.length*15)+(x*15));
                        lr1.setAttribute("height", 10);
                        lr1.setAttribute("fill", linecolors[x]);
                        svg.appendChild(lr1);
                    var lt1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
                        lt1.setAttribute("x", chartwidth+20);
                        lt1.setAttribute("y", 50+(items.length*15)+(x*15)+10);
                        lt1.setAttribute("fill", "#333");
                        lt1.setAttribute("class","legendtext");
                       
                        lt1.textContent=lineitems[x];
                        svg.appendChild(lt1);                
                 }
             }
         }
    }
    document.getElementById(div_id).appendChild(svg);
    tcc_div_chart_counter+=1;

}
  //------------------------------ END FUNCTION BUILD STACKED CHART---------------------------------------------------//
//----------------------------------------------------------------------------------------------------------------------------------------------//







//----------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------- BUILD A COLUMN CHART -----------------------------------------------------//
function build_column_chart(div_id, svgwidth, svgheight, items, lineitems, myitempts, mydata, mylinedata, colorset, linecolors, bShowLegend, bShowScales, bSingleDimensionArray,
chart_label,chart_label_class, chart_label_position,footnotes,footnotes_class, bIsPercent, barmargin, bShowBackground, valueformat, bColumn_Borders, bShadeBorders, bLinearGradient, bHideTickMarks,
static_max_value_on_scale,static_number_of_ticks,bBorderLeft,bBorderRight,bBorderTop,bBorderBottom,item_class,value_text_class,legend_position)
{
	

    var NS="http://www.w3.org/2000/svg";     
    var svg=document.createElementNS(NS,"svg");

    bHorizontalLines=bShowScales;
        
    var chartlabel_height=50;    
    var chartwidth=svgwidth*.97;
    var chartheight=svgheight-50;
	if (chartwidth < 500) { legend_position="top"; }
    //--------------- CHART LABELS -------------------------------------//
    // LABEL ON TOP
    if (chart_label_position=="top")
    {
            chart_label_text_array=replace_all(chart_label,"[CR]","\n").split("\n");//chart_label.split("[CR]");
            for (i=0;i<chart_label_text_array.length; i++)            {
                svg.appendChild(write_line_of_text(chart_label_text_array[i],50,15+(15*i),"#333",chart_label_class));
                if (i > 0) {chartheight=chartheight-10; chartlabel_height=chartlabel_height-10;}
            }
    }
    // LABEL ON BOTTOM
    if (chart_label_position=="bottom")
    {
            chart_label_text_array=replace_all(chart_label,"[CR]","\n").split("\n");//chart_label.split("[CR]");
            for (i=0;i<chart_label_text_array.length; i++)            {    
               svg.appendChild(write_line_of_text(chart_label_text_array[i],50,chartheight-40+(15*i),"#333",chart_label_class));
            }
    }      

    var max_value_on_scale = 100;
    percentage_suffix="%";
    if (static_max_value_on_scale > 0)
    {
       max_value_on_scale=static_max_value_on_scale;
    }

    if ((bIsPercent==false)&& (static_max_value_on_scale<0))
    {
	    max_value_on_scale=0;	   
	    max_value_on_scale=calculate_mylinedata(max_value_on_scale,mydata);
    }
    if (bIsPercent==false) {  percentage_suffix=""; } 
     else {    if (valueformat=="") { valueformat="%d"; percentage_suffix="%"; }   } 
    
    legendwidth=150;
    
    if ((bShowLegend) && (legend_position != "top"))
     { 
        for (i=0; i<items.length; i++)
        {
        if (items[i].length > 30) { legendwidth=175; }
             if (items[i].length > 35) { legendwidth=210; }
             if (items[i].length > 40) { legendwidth=250; }
        }
        if (legendwidth > (chartwidth/2)) { legendwidth=chartwidth/3; }
        chartwidth=chartwidth-legendwidth;
     }


    svg.setAttribute("width",svgwidth);
    svg.setAttribute("height",svgheight);
    svg.setAttribute("fill","transparent");
    svg.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"svg");


    //barwidth=(chartwidth-80)/(mydata.length*mydata[0].length);
    barwidth=(chartwidth-80)/(mydata.length*mydata[0].length);
    heightmultiplier=chartheight/200;

    if (barwidth <= barmargin) {  barmargin=barwidth/1.5;  }
    column_shadectr=0;
    if (bShadeBorders == true)
    {
         if (barwidth <= 25) { column_shadectr=2; }
         if (barwidth > 25) { column_shadectr=3; }
         if (barwidth > 35) { column_shadectr=4; }
         if (barwidth > 45) { column_shadectr=5; }
         if (barwidth > 55) { column_shadectr=6; }
         if (barwidth > 65) { column_shadectr=7; }  
    }
        
    // FOOTNOTES
    if (footnotes!="")
    {
        afootnotes=replace_all(footnotes,"[CR]","\n").split("\n");       
        vpos=0;
        for (f=0; f < afootnotes.length; f++)      {
            svg.appendChild(write_line_of_text(afootnotes[f],50,chartheight+30+vpos,"#333",footnotes_class));
            vpos+=9;
        }
    }
    // BACKGROUND
    if (bShowBackground == true)
    {
        var bkgrd =document.createElementNS("http://www.w3.org/2000/svg", "rect");
            bkgrd.setAttribute("x", 50);
            bkgrd.setAttribute("width", chartwidth-80);
            bkgrd.setAttribute("y", 50);
//            bkgrd.setAttribute("height", chartheight-150);
//            bkgrd.setAttribute("height", max_value_on_scale*heightmultiplier);
            bkgrd.setAttribute("height", 100*heightmultiplier);
            bkgrd.setAttribute("fill", tcc_background_color);
            svg.appendChild(bkgrd);
    }
    //---------------  HORIZONTAL LINES -------------------------------------//
        tickcounter=5;//2;//10;//
        if (static_number_of_ticks > 0) { tickcounter=static_number_of_ticks; }
        
//        tickcount=max_value_on_scale/tickcounter;//50;//10;//
        tickcount=100/tickcounter; // 100 IS THE MAX NUMBER - 100%
        tickcountvalue = max_value_on_scale / tickcounter;
    if (bHorizontalLines)
    {
    
        for (x=0; x <= tickcounter; x++)  //   for (x=0; x < 10; x++)   -- for every 10 points
        {
            svg.appendChild(write_line(45,chartwidth-30,50+((tickcount*heightmultiplier)*x),50+((tickcount*heightmultiplier)*x),tcc_line_color,".1","round","columnchart-"+div_id+"-"+tcc_div_chart_counter+"-hl-"+x));

            var lt1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
                lt1.setAttribute("x", 25);
                lt1.setAttribute("y", 50+((tickcount*heightmultiplier)*x)+5);
                lt1.setAttribute("fill", "#333");
                lt1.setAttribute("class","tcc_tick_values");
               
                lt1.textContent=tickcountvalue*(tickcounter-x)+percentage_suffix;
                svg.appendChild(lt1);
        }
    }
   //ADDING THE LEFT BORDERS     
   if (bBorderLeft==true) {
    svg.appendChild(write_line(50,50,50,50+((tickcount*heightmultiplier)*tickcounter),"#000","1","round","columnchart-"+div_id+"-left-border-"+tcc_div_chart_counter)); };
   //ADDING THE RIGHT BORDERS     
   if (bBorderRight==true) {
    svg.appendChild(write_line(chartwidth-30,chartwidth-30,50,50+((tickcount*heightmultiplier)*tickcounter),"#000","1","round","columnchart-"+div_id+"-right-border-"+tcc_div_chart_counter)); };
   //ADDING THE TOP BORDERS     
   if (bBorderTop==true) {
    svg.appendChild(write_line(50,chartwidth-30,50,50,"#000","1","round","columnchart-"+div_id+"-top-border-"+tcc_div_chart_counter));};
   //ADDING THE BOTTOM BORDERS     
   if (bBorderBottom==true) {
    svg.appendChild(write_line(50,chartwidth-30,50+((tickcount*heightmultiplier)*tickcounter),50+((tickcount*heightmultiplier)*tickcounter),"#000","1","round","columnchart-"+div_id+"-bottom-border-"+tcc_div_chart_counter));};

    //$"#columnchart-"+div_id+"-bottom-border-"+tcc_div_chart_counter.fadeIn('226000'); 
     
   // $("#columnchart-"+div_id+"-bottom-border-"+tcc_div_chart_counter).hide(1000); 

    //---------------  ADDING THE COLUMN BARS -------------------------------------//
       for (x=0; x < mydata[0].length; x++)
        {
                for (y=0;y < items.length; y++)
                {
                    nextpos=(x*items.length)+y;
                    
                    if (bLinearGradient==true)
                    {
                        var mydefs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
                                mydefs.setAttribute("id",div_id+"mydefs"+x+"_"+y);
	                    var grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
		                        grad.setAttribute("id",div_id+"-lg-"+tcc_div_chart_counter+"column"+x+"-"+y);            
		                        grad.setAttribute("x1","0%");
		                        grad.setAttribute("x2","100%");
		                        grad.setAttribute("y1","0%");
		                        grad.setAttribute("y2","0%");
		                        mydefs.appendChild(grad);

                        var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                                stop1.setAttribute("id", div_id+"myStop1"+x+"-"+y);
                                stop1.setAttribute("offset", "0%");
                                //stop1.setAttribute("style", "stop-color: White; stop-opacity: 1");
                                stop1.setAttribute("stop-color", colorset[y]);
                                grad.appendChild(stop1);

                      var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                                stop2.setAttribute("id", div_id+"myStop2"+x+"-"+y);
                                stop2.setAttribute("offset", "50%");
                                //stop2.setAttribute("style", "stop-color: #99cd9f; stop-opacity: 1");
                                stop2.setAttribute("stop-color", "#eee");
                                grad.appendChild(stop2);          
                      var stop3 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                                stop3.setAttribute("id", div_id+"myStop2"+x+"-"+y);
                                stop3.setAttribute("offset", "100%");
                                //stop2.setAttribute("style", "stop-color: #99cd9f; stop-opacity: 1");
                                stop3.setAttribute("stop-color",colorset[y]);
                                grad.appendChild(stop3);       
                        svg.appendChild(mydefs);           
                     }                    
                    
                    var r1 =  document.createElementNS("http://www.w3.org/2000/svg", "rect");
                        r1.setAttribute("x", 50+(barwidth*nextpos));
                        r1.setAttribute("width", barwidth-barmargin);
                        r1.setAttribute("y", 50+(100*heightmultiplier- mydata[y][x]*heightmultiplier*(100/max_value_on_scale)));
                        r1.setAttribute("height", mydata[y][x]*heightmultiplier*(100/max_value_on_scale));
                        //r1.setAttribute("fill", colorset[y]);
                        r1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"column"+x+"-"+y);
                        if (bLinearGradient==true) {
                            r1.setAttribute("fill", "url(#"+div_id+"-lg-"+tcc_div_chart_counter+"column"+x+"-"+y+")");
                        } else
                         {
                                r1.setAttribute("fill", colorset[y]);
                            }       
                     svg.appendChild(r1);  
                      
                   var hlr1 =document.createElementNS("http://www.w3.org/2000/svg", "rect");
                        hlr1.setAttribute("x",  50+(barwidth*nextpos));
                        hlr1.setAttribute("width",barwidth-barmargin);
                        hlr1.setAttribute("y",  50+(100*heightmultiplier- mydata[y][x]*heightmultiplier*(100/max_value_on_scale)));
                        hlr1.setAttribute("height", mydata[y][x]*heightmultiplier*(100/max_value_on_scale));
                        hlr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"columnchart-legendhidden"+x);
                        hlr1.setAttribute("fill", "transparent");   
      
                if (bColumn_Borders == true)
                {
                    hlr1.setAttribute("onclick","tcc_item_column_click('column','"+div_id+"-"+tcc_div_chart_counter+"svg','"+div_id+"-"+tcc_div_chart_counter+"columnchart-legendtext"+y+"','"+div_id+"-"+tcc_div_chart_counter+"column','"+mydata[0].length+"','"+y+"','"+div_id+"-"+tcc_div_chart_counter+"columnborder',"+column_shadectr+");");
                } else
                {
                    hlr1.setAttribute("onclick","tcc_item_column_click('column','"+div_id+"-"+tcc_div_chart_counter+"svg','"+div_id+"-"+tcc_div_chart_counter+"columnchart-legendtext"+y+"','"+div_id+"-"+tcc_div_chart_counter+"column','"+mydata[0].length+"','"+y+"','',"+column_shadectr+");");
                }  
                        svg.appendChild(hlr1);     
                    
                    
                    if (bColumn_Borders==true)
                    {
                        //   BORDERS AROUND THE COLUMNS
                        var lr1 =  document.createElementNS("http://www.w3.org/2000/svg", "line");
                            lr1.setAttribute("x1", 50+(barwidth*nextpos));
                            lr1.setAttribute("x2", 50+(barwidth*nextpos)+barwidth-barmargin);
                            lr1.setAttribute("y1", 50+(100*heightmultiplier- mydata[y][x]*heightmultiplier*(100/max_value_on_scale)));
                            lr1.setAttribute("y2", 50+(100*heightmultiplier- mydata[y][x]*heightmultiplier*(100/max_value_on_scale)));
                            lr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"columnbordertop"+x+"-"+y);
                            lr1.setAttribute("stroke", "#000000");
                            lr1.setAttribute("stroke-width", ".5");
                            svg.appendChild(lr1);      
                        var lr1a =  document.createElementNS("http://www.w3.org/2000/svg", "line");
                            lr1a.setAttribute("x1", 50+(barwidth*nextpos));
                            lr1a.setAttribute("x2", 50+(barwidth*nextpos));
                            lr1a.setAttribute("y1", 50+(100*heightmultiplier- mydata[y][x]*heightmultiplier*(100/max_value_on_scale)));
                            lr1a.setAttribute("y2", 50+(100*heightmultiplier));
                            lr1a.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"columnborderleft"+x+"-"+y);
                            lr1a.setAttribute("stroke", "#000000");
                            lr1a.setAttribute("stroke-width", ".5");
                            svg.appendChild(lr1a);      
                        var lr1ab =  document.createElementNS("http://www.w3.org/2000/svg", "line");
                            lr1ab.setAttribute("x1", 50+(barwidth*nextpos)+barwidth-barmargin);
                            lr1ab.setAttribute("x2", 50+(barwidth*nextpos)+barwidth-barmargin);
                            lr1ab.setAttribute("y1", 50+(100*heightmultiplier- mydata[y][x]*heightmultiplier*(100/max_value_on_scale)));
                            lr1ab.setAttribute("y2", 50+(100*heightmultiplier));
                            lr1ab.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"columnborderright"+x+"-"+y);
                            lr1ab.setAttribute("stroke", "#000000"); 
                            lr1ab.setAttribute("stroke-width", ".5");
                            svg.appendChild(lr1ab);      
                    }                                  

            //-------------------SHADING THE BORDERS ----------------------------------------------------------------------
            if (bShadeBorders == true)
            {
                 next_item_val=0;
                 if (y+1 < mydata.length)
                 {
                     next_item_val= mydata[y+1][x];                 
                 }
                  else
                 {
                    if (x+1 <= items[0].length)
                    {
                          next_item_val=mydata[0][x+1];                   
                    }
                 }
                 shadecolor=shade(colorset[y],"l");
                 shadectr=2;
                 if (barwidth > 25) { shadectr=3; }
                 if (barwidth > 35) { shadectr=4; }
                 if (barwidth > 45) { shadectr=5; }
                 if (barwidth > 55) { shadectr=6; }
                 if (barwidth > 65) { shadectr=7; }
                 origshadectr=shadectr;

                 while ((shadectr > 0)&&
                           (
                            (50+(100*heightmultiplier- mydata[y][x]*heightmultiplier*(100/max_value_on_scale))+shadectr )<
                            (50+(100*heightmultiplier))  
                       ))
                 {                  
                        var lr1 =  document.createElementNS("http://www.w3.org/2000/svg", "line");
                            lr1.setAttribute("x1", 50+(barwidth*nextpos)+shadectr);
                            lr1.setAttribute("x2", 50+(barwidth*nextpos)+barwidth-barmargin-shadectr);
                            lr1.setAttribute("y1", 50+(100*heightmultiplier- mydata[y][x]*heightmultiplier*(100/max_value_on_scale))+shadectr );
                            lr1.setAttribute("y2", 50+(100*heightmultiplier- mydata[y][x]*heightmultiplier*(100/max_value_on_scale))+shadectr );
                            lr1.setAttribute("stroke", shadecolor);
                            lr1.setAttribute("stroke-width", "1");
                            lr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"columntopshade-"+shadectr+"-"+x+"-"+y);
                            svg.appendChild(lr1);   
                        shadecolor=shade(shadecolor,"l");
                        if (origshadectr > 4) { shadecolor=shade(shadecolor,"l"); }
                        shadectr=shadectr-1;
                 }   


                 shadecolor=shade(colorset[y],"l");
                 shadectr=2;
                 if (barwidth > 25) { shadectr=3; }
                 if (barwidth > 35) { shadectr=4; }
                 if (barwidth > 45) { shadectr=5; }
                 if (barwidth > 55) { shadectr=6; }
                 if (barwidth > 65) { shadectr=7; }
                 origshadectr=shadectr;
                 if (shadectr < 4) {shadecolor=shade(colorset[y],"l"); }

                 while  ((shadectr > 0)&&
                           (
                            (50+(100*heightmultiplier- mydata[y][x]*heightmultiplier*(100/max_value_on_scale))+shadectr )<
                            (50+(100*heightmultiplier))  
                       ))
                 {                  
                        var lr1 =  document.createElementNS("http://www.w3.org/2000/svg", "line");
                            lr1.setAttribute("x1", 50+(barwidth*nextpos)+shadectr);
                            lr1.setAttribute("x2", 50+(barwidth*nextpos)+shadectr);
                            lr1.setAttribute("y1", 50+(100*heightmultiplier- mydata[y][x]*heightmultiplier*(100/max_value_on_scale))+shadectr);
                            lr1.setAttribute("y2", 50+(100*heightmultiplier));
                            lr1.setAttribute("stroke", shadecolor);
                            lr1.setAttribute("stroke-width", "d");
                            lr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"columnrightshade-"+shadectr+"-"+x+"-"+y);
                            svg.appendChild(lr1);   
                        shadecolor=shade(shadecolor,"d");
                    //    if (origshadectr > 4) { shadecolor=shade(shadecolor,"l"); }
                        shadectr=shadectr-1;
                 }  


                 shade_darker_or_lighter="l"
                 if ((next_item_val >= mydata[y][x])&&(barmargin<3)) { shade_darker_or_lighter="d"; }
                 shadecolor=shade(colorset[y],"l");
                 shadectr=2;
                 if (barwidth > 25) { shadectr=3; }
                 if (barwidth > 35) { shadectr=4; }
                 if (barwidth > 45) { shadectr=5; }
                 if (barwidth > 55) { shadectr=6; }
                 if (barwidth > 65) { shadectr=7; }
                 origshadectr=shadectr;
                 if (shadectr < 4) {shadecolor=shade(colorset[y],shade_darker_or_lighter); }
                 while  ((shadectr > 0)&&
                           (
                            (50+(100*heightmultiplier- mydata[y][x]*heightmultiplier*(100/max_value_on_scale))+shadectr )<
                            (50+(100*heightmultiplier))  
                       ))
                 {                  
                        var lr1 =  document.createElementNS("http://www.w3.org/2000/svg", "line");
                            lr1.setAttribute("x1", 50+(barwidth*nextpos)+barwidth-barmargin-shadectr);
                            lr1.setAttribute("x2", 50+(barwidth*nextpos)+barwidth-barmargin-shadectr);
                            lr1.setAttribute("y1", 50+(100*heightmultiplier- mydata[y][x]*heightmultiplier*(100/max_value_on_scale))+shadectr);
                            lr1.setAttribute("y2", 50+(100*heightmultiplier));
                            lr1.setAttribute("stroke", shadecolor);
                            lr1.setAttribute("stroke-width", shade_darker_or_lighter);
                            lr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"columnleftshade-"+shadectr+"-"+x+"-"+y);
                            svg.appendChild(lr1);  
                            shadecolor=shade(shadecolor,shade_darker_or_lighter);
                            //    if (origshadectr > 4) { shadecolor=shade(shadecolor,"l"); }
                            shadectr=shadectr-1;
                 }  
                 if  ((next_item_val <= mydata[y][x]) && (barmargin<3) && (next_item_val > 0))
                 {
                         
                         shadecolor=shade(colorset[y],"l");
                         shadectr=2;
                         if (barwidth > 25) { shadectr=3; }
                         if (barwidth > 35) { shadectr=4; }
                         if (barwidth > 45) { shadectr=5; }
                         if (barwidth > 55) { shadectr=6; }
                         if (barwidth > 65) { shadectr=7; }
                         origshadectr=shadectr;
                         if (shadectr < 4) {shadecolor=shade(colorset[y],"d"); }
                         while (shadectr >= 0)
                         {                  
                                var lr1 =  document.createElementNS("http://www.w3.org/2000/svg", "line");
                                    lr1.setAttribute("x1", 50+(barwidth*nextpos)+barwidth-barmargin-shadectr);
                                    lr1.setAttribute("x2", 50+(barwidth*nextpos)+barwidth-barmargin-shadectr);
                                    lr1.setAttribute("y1", 50+(100*heightmultiplier- next_item_val*heightmultiplier*(100/max_value_on_scale))+shadectr);
                                    lr1.setAttribute("y2", 50+(100*heightmultiplier));
                                    lr1.setAttribute("stroke", shadecolor);
                                    lr1.setAttribute("stroke-width", "d");
                                    lr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"columnleftshadeshadow-"+shadectr+"-"+x+"-"+y);
                                    svg.appendChild(lr1);  
                                    shadecolor=shade(shadecolor,"d");
                                    //    if (origshadectr > 4) { shadecolor=shade(shadecolor,"l"); }
                                    shadectr=shadectr-1;
                         }    
                 }
            }


                    // -----------ADDING THE VALUES TO THE BARS -------------------
                    var t1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
                        //t1.setAttribute("x", 50+(barwidth*nextpos)+(barwidth/3));
                        if (barmargin < 3)
                        { t1.setAttribute("x", 50+(barwidth*nextpos)+((barwidth)/2)-10);}
                        else
                        { t1.setAttribute("x", 50+(barwidth*nextpos)+((barwidth-barmargin)/2)-10);}
                        
                        t1.setAttribute("y", 50+(100*heightmultiplier- mydata[y][x]*heightmultiplier*(100/max_value_on_scale))-4);
                        t1.setAttribute("fill", "#333");
                        //t1.setAttribute("style", "font: 'Arial' 6px");
                       // t1.setAttribute("class","values");
                        if (barwidth > 40) { t1.setAttribute("class","tcc_values_2");    } 
                        if (barwidth > 30) { t1.setAttribute("class","tcc_values_1");  } 
                        if (barwidth <= 30) { t1.setAttribute("class","tcc_values"); }
                        t1.textContent = valueformat.replace("%d", mydata[y][x]).replace("[[value]]", mydata[y][x]).replace("[value]", mydata[y][x]) + percentage_suffix;
                        t1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"columntext"+x+"-"+y);
                        svg.appendChild(t1);
                }            

                // TICK MARKS
                if (bHideTickMarks== false)
                {
                    var t2 =document.createElementNS("http://www.w3.org/2000/svg", "line");
                        t2.setAttribute("x1", 50+(barwidth*x*items.length));
                        t2.setAttribute("x2", 50+(barwidth*x*items.length));
                        t2.setAttribute("y1", 50+((20*heightmultiplier)*5));
                        t2.setAttribute("y2", 50+((20*heightmultiplier)*5)+5);  
                        t2.setAttribute("stroke", tcc_line_color);  
                        svg.appendChild(t2);  
                }
                var ipt1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
                    ipt1.setAttribute("fill", "#333");
                    if (vertical_text == true)
                    {
                        xpos=50+(barwidth*x*items.length)+10;
                    	ypos=50+((20*heightmultiplier)*5)+20;
                        ipt1.setAttribute("transform","translate("+xpos+","+ypos+")rotate(90)");
                        ipt1.textContent=myitempts[x];
                    } else
                    {
                        ipt1.setAttribute("x", 50+(barwidth*x*items.length)+10);
                        ipt1.setAttribute("y", 50+((20*heightmultiplier)*5)+20);                    
                    }
                    if (barwidth > 40) { ipt1.setAttribute("class","tcc_values_2");    } 
                    if (barwidth > 30) { ipt1.setAttribute("class","tcc_values_1");  } 
                    if (barwidth <= 30) { ipt1.setAttribute("class","tcc_values"); }


		        var nextitempt=myitempts[x].split("\n");
		       // alert(myitempts[x]+" " +myitempts[x].length + "  " +barwidth+" " + items.length);
		        if (vertical_text == false)
		        {
		            ///------------------- WRITING THE TEXT POINTS UNDER THER CHART
	                for (z=0;z<nextitempt.length;z++)
			        {
			            if (nextitempt[z].length*7 < (barwidth*items.length))
			            {
                    		    var iptxt1=document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                    		        if (myitempts[x].length*5 < (barwidth*items.length))
                    		            {
                    		                if ( ((barwidth*items.length)/2) > ((myitempts[x].length/2)*7))
                    		                {
                        		                iptxt1.setAttribute("x", 50+(barwidth*x*items.length)+(barwidth*items.length)/2-(myitempts[x].length/2)*7);
                        		            } else
                        		            {
                        		                iptxt1.setAttribute("x", 50+(barwidth*x*items.length)+(barwidth*items.length)/2-(myitempts[x].length/2)*7);
                        		            }
                        		        }
                        		        else
                        		        {
                        		            iptxt1.setAttribute("x", 50+(barwidth*x*items.length) );
                        		        }
                        		    iptxt1.setAttribute("y", 50+((20*heightmultiplier)*5)+20+(10*z));
  
                    			    iptxt1.setAttribute("fill", "#333");		
                        		    if (barwidth > 40) { iptxt1.setAttribute("class","tcc_values_2");    } 
                                    if (barwidth > 30) { iptxt1.setAttribute("class","tcc_values_1");  } 
                                    if (barwidth <= 30) { iptxt1.setAttribute("class","tcc_values"); }
                        		    iptxt1.textContent=nextitempt[z];
                        		    ipt1.appendChild(iptxt1);
                         } else
                         {
                            var nextitempt2=nextitempt[z].split(" ");
                            var nextitemptstg="";
                            var nextitemptstgpre="";
                            var ictr=0;
                            for (z2=0;z2< nextitempt2.length; z2++)
                            {
                                if (nextitemptstgpre=="") { nextitemptstgpre = nextitempt2[z2]; } else { nextitemptstgpre=nextitemptstgpre+" "+nextitempt2[z2]; }
                                
                                if ((nextitemptstgpre.length*5) > (barwidth*items.length))
                                {
                    		        var iptxt1=document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                        		        iptxt1.setAttribute("x", 50+(barwidth*x*items.length) );
                        		        iptxt1.setAttribute("y", 50+((20*heightmultiplier)*5)+20+(10*z+(10*ictr)));
                        		        iptxt1.setAttribute("fill", "#333");
    //					                if (vertical_text == true)
    //                    			    {
    //                    			        ////iptxt1.setAttribute("transform","rotate(30 50,40)");
    //                        			    iptxt1.setAttribute("style","writing-mode: tb;");
    //                    			    }			
                        		        if (barwidth > 40) { iptxt1.setAttribute("class","tcc_values_2");    } 
                                        if (barwidth > 30) { iptxt1.setAttribute("class","tcc_values_1");  } 
                                        if (barwidth <= 30) { iptxt1.setAttribute("class","tcc_values"); }
                        		        iptxt1.textContent=nextitemptstg;
                        		        ipt1.appendChild(iptxt1);
                        	        nextitemptstgpre= nextitempt2[z2];
                        	        ictr=ictr+1;
                                }
                                nextitemptstg=nextitemptstgpre;
                            }
                		        var iptxt1=document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                        		        iptxt1.setAttribute("x", 50+(barwidth*x*items.length) );
                        		        iptxt1.setAttribute("y", 50+((20*heightmultiplier)*5)+20+(10*z+(10*ictr)));
                        		        iptxt1.setAttribute("fill", "#333");
                        		        if (barwidth > 40) { iptxt1.setAttribute("class","tcc_values_2");    } 
                                        if (barwidth > 30) { iptxt1.setAttribute("class","tcc_values_1");  } 
                                        if (barwidth <= 30) { iptxt1.setAttribute("class","tcc_values"); }
                        		        iptxt1.textContent=nextitemptstg;
                        		        ipt1.appendChild(iptxt1);
                        	        nextitemptstgpre= nextitempt2[z2];
                         }
			        }
			    }
                   // ipt1.textContent=myitempts[x];
                 svg.appendChild(ipt1);       
           }
   
    
    //---------------  ADDING THE LINES -------------------------------------//
    if (mylinedata != null)
    {
        if (mylinedata.length > 0)
        {
            linewidth=mydata.length*barwidth;
            for (x=0; x < mylinedata[0].length; x++)
            {
                if (x < mylinedata[0].length-1)
                {
                    for (y=0; y< mylinedata.length; y++)
                    {
                        var mld2 =document.createElementNS("http://www.w3.org/2000/svg", "line");
                        mld2.setAttribute("x1", 50+(linewidth/2)+(linewidth*x));
                        mld2.setAttribute("x2", 50+(linewidth/2)+(linewidth*(x+1)));
                        mld2.setAttribute("y1", 50+(100*heightmultiplier- mylinedata[y][x]*heightmultiplier*(100/max_value_on_scale)));
                        mld2.setAttribute("y2", 50+(100*heightmultiplier- mylinedata[y][x+1]*heightmultiplier*(100/max_value_on_scale)));  
                        mld2.setAttribute("stroke", linecolors[y]);  
                        mld2.setAttribute("stroke-width", "2");
                        svg.appendChild(mld2);  
                    }
                }
            }    
        }
    }
    
    //---------------  ADDING THE LEGEND -------------------------------------//
    if (bShowLegend)
    {
	  if (legend_position	== "top") {
			for (x=0;x < items.length;x++)
				{
					var lr1 =document.createElementNS("http://www.w3.org/2000/svg", "rect");
						lr1.setAttribute("x",50+( (chartwidth/items.length*.85)*x ));
						lr1.setAttribute("width", 7);
						lr1.setAttribute("y", 25);
						lr1.setAttribute("height", 7);
						lr1.setAttribute("fill", colorset[x]);
						lr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"columnchart-legendbox"+x);
						svg.appendChild(lr1);		  
					var lt1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
						lt1.setAttribute("x",50+((chartwidth/items.length*.85)* x )+15);
						lt1.setAttribute("y", 35);
						lt1.setAttribute("fill", "#333");
						lt1.setAttribute("class","legendtext");
						lt1.setAttribute("name",div_id+"-"+tcc_div_chart_counter+"columnchartzz"+x);
						lt1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"columnchart-legendtext"+x);					   
						lt1.textContent=items[x];
						svg.appendChild(lt1); 
				}
	  } else {
	
			   legend_offset_x=0;//-200;
			   legend_offset_y=0;
			   
			   var lbckgrd =document.createElementNS("http://www.w3.org/2000/svg", "rect");
				   lbckgrd.setAttribute("x", chartwidth+legend_offset_x);
				   lbckgrd.setAttribute("width", legendwidth-25);
				   lbckgrd.setAttribute("y", 40+legend_offset_y);
				   lbckgrd.setAttribute("height", 50+((items.length-1)*15)+10);
				   lbckgrd.setAttribute("fill", "transparent");
				   lbckgrd.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"columnchart-legendbox-background");
						svg.appendChild(lbckgrd);
				
				for (x=0;x < items.length;x++)
				{
					var lr1 =document.createElementNS("http://www.w3.org/2000/svg", "rect");
						lr1.setAttribute("x", chartwidth+legend_offset_x+5);
						lr1.setAttribute("width", 10);
						lr1.setAttribute("y", 50+legend_offset_y+(x*15));
						lr1.setAttribute("height", 10);
						lr1.setAttribute("fill", colorset[x]);
						lr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"columnchart-legendbox"+x);
						svg.appendChild(lr1);
					var lt1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
						lt1.setAttribute("x", chartwidth+legend_offset_x+20);
						lt1.setAttribute("y", 50+legend_offset_y+(x*15)+10);
						lt1.setAttribute("fill", "#333");
						lt1.setAttribute("class","legendtext");
						lt1.setAttribute("name",div_id+"-"+tcc_div_chart_counter+"columnchartzz"+x);
						lt1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"columnchart-legendtext"+x);					   
						lt1.textContent=items[x];
						svg.appendChild(lt1); 
									
					 var hlr1 =document.createElementNS("http://www.w3.org/2000/svg", "rect");
						hlr1.setAttribute("x", chartwidth+legend_offset_x+5);
						hlr1.setAttribute("width", legendwidth-50);
						hlr1.setAttribute("y", 50+legend_offset_y+(x*15));
						hlr1.setAttribute("height", 10);
						hlr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"columnchart-legendhidden"+x);
						hlr1.setAttribute("fill", "transparent");
						if (bColumn_Borders == true)
						{
							hlr1.setAttribute("onclick","tcc_item_column_click('column','"+div_id+"-"+tcc_div_chart_counter+"svg','"+div_id+"-"+tcc_div_chart_counter+"columnchart-legendtext"+x+"','"+div_id+"-"+tcc_div_chart_counter+"column','"+mydata[0].length+"','"+x+"','"+div_id+"-"+tcc_div_chart_counter+"columnborder',"+column_shadectr+");");
						} else
						{
							hlr1.setAttribute("onclick","tcc_item_column_click('column','"+div_id+"-"+tcc_div_chart_counter+"svg','"+div_id+"-"+tcc_div_chart_counter+"columnchart-legendtext"+x+"','"+div_id+"-"+tcc_div_chart_counter+"column','"+mydata[0].length+"','"+x+"','',"+column_shadectr+");");
						}                   
						svg.appendChild(hlr1);                  
				}	
         }
         //-------------------------------------ADDING THE LINE LEGEND ------------------------//
        if (mylinedata != null)
        {
            if (mylinedata.length > 0)
            {
                for (x=0;x < lineitems.length;x++)
                {
                    var lr1 =document.createElementNS("http://www.w3.org/2000/svg", "rect");
                        lr1.setAttribute("x", chartwidth+legend_offset_x+5);
                        lr1.setAttribute("width", 10);
                        lr1.setAttribute("y", 50+legend_offset_y+(items.length*15)+(x*15));
                        lr1.setAttribute("height", 10);
                        lr1.setAttribute("fill", linecolors[x]);
                        svg.appendChild(lr1);
                    var lt1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
                        lt1.setAttribute("x", chartwidth+legend_offset_x+20);
                        lt1.setAttribute("y", 50+legend_offset_y+(items.length*15)+(x*15)+10);
                        lt1.setAttribute("fill", "#333");
                        lt1.setAttribute("class","legendtext");
                       
                        lt1.textContent=lineitems[x];
                        svg.appendChild(lt1);                
                 }
             }
         }
    }
    document.getElementById(div_id).appendChild(svg);
    tcc_div_chart_counter+=1;

}
 //------------------------------ END FUNCTION BUILD COLUMN CHART---------------------------------------------------//
//----------------------------------------------------------------------------------------------------------------------------------------------//









//----------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------- BUILD A PIE CHART -----------------------------------------------------//
function build_pie_chart(div_id, svgwidth, svgheight, myitems, myitempts, mydatainput, colors, bShowLegend, bShowScales,
chart_label, chart_label_class, chart_label_position,footnotes,footnotes_class, bIsPercent, bShowBackground, valueformat,item_class,value_text_class) {
	//alert(bShowLegend);
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("width", svgwidth);
    svg.setAttribute("height", svgheight);
    svg.setAttribute("fill","transparent");
    svg.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"svg");
   

    mydatavalues = Array(mydatainput[0].length);
    //for (x=0; x < mydatavalues.length;x++)
    //{
    //    mydatavalues[x]=mydatainput[0][x];
    //}
	mydatainput[0].map( (nextitem,index)=> {
		mydatavalues[index]=nextitem
	}); 

    bHorizontalLines = bShowScales;

    var chartwidth = svgwidth;
    var chartheight =svgheight;
	var circleframe =chartwidth;
    if (bShowLegend) { chartwidth = chartwidth*.70; }
	if (chartheight< circleframe) { circleframe = chartheight };
	
    //if (chartheight != chartwidth) { chartheight = chartwidth; }


    var max_value_on_scale = 100;
    percentage_suffix = "%";

    if (bIsPercent == false) {
        percentage_suffix = "";
    //    max_value_on_scale = calculate_mylinedata(max_value_on_scale, mylinedata);
    }  else
    {
       if (valueformat=="") { valueformat="%d"; percentage_suffix="%"; }
    } 
    heightmultiplier = 1.5;
 //   linewidth = (chartwidth) / mylinedata[0].length;

    //--------------- CHART LABELS -------------------------------------//
    // LABEL ON TOP
   // LABEL ON TOP
    if (chart_label_position=="top")
    {
			if (chart_label.length*6>chartwidth) {
				chartarray=chart_label.split(" ");
				let chart_new_label="";
				let chart_new_label_row="";
				for(i=0;i < chartarray.length;i++){
					if ((chart_new_label_row.length+chartarray[i].length)*6 > chartwidth )
					{
						if (chart_new_label==""){
							chart_new_label= chart_new_label_row;
						} else {
							chart_new_label= chart_new_label+"[CR]"+ chart_new_label_row;
						}
						chart_new_label_row=chartarray[i];
					}
					else {
						chart_new_label_row=chart_new_label_row+" "+chartarray[i];
					}
				}
				chart_label=chart_new_label+"[CR]"+chart_new_label_row;
            
			}
			//chart_label=chart_label.length*7+" "+chartwidth+" "+chart_label;
			chart_label_text_array=chart_label.split("[CR]");
			
            for (i=0;i<chart_label_text_array.length; i++)
            {
                svg.appendChild(write_line_of_text(chart_label_text_array[i],0,15+(15*i),"#333",chart_label_class));
            }
    }
   
/*
   if (chart_label_position=="top")
    {
            chart_label_text_array=chart_label.split("[CR]");
            for (i=0;i<chart_label_text_array.length; i++)
            {
                var cl1 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
                    cl1.setAttribute("y", 15+(15*i));
                    cl1.setAttribute("x", 50);
                    cl1.setAttribute("fill", "#333");
                    cl1.setAttribute("class",chart_label_class);
                    cl1.textContent=chart_label_text_array[i];
                    svg.appendChild(cl1);
            }
    }
 */
	// LABEL ON BOTTOM
    if (chart_label_position=="bottom")
    {
            chart_label_text_array=chart_label.split("[CR]");
            for (i=0;i<chart_label_text_array.length; i++)
            {    
                var cl2 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
                    cl2.setAttribute("y",  chartheight + 25+(15*i));
                    cl2.setAttribute("x",  50);
                    cl2.setAttribute("fill", "#333");
                    cl2.setAttribute("class",chart_label_class);
                    cl2.textContent=chart_label_text_array[i];
                    svg.appendChild(cl2);
            }
    }      
    // FOOTNOTES
    if (footnotes!="")
    {
        afootnotes=footnotes.replace("[CR]","\n").split("\n");       
        vpos=0;
        for (f=0; f < afootnotes.length; f++)
        {
//            var cl2 =  document.createElementNS("http://www.w3.org/2000/svg", "text");
//                cl2.setAttribute("y", chartheight-20+vpos);
//                cl2.setAttribute("x", 50);
//                cl2.setAttribute("fill", "#333");
//                cl2.setAttribute("class",footnotes_class);
//                cl2.textContent=afootnotes[f];
//                svg.appendChild(cl2);
            svg.appendChild(write_line_of_text(afootnotes[f],50,chartheight+30+vpos,"#333",footnotes_class));
            vpos+=9;
        }
    }   
    // BACKGROUND
    if (bShowBackground == true)
    {
        var bkgrd = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bkgrd.setAttribute("x", 50);
        bkgrd.setAttribute("width", chartwidth);
        bkgrd.setAttribute("y", 50);
        bkgrd.setAttribute("height", chartheight);
        bkgrd.setAttribute("fill", tcc_background_color);
        svg.appendChild(bkgrd);
    }
    
    //ADD THE CIRCLE
    //recalculate mydata
    var total = 0;

    var circle_multiplier = 1;
    for (y = 0; y < mydatavalues.length; y++) {
        total = total + mydatavalues[y];
    }
    var mydata = Array(mydatavalues.length);
    for (x = 0; x < mydatavalues.length; x++) {
        mydata[x] = (mydatavalues[x] / total) * 360;
    }


    var my_center = { "x": circleframe/2, "y": circleframe/2 };  // M
    var my_radius = ((my_center.x*.80)*2)/3;  // A

    var next_x_point = 0;
    var next_y_point = 0;

    var my_running_line = { "x": 0, "y": 0 }; // start at the starting line
    my_running_line.x = my_center.x;
    my_running_line.y = my_center.y - my_radius;

    var next_angle = 0; // sin,cos 0.01745240643728351 0.9998476951563913
    var running_angle = 0; // cummulative angle
    var next_sin = 0;
    var next_cos = 0;
	
	var stroke_color="white";
	var circle_text_color="black";


    // IF THERE ARE ANY ANGLES > 180degrees, it just makes a circle
    for (x = 0; x < mydata.length; x++) {
        next_angle = mydata[x];
        next_color = colors[x];
        if (next_angle > 180) {
            var circ = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circ.setAttribute("cx", my_center.x);
            circ.setAttribute("cy", my_center.y);
            circ.setAttribute("r", my_radius);
            circ.setAttribute("stroke",stroke_color);
            circ.setAttribute("stroke-width", 1);
            circ.setAttribute("fill", next_color);
            svg.appendChild(circ);

            next_sin = Math.sin((running_angle + next_angle) * Math.PI / 180);
            next_cos = Math.cos((running_angle + next_angle) * Math.PI / 180);
            next_x_point = my_center.x + (next_sin * my_radius);
            next_y_point = my_center.y - (next_cos * my_radius);

            next_text_sin = Math.sin((running_angle + (next_angle / 1.2)) * Math.PI / 180);
            next_text_cos = Math.cos((running_angle + (next_angle / 1.2)) * Math.PI / 180);
            next_text_x_point = my_center.x + (next_text_sin * (my_radius / 1.2));
            next_text_y_point = my_center.y - (next_text_cos * (my_radius / 1.2));
			

            var lt1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            lt1.setAttribute("x", next_text_x_point);
            lt1.setAttribute("y", next_text_y_point);
            lt1.setAttribute("fill", circle_text_color);
            lt1.setAttribute("class", "circlevalues");
            lt1.textContent = valueformat.replace("%d", mydatavalues[x]).replace("[[value]]", mydatavalues[x]).replace("[value]", mydatavalues[x]); // mydatavalues[x] + percentage_suffix;
            svg.appendChild(lt1);

            running_angle = next_angle;
            my_running_line.x = next_x_point;
            my_running_line.y = next_y_point;
        }
    }

    // LOOPS THE ANGLES SMALLER THAN OR EQUAL TO 180 DEGREES
    for (x = 0; x < mydata.length; x++) {
        next_angle = mydata[x];
        next_color = colors[x];
        if (next_angle <= 180) {
            running_angle = running_angle + next_angle;
            next_sin = Math.sin(running_angle * Math.PI / 180);
            next_cos = Math.cos(running_angle * Math.PI / 180);
            next_x_point = my_center.x + (next_sin * my_radius);
            next_y_point = my_center.y - (next_cos * my_radius);

            next_text_sin = Math.sin((running_angle - (next_angle / 1.2)) * Math.PI / 180);
            next_text_cos = Math.cos((running_angle - (next_angle / 1.2)) * Math.PI / 180);
            next_text_x_point = my_center.x + (next_text_sin * (my_radius / 1.2));
            next_text_y_point = my_center.y - (next_text_cos * (my_radius / 1.2));

            var next_d = "M" + my_center.x + "," + my_center.y + " L" + my_running_line.x + "," + my_running_line.y + " A" + my_radius + "," + my_radius + "  0 0,1 " + next_x_point + "," + next_y_point + " z";
            //alert(next_d);
            var next_path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            next_path.setAttribute("d", next_d);
            next_path.setAttribute("stroke", stroke_color);
            next_path.setAttribute("stroke-width", 1);
            next_path.setAttribute("fill", next_color);
            svg.appendChild(next_path);

            var lt1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            lt1.setAttribute("x", next_text_x_point);
            lt1.setAttribute("y", next_text_y_point);
            lt1.setAttribute("fill",circle_text_color);
            lt1.setAttribute("class", "circlevalues");
           // lt1.setAttribute("font-size", "20");
            lt1.textContent = valueformat.replace("%d", mydatavalues[x]).replace("[[value]]", mydatavalues[x]).replace("[value]", mydatavalues[x]); // mydatavalues[x]+percentage_suffix;
            svg.appendChild(lt1);
            my_running_line.x = next_x_point;
            my_running_line.y = next_y_point;
        }
    }
	
	// MAKE THE INNER CIRCLE
	var inner_circ = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    inner_circ.setAttribute("cx", my_center.x);
    inner_circ.setAttribute("cy", my_center.y);
    inner_circ.setAttribute("r", my_radius*.60);
    inner_circ.setAttribute("fill", "white");
    svg.appendChild(inner_circ);
	
	// DO THE TEXTS
    for (x = 0; x < mydata.length; x++) {
        next_angle = mydata[x];
        next_color = colors[x];
        if (next_angle > 180) {

            next_sin = Math.sin((running_angle + next_angle) * Math.PI / 180);
            next_cos = Math.cos((running_angle + next_angle) * Math.PI / 180);
            next_x_point = my_center.x + (next_sin * my_radius);
            next_y_point = my_center.y - (next_cos * my_radius);

            next_text_sin = Math.sin((running_angle + (next_angle / 1.2)) * Math.PI / 180);
            next_text_cos = Math.cos((running_angle + (next_angle / 1.2)) * Math.PI / 180);
            next_text_x_point = my_center.x + (next_text_sin * (my_radius / 1.2));
            next_text_y_point = my_center.y - (next_text_cos * (my_radius / 1.2));
			

            var lt1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            lt1.setAttribute("x", next_text_x_point);
            lt1.setAttribute("y", next_text_y_point);
            lt1.setAttribute("fill", circle_text_color);
            lt1.setAttribute("class", "circlevalues");
            lt1.textContent = valueformat.replace("%d", mydatavalues[x]).replace("[[value]]", mydatavalues[x]).replace("[value]", mydatavalues[x]); // mydatavalues[x] + percentage_suffix;
            svg.appendChild(lt1);

            running_angle = next_angle;
            my_running_line.x = next_x_point;
            my_running_line.y = next_y_point;
        }
    }

    // LOOPS THE ANGLES SMALLER THAN OR EQUAL TO 180 DEGREES
    for (x = 0; x < mydata.length; x++) {
        next_angle = mydata[x];
        next_color = colors[x];
        if (next_angle <= 180) {
            running_angle = running_angle + next_angle;
            next_sin = Math.sin(running_angle * Math.PI / 180);
            next_cos = Math.cos(running_angle * Math.PI / 180);
            next_x_point = my_center.x + (next_sin * my_radius);
            next_y_point = my_center.y - (next_cos * my_radius);

            next_text_sin = Math.sin((running_angle - (next_angle / 1.2)) * Math.PI / 180);
            next_text_cos = Math.cos((running_angle - (next_angle / 1.2)) * Math.PI / 180);
            next_text_x_point = my_center.x + (next_text_sin * (my_radius / 1.2));
            next_text_y_point = my_center.y - (next_text_cos * (my_radius / 1.2));

            var next_d = "M" + my_center.x + "," + my_center.y + " L" + my_running_line.x + "," + my_running_line.y + " A" + my_radius + "," + my_radius + "  0 0,1 " + next_x_point + "," + next_y_point + " z";
            var lt1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            lt1.setAttribute("x", next_text_x_point);
            lt1.setAttribute("y", next_text_y_point);
            lt1.setAttribute("fill",circle_text_color);
            lt1.setAttribute("class", "circlevalues");
           // lt1.setAttribute("font-size", "20");
            lt1.textContent = valueformat.replace("%d", mydatavalues[x]).replace("[[value]]", mydatavalues[x]).replace("[value]", mydatavalues[x]); // mydatavalues[x]+percentage_suffix;
            svg.appendChild(lt1);
            my_running_line.x = next_x_point;
            my_running_line.y = next_y_point;
        }
    }
	


    //--------------- ADD THE LEGEND -------------------------------------//
    if (bShowLegend) {
		
        for (x = 0; x < myitems.length; x++) {
            var lr1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            lr1.setAttribute("x", chartwidth-15);
            lr1.setAttribute("width", 10);
            lr1.setAttribute("y", 50 + (x * 15));
            lr1.setAttribute("height", 10);
            lr1.setAttribute("fill", colors[x]);
            svg.appendChild(lr1);
            var lt1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            lt1.setAttribute("x", chartwidth);
            lt1.setAttribute("y", 50 + (x * 15) + 10);
            lt1.setAttribute("fill", "#333");
            lt1.setAttribute("class", "legendtext");

            lt1.textContent = myitems[x];
            svg.appendChild(lt1);
        }
    }

    document.getElementById(div_id).appendChild(svg);
    tcc_div_chart_counter+=1;


}  //------------------------------ END FUNCTION BUILD PIE CHART---------------------------------------------------//









function build_radar_chart(div_id, svgwidth, svgheight, myitems, myitempts, mydatainput, colors, bShowLegend, bShowScales,
chart_label, chart_label_class, chart_label_position,footnotes,footnotes_class, bIsPercent, bShowBackground, valueformat,item_class,value_text_class) {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("width", svgwidth);
    svg.setAttribute("height", svgheight);
    svg.setAttribute("fill","transparent");
    svg.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"svg");

    mydatavalues = Array(mydatainput[0].length);
    for (x=0; x < mydatavalues.length;x++)
    {
        mydatavalues[x]=mydatainput[0][x];
    }
    bHorizontalLines = bShowScales;

    var chartwidth = svgwidth;
    var chartheight =svgheight;

    if (bShowLegend) { chartwidth = chartwidth - 50; }
//    if (chartheight != chartwidth) { chartheight = chartwidth; }

    value_multiplier=1;
    var max_value_on_scale = 0;
    for (x=0;x<mydatainput.length; x++)
    {
        for (y=0;y<mydatainput[x].length;y++)
        {
            if (mydatainput[x][y] > max_value_on_scale)
            {
                max_value_on_scale=mydatainput[x][y];
            }
        } 
    }
    value_multiplier=100/max_value_on_scale;

    for (x=0; x < mydatavalues.length;x++)
    {
        mydatavalues[x]=mydatainput[0][x]*value_multiplier;
    }
    
    
    percentage_suffix = "%";

    if (bIsPercent == false) {
        percentage_suffix = "";
    //    max_value_on_scale = calculate_mylinedata(max_value_on_scale, mylinedata);
    }  else
    {
         if (valueformat=="") { valueformat="%d"; percentage_suffix="%"; }
    } 
    heightmultiplier = 1.5;
 //   linewidth = (chartwidth) / mylinedata[0].length;

    //--------------- CHART LABELS -------------------------------------//
    // LABEL ON TOP
    if (chart_label_position=="top")
    {
            chart_label_text_array=chart_label.split("[CR]");
            for (i=0;i<chart_label_text_array.length; i++)            {
               svg.appendChild(write_line_of_text(chart_label_text_array[i],50,15+(15*i),"#333",chart_label_class));
            }
    }
    // LABEL ON BOTTOM
    if (chart_label_position=="bottom")
    {
            chart_label_text_array=chart_label.split("[CR]");
            for (i=0;i<chart_label_text_array.length; i++)        {    
             svg.appendChild(write_line_of_text(chart_label_text_array[i],50,chartheight + 25+(15*i),"#333",chart_label_class));
            }
    }      
    // FOOTNOTES
    if (footnotes!="")
    {
        afootnotes=footnotes.replace("[CR]","\n").split("\n");       
        vpos=0;
        for (f=0; f < afootnotes.length; f++)        {
            svg.appendChild(write_line_of_text(afootnotes[f],50,chartheight+30+vpos,"#333",footnotes_class));
            vpos+=9;
        }
    }   
    // BACKGROUND
    if (bShowBackground == true)    {
        svg.appendChild(get_background(tcc_background_color,50,50,chartwidth,chartheight));
    }
    
    //ADD THE CIRCLE
    //recalculate mydata
    var total = 0;

    var circle_multiplier = 1;
    for (y = 0; y < mydatavalues.length; y++) {
        total = total + mydatavalues[y];
    }
    var mydata = Array(mydatavalues.length);
    for (x = 0; x < mydatavalues.length; x++) {
        mydata[x] = (mydatavalues[x] / total) * 360;
    }

    
    real_width=Math.min(chartwidth,chartheight);
    var my_center = { "x": real_width/2, "y": real_width/2 };  // M
    var my_radius = my_center.x*1/2;//2/3;  // A

    var next_x_point = 0;
    var next_y_point = 0;

    var my_running_line = { "x": 0, "y": 0 }; // start at the starting line
    my_running_line.x = my_center.x;
    my_running_line.y = my_center.y - my_radius;

    //my_item_points=['item1','item2','item3','item4','item5','item6','item7'];
    //vps=[[100,95,50,75,100,25,97],[68,71,41,99,55,42,40]]
   //myitems, myitempts, mydatainput
    my_item_points=myitempts;
    vps=mydatainput;
   
    var next_angle = 0; // sin,cos 0.01745240643728351 0.9998476951563913
    var running_angle = 0; // cummulative angle
    var next_sin = 0;
    var next_cos = 0;
    

    // BUILDING THE VARIABLE ITEMS
    for (x = 0; x < my_item_points.length; x++) {
        next_angle = (360.0/my_item_points.length);//my_data_points[x];
        next_color = "transparent";//colors[x];
            running_angle = running_angle + next_angle;
            next_sin = Math.sin(running_angle * Math.PI / 180);
            next_cos = Math.cos(running_angle * Math.PI / 180);
            next_x_point = my_center.x + (next_sin * my_radius);
            next_y_point = my_center.y - (next_cos * my_radius);

            next_text_x_point = next_x_point;//my_center.x + (next_text_sin * (my_radius / 2));
            next_text_y_point = next_y_point;// my_center.y - (next_text_cos * (my_radius / 2));

            var mld2 =document.createElementNS("http://www.w3.org/2000/svg", "line");
                mld2.setAttribute("x1", my_center.x);
                mld2.setAttribute("x2", next_x_point);
                mld2.setAttribute("y1", my_center.y);
                mld2.setAttribute("y2", next_y_point);  
                mld2.setAttribute("stroke", "black");  
                mld2.setAttribute("stroke-width", "1");
                svg.appendChild(mld2);  

            var lt1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            if (next_text_x_point >= my_center.x) 
            {   lt1.setAttribute("x", next_text_x_point);
                }else
             {   lt1.setAttribute("x", next_text_x_point-50);
                }    
            lt1.setAttribute("y", next_text_y_point);
            lt1.setAttribute("fill", "#000");
            lt1.setAttribute("class", "circlevalues");
            lt1.textContent = my_item_points[x];//valueformat.replace("%d", mydatavalues[x]).replace("[[value]]", mydatavalues[x]).replace("[value]", mydatavalues[x]); // mydatavalues[x]+percentage_suffix;
            svg.appendChild(lt1);
            my_running_line.x = next_x_point;
            my_running_line.y = next_y_point;
    }


    // ADDING THE DATA 
    var my_poly_points = new Array();

    for (item_ctr=0;item_ctr < vps.length; item_ctr++)
    {
        next_color=colors[item_ctr]
        my_running_line.x = my_center.x;
        my_running_line.y = my_center.y - my_radius;


        next_angle = 0; // sin,cos 0.01745240643728351 0.9998476951563913
        running_angle = 0; // cummulative angle
        next_sin = 0;
        next_cos = 0;
        v2x=Array(vps.length);
        v2y=Array(vps.length);
    
        my_points=""
        for (p =0; p < vps[item_ctr].length; p++)
        {
            next_percentage_val=(vps[item_ctr][p]*.01*value_multiplier)*my_radius;// this myst be a percentage
     
            for (x = 0; x < my_item_points.length; x++) {
                next_angle = (360.0/my_item_points.length);
                
                running_angle = running_angle + next_angle;
                next_sin = Math.sin(running_angle * Math.PI / 180);
                next_cos = Math.cos(running_angle * Math.PI / 180);
                next_x_point = my_center.x + (next_sin * next_percentage_val);
                next_y_point = my_center.y - (next_cos * next_percentage_val);
                
                if(x==p)
                {
                    v2x[x]=next_x_point;
                    v2y[x]=next_y_point;
                    if (my_points=="") { my_points=  next_x_point+","+ next_y_point; } else { my_points=my_points+" "+  next_x_point+","+ next_y_point;  }
                }
            }
        }
        my_poly_points.push(my_points);
        // LOOPING THROUGH THE ITEM POINTS
        for (x = 0; x < my_item_points.length; x++) {
            next_angle = (360.0/my_item_points.length);//my_data_points[x];
            running_angle = running_angle + next_angle;
            next_sin = Math.sin(running_angle * Math.PI / 180);
            next_cos = Math.cos(running_angle * Math.PI / 180);
            next_x_point = my_center.x + (next_sin * my_radius);
            next_y_point = my_center.y - (next_cos * my_radius);

               if (x == 0)
                {
                    var v2 =document.createElementNS("http://www.w3.org/2000/svg", "line");
                        v2.setAttribute("x1", v2x[x]);
                        v2.setAttribute("x2", v2x[(v2x.length-1)]);
                        v2.setAttribute("y1", v2y[x]);
                        v2.setAttribute("y2", v2y[(v2y.length-1)]);  
                        v2.setAttribute("stroke", next_color);  
                        v2.setAttribute("stroke-width", "1");
                        v2.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"radar"+item_ctr+"-"+x);
                        svg.appendChild(v2); 
                } else
                {
                    var v2 =document.createElementNS("http://www.w3.org/2000/svg", "line");
                        v2.setAttribute("x1", v2x[x-1]);
                        v2.setAttribute("x2", v2x[x]);
                        v2.setAttribute("y1", v2y[x-1]);
                        v2.setAttribute("y2", v2y[x]);  
                        v2.setAttribute("stroke", next_color);  
                        v2.setAttribute("stroke-width", "1");
                        v2.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"radar"+item_ctr+"-"+x);
                        svg.appendChild(v2);  
                }

                my_running_line.x = next_x_point;
                my_running_line.y = next_y_point;
            }
            //svg.appendChild(pg); 
        }
//        alert(my_poly_points[0]);
        for (x=0; x < my_poly_points.length; x++)
        {
            pg =document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            pg.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"radar-poly"+x);
            //pg.setAttribute("points","220,10 220,40 350,242 170,250 123,234");
            pg.setAttribute("points",my_poly_points[x]);
            pg.setAttribute("style","fill:"+colors[x]+";stroke:purple;stroke-width:1;fill-opacity:0.6;");
            pg.setAttribute("onclick","tcc_item_radar_click('radar','"+div_id+"-"+tcc_div_chart_counter+"svg','"+div_id+"-"+tcc_div_chart_counter+"radarchart-legendtext"+x+"','"+div_id+"-"+tcc_div_chart_counter+"radar','"+my_item_points.length+"','"+x+"');");
            svg.appendChild(pg); 
        }
    

    //--------------- ADD THE LEGEND -------------------------------------//
    if (bShowLegend) {
        for (x = 0; x < myitems.length; x++) {
            var lr1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            lr1.setAttribute("x", chartwidth-15);
            lr1.setAttribute("width", 10);
            lr1.setAttribute("y", 50 + (x * 15));
            lr1.setAttribute("height", 10);
            lr1.setAttribute("fill", colors[x]);
            lr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"radarchart-legendbox"+x);
            svg.appendChild(lr1);
            var lt1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            lt1.setAttribute("x", chartwidth);
            lt1.setAttribute("y", 50 + (x * 15) + 10);
            lt1.setAttribute("fill", "#333");
            lt1.setAttribute("class", "legendtext");
            lt1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"radarchart-legendtext"+x);
            lt1.textContent = myitems[x];
            svg.appendChild(lt1);

            var hlr1 =document.createElementNS("http://www.w3.org/2000/svg", "rect");
                hlr1.setAttribute("x", chartwidth-15);
                hlr1.setAttribute("width", 100);
                hlr1.setAttribute("y", 50+(x*15));
                hlr1.setAttribute("height", 10);
                hlr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"radarchart-legendhidden"+x);
                hlr1.setAttribute("fill", "transparent");
                hlr1.setAttribute("onclick","tcc_item_radar_click('radar','"+div_id+"-"+tcc_div_chart_counter+"svg','"+div_id+"-"+tcc_div_chart_counter+"radarchart-legendtext"+x+"','"+div_id+"-"+tcc_div_chart_counter+"radar','"+my_item_points.length+"','"+x+"');");
                svg.appendChild(hlr1);   
        }
    }

    document.getElementById(div_id).appendChild(svg);
    tcc_div_chart_counter+=1;
}  //------------------------------ END FUNCTION BUILD RADAR CHART---------------------------------------------------//

















function calculate_mylinedata(max_value_on_scale,mylinedata)
{
	    for (x=0; x < mylinedata[0].length; x++)
	    {
	 	for (y=0; y< mylinedata.length; y++)
	        {
			if(max_value_on_scale<mylinedata[y][x])
			{
				max_value_on_scale=mylinedata[y][x];
			}
		}
	    }
	if(parseInt(max_value_on_scale)<=100)
	{
		if(parseInt(max_value_on_scale)<100)
		{
		    if (parseInt(max_value_on_scale)<20)
		    {
			    max_value_on_scale=parseInt(max_value_on_scale)+5;		    
		    } else
		    {
			    max_value_on_scale=parseInt(max_value_on_scale/20)*20+20;
			}
		}
	} else
	{
		if(parseInt(max_value_on_scale)<10000)
		{
			max_value_on_scale=parseInt(max_value_on_scale/200)*200+200;
		}
	}
	return max_value_on_scale;
}

function replace_all(stg,from,to)
{
    if  (stg.indexOf(from)>=0)
    {
        while (stg.indexOf(from)>=0)
        {
            stg=stg.replace(from,to);
        }
    }
return stg
}

function shade(ncolor,dir)
{
    if (ncolor.indexOf("#")>=0)
    {
	if (dir=="d")
	{
		while  (ncolor.indexOf("1")>=0){ncolor=ncolor.replace("1","0");}
		while  (ncolor.indexOf("2")>=0){ncolor=ncolor.replace("2","1");}
		while  (ncolor.indexOf("3")>=0){ncolor=ncolor.replace("3","2");}
		while  (ncolor.indexOf("4")>=0){ncolor=ncolor.replace("4","3");}
		while  (ncolor.indexOf("5")>=0){ncolor=ncolor.replace("5","4");}
		while  (ncolor.indexOf("6")>=0){ncolor=ncolor.replace("6","5");}
		while  (ncolor.indexOf("7")>=0){ncolor=ncolor.replace("7","6");}
		while  (ncolor.indexOf("8")>=0){ncolor=ncolor.replace("8","7");}
		while  (ncolor.indexOf("9")>=0){ncolor=ncolor.replace("9","8");}
		while  (ncolor.indexOf("a")>=0){ncolor=ncolor.replace("a","9");}
		while  (ncolor.indexOf("b")>=0){ncolor=ncolor.replace("b","a");}
		while  (ncolor.indexOf("c")>=0){ncolor=ncolor.replace("c","b");}
		while  (ncolor.indexOf("d")>=0){ncolor=ncolor.replace("d","c");}
		while  (ncolor.indexOf("e")>=0){ncolor=ncolor.replace("e","d");}
		while  (ncolor.indexOf("f")>=0){ncolor=ncolor.replace("f","e");}
	}	
	else
	{
		while  (ncolor.indexOf("e")>=0){ncolor=ncolor.replace("e","f");}
		while  (ncolor.indexOf("d")>=0){ncolor=ncolor.replace("d","e");}
		while  (ncolor.indexOf("c")>=0){ncolor=ncolor.replace("c","d");}
		while  (ncolor.indexOf("b")>=0){ncolor=ncolor.replace("b","c");}
		while  (ncolor.indexOf("a")>=0){ncolor=ncolor.replace("a","b");}
		while  (ncolor.indexOf("9")>=0){ncolor=ncolor.replace("9","a");}
		while  (ncolor.indexOf("8")>=0){ncolor=ncolor.replace("8","9");}
		while  (ncolor.indexOf("7")>=0){ncolor=ncolor.replace("7","8");}
		while  (ncolor.indexOf("6")>=0){ncolor=ncolor.replace("6","7");}
		while  (ncolor.indexOf("5")>=0){ncolor=ncolor.replace("5","6");}
		while  (ncolor.indexOf("4")>=0){ncolor=ncolor.replace("4","5");}
		while  (ncolor.indexOf("3")>=0){ncolor=ncolor.replace("3","4");}
		while  (ncolor.indexOf("2")>=0){ncolor=ncolor.replace("2","3");}
		while  (ncolor.indexOf("1")>=0){ncolor=ncolor.replace("1","2");}
	}
	}
return ncolor;
}	

function check_color(ncolor)
{
if (ncolor=="red") { ncolor="#ff0000";}
if (ncolor=="green") { ncolor="#00ff00";}
if (ncolor=="blue") { ncolor="#0000ff";}
if (ncolor=="yellow") { ncolor="#ffff00";}
if (ncolor=="grey") { ncolor="#cococo";}

return ncolor;
}


function tcc_item_click(this_charttype,svgid,objid,lineid,num,num2)
{
    //alert(this_charttype)
	svgDoc=document.getElementById(svgid);
	// HIDE THE ITEMS
	e=svgDoc.getElementById(objid);
	if (e.style.display == 'none') { e.style.display='block'; }
	   else {e.style.display='none';}
	eb=svgDoc.getElementById(objid.replace("text","box"));
	if (eb.style.display == 'none') { eb.style.display='block'; }
	   else {eb.style.display='none';}

	if (this_charttype=="wave")
	{
		w2=svgDoc.getElementById(lineid.replace("line","poly")+num2);
		if (w2.style.display == 'none') { w2.style.display='block'; }
	   	else {w2.style.display='none';}
	}


	i=0;
	if ((this_charttype=="line") || (this_charttype=="radar") || (this_charttype=="wave"))
	{
		while (i <= num)
		{
			if (i < num-1)
			{
				l2=svgDoc.getElementById(lineid+i+"-"+num2);
				if (l2.style.display == 'none') { l2.style.display='block'; }
	   			else {l2.style.display='none';}
			}
			if (i < num)
			{
				c2=svgDoc.getElementById(lineid.replace("line","circle")+i+"-"+num2);
				if (c2.style.display == 'none') { c2.style.display='block'; }
	   			else {c2.style.display='none';}
			}
			
			lb2=svgDoc.getElementById(lineid.replace("line","label")+i+"-"+num2);
			if (lb2.style.display == 'none') { lb2.style.display='block'; }
	   		else {lb2.style.display='none';}
            
            
			i+=1;
		}	
	} // end line chart
	
	i=0;
	if (this_charttype=="bar")
	{
		while (i <= num)
		{
    		if (i < num-1)
			{
				l2=svgDoc.getElementById(lineid+i+"-"+num2);
				if (l2.style.display == 'none') { l2.style.display='block'; }
	   			else {l2.style.display='none';}
			}

			i+=1;
		}	
	} // end bar chart
}

function tcc_item_radar_click(this_charttype,svgid,objid,lineid,num,item_number)
{
	svgDoc=document.getElementById(svgid);
	// HIDE THE ITEMS
	e=svgDoc.getElementById(objid);
	if (e.style.display == 'none') { e.style.display='block'; }
	   else {e.style.display='none';}
	eb=svgDoc.getElementById(objid.replace("text","box"));
	if (eb.style.display == 'none') { eb.style.display='block'; }
	   else {eb.style.display='none';}

	i=0;
	rp=svgDoc.getElementById(lineid+"-poly"+item_number);
	if (rp.style.display == 'none') { rp.style.display='block'; }
	else {rp.style.display='none';}
	
	while (i <= num)
		{
		
			l2=svgDoc.getElementById(lineid+item_number+"-"+i);
			if (l2.style.display == 'none') { l2.style.display='block'; }
	   		else {l2.style.display='none';}
/*
			lb2=svgDoc.getElementById(lineid.replace("radar","label")+i+"-"+num2);
			if (lb2.style.display == 'none') { lb2.style.display='block'; }
	   		else {lb2.style.display='none';}
*/
			i+=1;
		}	
	
}

function tcc_item_bar_click(this_charttype,svgid,objid,barid,num,num2,borderid,shadectr)
{
    svgDoc=document.getElementById(svgid);
	// HIDE THE ITEMS
	legendbox=svgDoc.getElementById(objid);
	if (legendbox != undefined)  {
	    if (legendbox.style.display == 'none') { legendbox.style.display='block'; }
	    else {legendbox.style.display='none';}
	}
	
	eb=svgDoc.getElementById(objid.replace("text","box"));
	if (eb != undefined)  {
	    if (eb.style.display == 'none') { eb.style.display='block'; }
	       else {eb.style.display='none';}
    }
	i=0;
	while (i <= num)
	{
		l2=svgDoc.getElementById(barid+i+"-"+num2);
		if (l2.style.display == 'none') { l2.style.display='block'; }
		else {l2.style.display='none';}
		t2=svgDoc.getElementById(barid+"text"+i+"-"+num2);
		if (t2.style.display == 'none') { t2.style.display='block'; }
		else {t2.style.display='none';}
		if (borderid != "")
		{
		    l2top=svgDoc.getElementById(borderid+"top"+i+"-"+num2);
		    if (l2top != undefined)  {
	            if (l2top.style.display == 'none') { l2top.style.display='block'; }
		        else {l2top.style.display='none';}
		    }
		    l2bottom=svgDoc.getElementById(borderid+"bottom"+i+"-"+num2);
		    if (l2bottom != undefined)  {
		        if (l2bottom.style.display == 'none') { l2bottom.style.display='block'; }
		        else {l2bottom.style.display='none';}
		    }
		    l2right=svgDoc.getElementById(borderid+"right"+i+"-"+num2);
		    if (l2right != undefined)  {
		        if (l2right.style.display == 'none') { l2right.style.display='block'; }
		        else {l2right.style.display='none';}   	
		    }
		}

		if (shadectr >0)
		{
	
		    for(j=shadectr; j >=0;j--)
		    {
		        if (j >= 0)
		        {
		            l2=svgDoc.getElementById(barid+"topshade-"+j+"-"+i+"-"+num2);
		            if (l2 != undefined)  {
		                if (l2.style.display == 'none') { l2.style.display='block'; }
		                else {l2.style.display='none';}
		            }
		            l2b=svgDoc.getElementById(barid+"bottomshade-"+j+"-"+i+"-"+num2);
		            if (l2b != undefined)  {    
		            if (l2b.style.display == 'none') { l2b.style.display='block'; }
		            else {l2b.style.display='none';}
		            }
		            l2c=svgDoc.getElementById(barid+"rightshade-"+j+"-"+i+"-"+num2);
		            if (l2c != undefined)  {    
		            if (l2c.style.display == 'none') { l2c.style.display='block'; }
		            else {l2c.style.display='none';}	
		            }
		        }
		    }
		}		
		i+=1;
	}	
}	
	
function tcc_item_column_click(this_charttype,svgid,objid,lineid,num,num2,borderid,column_shadectr)
{  //lr1.setAttribute("id",div_id+"-"+tcc_div_chart_counter+"columntopshade-"+shadectr+"-"+x+"-"+y);
	svgDoc=document.getElementById(svgid);
	// HIDE THE ITEMS
	legendbox=svgDoc.getElementById(objid);
	if (legendbox != undefined)  {
	    if (legendbox.style.display == 'none') { legendbox.style.display='block'; }
	    else {legendbox.style.display='none';}
	}
	
	eb=svgDoc.getElementById(objid.replace("text","box"));
	if (eb != undefined)  {
	    if (eb.style.display == 'none') { eb.style.display='block'; }
	       else {eb.style.display='none';}
    }

	i=0;
	while (i <= num)
	{
		l2=svgDoc.getElementById(lineid+i+"-"+num2);
		if (l2 != undefined) {
		    if (l2.style.display == 'none') { l2.style.display='block'; }
		    else {l2.style.display='none';}
		}
		t2=svgDoc.getElementById(lineid+"text"+i+"-"+num2);
		if (t2 != undefined) {
		    if (t2.style.display == 'none') { t2.style.display='block'; }
		    else {t2.style.display='none';}
		}

		if (borderid != "")
		{
		    l2top=svgDoc.getElementById(borderid+"top"+i+"-"+num2);
		    if (l2top.style.display == 'none') { l2top.style.display='block'; }
		    else {l2top.style.display='none';}
		    l2left=svgDoc.getElementById(borderid+"left"+i+"-"+num2);
		    if (l2left.style.display == 'none') { l2left.style.display='block'; }
		    else {l2left.style.display='none';}
		    l2right=svgDoc.getElementById(borderid+"right"+i+"-"+num2);
		    if (l2right.style.display == 'none') { l2right.style.display='block'; }
		    else {l2right.style.display='none';}   	
		}
		
		if (column_shadectr >0)
		{
		    
		    for(j=column_shadectr; j >=0;j--)
		    {
		        if (j > 0)
		        {
		            l2=svgDoc.getElementById(lineid+"topshade-"+j+"-"+i+"-"+num2);
		            if (l2.style.display == 'none') { l2.style.display='block'; }
		            else {l2.style.display='none';}
		            l2b=svgDoc.getElementById(lineid+"leftshade-"+j+"-"+i+"-"+num2);
		            if (l2b.style.display == 'none') { l2b.style.display='block'; }
		            else {l2b.style.display='none';}
		            l2c=svgDoc.getElementById(lineid+"rightshade-"+j+"-"+i+"-"+num2);
		            if (l2c.style.display == 'none') { l2c.style.display='block'; }
		            else {l2c.style.display='none';}	
		        }
		        l2bs=svgDoc.getElementById(lineid+"leftshadeshadow-"+j+"-"+i+"-"+num2);
		        if (l2bs != undefined)
		        {
		            if (l2bs.style.display == 'none') { l2bs.style.display='block'; }
		            else {l2bs.style.display='none';}
		        }
		    }
		}
		i+=1;
	}		

}


	let ec_table_counter=0;
	let ec_add_checkbox=false;
	
	class EcTables{
		constructor(divid,data)
		{
			this.div_id=divid;
			this.data=data;
			this.table_index=ec_table_counter;
			this.first_column_answers=true;
			if (!(this.div_id==undefined) && !(this.data==undefined)) {
			this.build_table();
			ec_table_counter+=1;
			}
		}
		build_table(div_id,mydata){
		    if(div_id == undefined) {div_id=this.div_id; }
		    if(mydata == undefined) {mydata=this.data; }
			var mydiv=document.getElementById(div_id);
			if (ec_add_checkbox==true){
				var mydiv_row1=document.createElement("div");
				mydiv_row1.innerHTML="<input type=checkbox id='ck_"+div_id+"checkall' onclick='ectable_check_all(\"ck_"+div_id+"\",this.checked);'>";
				mydiv.appendChild(mydiv_row1);
			}
			var mydiv_row2=document.createElement("div");
			mydiv.appendChild(mydiv_row2);

			var mytable=document.createElement("table");
			mytable.setAttribute("id", "my_ec_table_"+div_id);
			mytable.className="ec_table";
			//mytable.setAttribute("class","ec_table");
								
			var theader=document.createElement("thead");
			var tbody=document.createElement("tbody");
			mytable.appendChild(theader);
			mytable.appendChild(tbody);
			mydata.forEach( (row,index) => { 
				if (index==0){					
					var headerrow=document.createElement("tr");
					theader.appendChild(headerrow);
					//var emptycell=document.createElement("th");
					//emptycell.innerHTML="";
					//headerrow.appendChild(emptycell);
					row.forEach( (item,item_index ) => {
						var newcell = document.createElement("th");
						newcell.innerHTML = item;
						newcell.className="ec_th";
						headerrow.appendChild(newcell);
					}); 					
				} else {
					var newtr=document.createElement("tr");
					newtr.className="ec_tr";
					if ((this.first_column_answers==false)&&(ec_add_checkbox==true) )   {
						var checkbox=document.createElement("td");
						checkbox.className="ec_td";
						checkbox.innerHTML = "<input type=checkbox id='ck_"+div_id+index+"' name='ck_"+div_id+"' '>";
						//checkbox.innerHTML = "<input type=checkbox id='ck_"+div_id+index+"' name='ck_"+div_id+"' onclick='ectable_get_checked_items_list(\"ck_"+div_id+"\");'>";
						newtr.appendChild(checkbox);
					}
					 row.forEach( (item,item_index ) => {
							if ((this.first_column_answers==true) && (item_index==0) &&(ec_add_checkbox==true)){
								var newcell = document.createElement("td");
								newcell.className="ec_td";
								newcell.innerHTML = "<input type=checkbox id='ck_"+div_id+index+"' name='ck_"+div_id+"' >"+item;
								//newcell.innerHTML = "<input type=checkbox id='ck_"+div_id+index+"' name='ck_"+div_id+"' onclick='ectable_get_checked_items_list(\"ck_"+div_id+"\");'>"+item;
								newtr.appendChild(newcell);
							} else {
								var newcell = document.createElement("td");
								newcell.className="ec_td";
								if (item instanceof Array == false) {
								   newcell.innerHTML =  item;
								} else {
									var tinytable=document.createElement("table");
									tinytable.setAttribute("style","border: 0px none transparent;");
									newcell.appendChild(tinytable);
									item.forEach( (next_line) => {
										var tinyrow=document.createElement("tr");
										tinyrow.setAttribute("style","border: 0px none transparent;background-color: transparent;");
										tinytable.appendChild(tinyrow);
										var tinytd =document.createElement("td");
										tinytd.setAttribute("style","border: 0px none transparent;background-color: transparent;");
										tinytd.innerHTML=next_line;
										tinyrow.appendChild(tinytd);
										});
								}
								newtr.appendChild(newcell);
							}
						});
					tbody.appendChild(newtr);
				}
			});
			mydiv_row2.appendChild(mytable);
		} // end build_table method
	}  // end Class EcTable definition


function string_replace_to(original_string,item_to_replace,replace_to)
{
	while(original_string.toString().indexOf(item_to_replace)>0)
	{
		original_string=original_string.toString().replace(item_to_replace,replace_to);
	}
	return original_string;
}



function tcc_ectable_get_checked_items_list(name)
		{
			var items=document.getElementsByName(name); 
			var checked_items=Array();
			items.forEach((row,index) => {
					var nextitem=document.getElementById(name+(index+1));
					if (nextitem.checked) {checked_items.push(index); }
			});
			//alert(checked_items);
			//alert(ec_table_counter);
			return checked_items;
		}

function tcc_ectable_check_all(name,yesorno)
		{
			var items=document.getElementsByName(name); 
			items.forEach((row,index) => {
					var nextitem=document.getElementById(name+(index+1));
					nextitem.checked=yesorno;
					});
		}




