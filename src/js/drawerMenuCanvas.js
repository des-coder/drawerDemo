
var c = document.getElementById("menu");
var ctx = c.getContext("2d");

var width = 200;
var height = 512;

c.width = width;
c.height = height;

var mousePosMenu = {x:0, y:0};
var mousePosCanvas = {x:0, y:0};

var drawer = new drawerCanvas(1);

c.addEventListener('click', menuClick, false);
//drawer.c.addEventListener('click', canvasClick, false);
drawer.c.addEventListener('mousedown', canvasDownClick, false);
drawer.c.addEventListener('mouseup', canvasUpClick, false);

window.addEventListener('mousemove', windowmouseMove, false);

var tools = document.getElementById("tools");

var colourPick = document.createElement("INPUT")
colourPick.setAttribute("class", "jscolor");

colourPick.addEventListener('change', (e) =>{ console.log(e); drawer.currentColour = "#" + e.target.value;});

tools.appendChild(colourPick);

tools.style.width = width;
tools.style.height = height;

colourPick.style.width = width;
colourPick.style.height = 25;

colourPick.value = "#d9b38c";
drawer.currentColour = "#d9b38c";


var outCanvas = document.createElement("canvas");
var imgDwn = document.createElement('a');
imgDwn.setAttribute("download", "export.png");

var imgUpSelect = document.createElement('INPUT');
imgUpSelect.setAttribute("type", "file");
imgUpSelect.setAttribute("accept", "image/png, image/jpeg");
imgUpSelect.addEventListener('change', loadFile);


buttons = [];

class Button{
	constructor(x,y,width,height,text,func, toggle = false){
		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;
		this._text = text;
		this._func = func;
		this._toggle = toggle;
		this._toggleState = false;
		
		buttons.push(this);
		
		this.drawNormal();
	}
	
	drawBtn(fillColour){
		ctx.beginPath();
		ctx.rect(this._x, this._y, this._width, this._height);
		ctx.fillStyle = fillColour; 
		ctx.fillRect(this._x, this._y, this._width, this._height);
		ctx.fill(); 
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#000000'; 
		ctx.stroke();
		ctx.closePath();
		ctx.font = (this._height/2) + 'pt Arial';
		ctx.fillStyle = '#000000';
		ctx.textAlign = "center";
		ctx.fillText(this._text, this._x + this._width / 2, this._y + this._height * (3/4), this._width *0.8);
	}
	
	drawNormal(){
		if (this._toggle && this._toggleState){
			this.drawBtn('grey');
			return;
		}
		this.drawBtn('lightgrey');
	}
	
	drawHighlighted(){
		if (this._toggle && this._toggleState){
			this.drawBtn('lightgrey');
			return;
		}
		this.drawBtn('grey');
	}
	
	get x1(){
		return this._x;
	}	
	get y1(){
		return this._y;
	}
	get x2(){
		return this._x + this._width;
	}
	get y2(){
		return this._y + this._height;
	}
	
	get func(){
		if (this._toggle) this._toggleState = !this._toggleState;
		return this._func;
	}
	
	inside(x,y){
		return (x <= this.x2) && (x >= this.x1) && (y <= this.y2) && (y >= this.y1)
	}
}

function isoDraw(){
	drawer.turnIso();
}
function normalDraw(){
	drawer.turnNormal();
}

function foo(){
	console.log("bar");
}

new Button(10,5,180,50, "Isometric", isoDraw);
new Button(10,80,180,50, "Normal", normalDraw);
//new Button(10,155,180,50, "Import", () =>{imgUpSelect.click();});
new Button(10,155,180,50, "Change Size", () =>{
	
	var size = parseInt(prompt("New Size:"));
	
	if (size <= 0 || isNaN(size)){
		size = 1;
	}
	
	if (size > 8){
		size = 8;
	}
	drawer._tile_size = size;
	drawer.tileSize(drawer._tile_size);
	});
new Button(10,230,180,50, "Export", saveFile);
//new Button(10,305,180,50, "Export Split", saveFileSplit);
new Button(10,305,180,50, "Undo", undo);
new Button(10,380,180,50, "Clear Canvas", clearCanvas);
new Button(10,455,180,50, "Toggle Line", () =>{if(drawer.lineTool){drawer.lineTool = 0}else{drawer.lineTool = 1}}, true);


function clearCanvas(){
	for (y = 0; y < drawer.grid_size; y++){
		for (x = 0; x < drawer.grid_size; x++){
			drawer.grid[x + y*drawer.grid_size] = '#FFFFFF00'
		}
	}
	
	gridHistory = [drawer.grid];
	first_undo = true;
	
	drawer.tileSize(drawer._tile_size);
}

