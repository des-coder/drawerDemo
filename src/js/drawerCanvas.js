class drawerCanvas{
	
	constructor( tile_size ){
		this.c = document.getElementById("canvas");
		this.ctx = this.c.getContext("2d");

		this.width = 512;
		this.height = 512;
		
		this.iso_matrix=[Math.sqrt(2)/2,Math.sqrt(2)/2*0.5,-Math.sqrt(2)/2,Math.sqrt(2)/2*0.5,this.width*0.75, this.height/4];
		
		this.c.width = this.width;
		this.c.height = this.height;
		
		this.tile_pixel_size = 32;
		this.grid={};
		this.grid_size = (this.tile_pixel_size * tile_size);
		
		this._tile_size = tile_size;
		
		this.tileSize(tile_size);
		
		this.shouldPaint = false;
		this.currentColour = 'blue'
		
		this.grid_pixel_size = this.tile_pixel_size * this.size;
		this.grid_pixel_width = this.width / this.grid_size;
		this.grid_pixel_height = this.height / this.grid_size;
		
		this.changeCursor();
		
		this.brushSize = 2;
		
		this.lineTool = 0;
		
		this.pointOne = {x:0, y:0};
		
		this.isIso = false;
		
	}
	
	changeCursor( cursor ){
		cursor = cursor || "crosshair";
		this.tool_cursor = cursor;
		this.c.style.cursor = this.tool_cursor;
	}

	click( x, y ){
		var xTile = Math.floor(x / this.grid_pixel_width);
		var yTile = Math.floor(y / this.grid_pixel_height);
		var tileNum = xTile + yTile * this.grid_size;

		if ( xTile >= 0 && xTile < this.grid_size && yTile >= 0 && yTile < this.grid_size){
			if (this.lineTool > 0){
				if (this.lineTool == 2){
					this.drawLine(this.pointOne.x, this.pointOne.y, xTile, yTile);
					this.lineTool = 1;
					this.tileSize(this._tile_size);
					this.changeCursor();
				}else{
					this.ctx.strokeStyle = 'yellow'; 
					this.changeCursor("n-resize");
					this.ctx.beginPath();
					this.ctx.rect(xTile * this.grid_pixel_width, yTile * this.grid_pixel_height, this.grid_pixel_width, this.grid_pixel_height);
					this.ctx.stroke();
					this.ctx.closePath();
					
					this.pointOne = {x:xTile, y:yTile};
					this.lineTool = 2;
				}
			}else{
				this.drawGridColour(xTile,yTile);
			}
		}
	}
	
	drawGridColour(x,y, col){
		col = col || this.currentColour;
		this.grid[x + y*this.grid_size] = col;
		this.drawGrid([{x:x, y:y}]);
	}
	
	drawLine(x1, y1, x2, y2){
		var x,y;
		
		console.log(x1,y1,x2,y2);
		
		if(x1 == x2){
			if(y1 < y2){
				for (y = y1; y <= y2; y++){
					this.drawGridColour(x1, y);
				}
			}
			else{
				for (y = y2; y <= y1; y++){
					this.drawGridColour(x1, y);
				}
			}
		}else{
			if(x1 < x2){
				for (x = x1; x <= x2; x++){
					y = Math.round((x-x1)*( (y2-y1) / (x2 - x1) ) + y1);
					this.drawGridColour(x, y);
				}
			}else{
				for (x = x2; x <= x1; x++){
					y =  Math.round((x-x1)*( (y2-y1) / (x2 - x1) ) + y1);
					this.drawGridColour(x, y);
				}
			}
		}
	}

	turnIso(){
		if(!this.isIso){
			this.c.width = this.width * 1.5;
			this.ctx.transform(this.iso_matrix[0],this.iso_matrix[1],this.iso_matrix[2],this.iso_matrix[3],this.iso_matrix[4],this.iso_matrix[5]);
			this.tileSize(this._tile_size);
			this.isIso = true;
		}
	}
	
	turnNormal(){
		if(this.isIso){
			this.c.width = this.width;
			this.ctx.resetTransform();
			this.tileSize(this._tile_size);
			this.isIso = false;
		}
	}
	
	drawGrid( listOfGrid ){
		var g = {};
		for (g of listOfGrid){
			var x = g.x;
			var y = g.y;
			
			if ( x >= 0 && x < this.grid_size && y >= 0 && y < this.grid_size){
				this.ctx.strokeStyle = 'lightgrey'; 
				this.ctx.beginPath();

				if((x%this.tile_pixel_size) == 0 || ((x+1)%this.tile_pixel_size) == 0 ||(y%this.tile_pixel_size) == 0 ||((y+1)%this.tile_pixel_size) == 0){
					this.ctx.strokeStyle = 'grey';
				}
				
				this.ctx.rect(x * this.grid_pixel_width, y * this.grid_pixel_height, this.grid_pixel_width, this.grid_pixel_height);
				this.ctx.stroke();

				this.ctx.fillStyle = this.grid[x + y*this.grid_size];
				this.ctx.fillRect(x * this.grid_pixel_width, y * this.grid_pixel_height, this.grid_pixel_width, this.grid_pixel_height);

				this.ctx.closePath();
			}
		}
	}

	tileSize( size ){
		this.ctx.clearRect(0, 0, this.width, this.height);
		
		this.ctx.lineWidth = 1
		
		this.grid_size = (this.tile_pixel_size * size)
		this.grid_pixel_width = this.width / this.grid_size;
		this.grid_pixel_height = this.height / this.grid_size;
		
		var x = 0, y;

		for (y = 0; y < this.grid_size; y++){
			for (x = 0; x < this.grid_size; x++){
				if ( !((x + y*this.grid_size) in this.grid)){
					this.grid[x + y*this.grid_size] = '#FFFFFF00'
				}
				this.drawGrid( [{x:x, y:y}] );
			}
		}
	}
}