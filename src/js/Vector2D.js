class Vector2D {
	constructor(x, y){
		this._x = x;
		this._y = y;
	}
	
	get x(){
		return this._x;
	}
	
	set x(x){
		this._x = x;
	}
	
	get y(){
		return this._y;
	}
	
	set y(y){
		this._y = y;
	}
	
	add( vector2D ){
		if (vector2D instanceof Vector2D){
			return new Vector2D(this._x + vector2D.x, this._y + vector2D.y);
		}else{
			console.log( "not a Vector2D" );
		}		
	}
	
	subtract( vector2D ){
		if (vector2D instanceof Vector2D){
			return new Vector2D(this._x - vector2D.x, this._y - vector2D.y);
		}else{
			console.log( "not a Vector2D" );
		}		
	}
	
	multiply( num ){		
		return new Vector2D(this._x * num, this._y * num);
	}
	
	divide( num ){		
		return new Vector2D(this._x / num, this._y / num);
	}
	
	equal( vector2D ){
		return (this._x == vector2D.x) && (this._y == vector2D.y);
	}
}