function saveFileSplit(){
	
	outCanvas.width = drawer.tile_pixel_size;
	outCanvas.height = drawer.tile_pixel_size;
	
	for (i_y = 0; i_y < drawer._tile_size ; i_y++){
		for (i_x = 0; i_x < drawer._tile_size ; i_x++){
			outCanvas.getContext("2d").clearRect(0, 0, outCanvas.width, outCanvas.height);
			imgDwn.setAttribute("download", "export_"+(i_x+i_y *drawer._tile_size) +".png");
		
			var xTile = 0;
			var yTile = 0;
		
			for (y = i_y * drawer.tile_pixel_size; y < drawer.tile_pixel_size  * (i_y+1); y++){
				xTile = 0;
				for (x = i_x * drawer.tile_pixel_size; x < drawer.tile_pixel_size  * (i_x+1); x++){
					if ( !((x + y*drawer.tile_pixel_size) in drawer.grid)){
						outCanvas.getContext("2d").fillStyle = '#FFFFFF00';
					}else{
						outCanvas.getContext("2d").fillStyle = drawer.grid[x + y*drawer.grid_size];
					}
					
					console.log('xy',x, y);
					console.log('xy tile',xTile, yTile);
					
					outCanvas.getContext("2d").fillRect(xTile, yTile, 1, 1);
					
					xTile +=  1;
				}
				yTile += 1;
			}
			
			imgDwn.setAttribute("href", outCanvas.toDataURL("image/png"));
			imgDwn.click();
		}
	}
}


function saveFile(){
	
	outCanvas.width = drawer.grid_size;
	outCanvas.height = drawer.grid_size;
	console.log(drawer.grid_size);
	
	outCanvas.getContext("2d").clearRect(0, 0, outCanvas.width, outCanvas.height);
	
	imgDwn.setAttribute("download", "export.png");
	
	for (y = 0; y < drawer.grid_size; y++){
		for (x = 0; x < drawer.grid_size; x++){
			if ( !((x + y*drawer.tile_pixel_size) in drawer.grid)){
				outCanvas.getContext("2d").fillStyle = '#FFFFFF00';
			}else{
				outCanvas.getContext("2d").fillStyle = drawer.grid[x + y*drawer.grid_size];
			}
			
			outCanvas.getContext("2d").fillRect(x, y, 1, 1);
		}
	}

	imgDwn.setAttribute("href", outCanvas.toDataURL("image/png"));
	imgDwn.click();
}

function loadFile(e){
	if (this.files && this.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			console.log(e);
			var imgUp = new Image();
			imgUp.src = e.target.result;
			
			imgUp.onload = function (ee){
			
				outCanvas.width = imgUp.width;
				outCanvas.height = imgUp.height;
				
				outCanvas.getContext("2d").scale(drawer.grid_size / outCanvas.width, drawer.grid_size / outCanvas.height);
				
				outCanvas.getContext("2d").drawImage(imgUp,0,0);
				
				console.log(drawer.grid_size / outCanvas.width);
				
				var i = new Image();
				i.src = outCanvas.toDataURL("image/png");
				
				i.onload = function (){
					outCanvas.width = i.width;
					outCanvas.height = i.height;
					
					outCanvas.getContext("2d").scale(outCanvas.width / drawer.c.width, outCanvas.height / drawer.c.height);
					
					outCanvas.getContext("2d").drawImage(i,0,0);
					
					
					var ii = new Image();
					ii.src = outCanvas.toDataURL("image/png");
					ii.onload = function (){
						drawer.ctx.drawImage(ii,0,0);
					}
				}
			}

			};
			
		drawer.ctx.clearRect(0, 0, drawer.width,drawer.height);
	
		reader.readAsDataURL(this.files[0]);
	}
}

//ctx.resetTransform();

var first_undo = true;

function undo(){
	if(first_undo){
		gridHistory.pop();
		first_undo = false;
	}
	if(gridHistory.length >= 0){
		drawer.grid = Object.assign({}, gridHistory.pop());
		//console.log(drawer.grid);
	}	
	drawer.tileSize(drawer._tile_size);
}

var gridHistory = [drawer.grid];

function canvasDownClick(e){
	if(gridHistory.length == 0){
		gridHistory.push(Object.assign({}, drawer.grid));
	}
	canvasClick(e);
	drawer.shouldPaint = true;
}
function canvasUpClick(e){
	gridHistory.push(Object.assign({}, drawer.grid));
	first_undo = true;
	drawer.shouldPaint = false;
}

function windowmouseMove(e){
	var difx = e.clientX - ctx.canvas.offsetLeft;
	var dify = e.clientY - ctx.canvas.offsetTop;
	
	mousePosMenu.x = difx;
	mousePosMenu.y = dify;
	
	m = drawer.ctx.getTransform().invertSelf();
	
	difx = e.clientX - drawer.ctx.canvas.offsetLeft;
	dify = e.clientY - drawer.ctx.canvas.offsetTop;
	
	if (difx < 0 || difx > drawer.ctx.canvas.width || dify < 0 || dify > drawer.ctx.canvas.height){
		drawer.shouldPaint = false;
	}
	
	mousePosCanvas.x = difx * m.a + dify *m.c + m.e;
	mousePosCanvas.y = difx * m.b + dify * m.d + m.f;

	var curs = "default";

	for (btn of buttons){
		if (btn.inside(mousePosMenu.x, mousePosMenu.y)){
			btn.drawHighlighted();
			curs= "pointer";
		}else{
			btn.drawNormal();
		}
		
	}
	
	if (drawer.shouldPaint){
		canvasClick(e);
	}
	
	c.style.cursor = curs;
}

function canvasClick(e){
	drawer.click(mousePosCanvas.x,mousePosCanvas.y);
}

function menuClick(e){
	for (btn of buttons){
		if (btn.inside(mousePosMenu.x, mousePosMenu.y)){
			btn.func();
		}
	}
	return
}