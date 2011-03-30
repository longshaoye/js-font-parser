FontParticle = Class.extend({
		
	LINE_WIDTH:100,
	STROKE_STYLE:"#000000",
	FILL_STYLE:"#000000",
	GLOBAL_ALPHA:1,
	SCALE:.5,
	
	_currentGlyph:null,
	
    width:0,
    height:0,

    points:[],
	physicalPoints:[],

    i:null,
    canvas:null,
    context:null,
	fontdata: null,
	
	
// TODO - create a class for global functions like this one
inc: function(filename){
    var body = document.getElementsByTagName('body').item(0);
    script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';
    body.appendChild(script);
}

, init: function(path)
{
	var file = this.load_binary_resource(path);
	var bytedata = new a3d.ByteArray( file, a3d.Endian.BIG );
	this.fontdata = new RawFont( bytedata );
}

// setup styling for the char
, setProps: function( scale )
{
	this.SCALE = scale;
}

// setup styling for the char
, setStyle: function( lineWidth, strokeStyle, fillStyle, globalAlpha )
{
	this.LINE_WIDTH = lineWidth;
	this.STROKE_STYLE = strokeStyle
	this.FILL_STYLE = fillStyle;
	this.GLOBAL_ALPHA = globalAlpha;
}

, drawGlyph: function (  char, pcanvas, distance ) // TODO - why distance?.. maybe remove
{
        var SCALE = this.SCALE;
        var g = this.fontdata.getGlyph(char);
		var _distance = distance;
        

_currentGlyph = g;


		this.canvas = document.getElementById(pcanvas);
		this.context = this.canvas.getContext('2d');
		this.width = this.canvas.width;
        this.height = this.canvas.height;
				
		this.canvas.width = this.canvas.width; // reset

		this.context.lineWidth = this.LINE_WIDTH;
		this.context.strokeStyle = this.STROKE_STYLE;
        this.context.fillStyle = this.FILL_STYLE;
        this.context.beginPath();

        var firstindex=0;
        var counter=0;
        
		for(var i=0;i<g.getPointCount();i++)
		{
            counter++;			
            if( g.getPoint(i).endOfContour )
            {
                this.addContourToShapeNoCurves( g, firstindex, counter, SCALE, true );
                firstindex=i+1;
                counter=0;
            }
            else
            {
                //window.console.log("normal point");
            }   
        }
        this.context.closePath();
        this.context.stroke();
        this.context.fill();

        this.context.translate(_distance, 5);

        var self = this;  
        this.interval = setInterval( function(){ self.animate(); }, 1000/24 );
		
		// also pass it out so we can play with it further
		return context;
    }   
    
    
,addContourToShape: function ( glyph, startIndex, count, scale )
{
        if (glyph.getPoint(startIndex).endOfContour)
        {
            return;
        }
 
        offset = 0;
        
        while(offset < count)
        {
            var p0 = glyph.getPoint(startIndex + offset%count);
            var p1 = glyph.getPoint(startIndex + (offset+1)%count);

			this.addParticle(p0,scale,this.context);
			this.addParticle(p1,scale,this.context);

            if (offset == 0)
            {
                this.context.moveTo(p0.x*scale, p0.y*scale);
            }

            if (p0.onCurve)
            {
                if (p1.onCurve)
                {
                    this.context.lineTo(p1.x*scale, p1.y*scale);
                    offset++;
                }
                else
                {
                    var p2 = glyph.getPoint(startIndex + (offset+2)%count);
                    
					this.addParticle(p2,scale,this.context);

                    if(p2.onCurve)
                    {
                        this.context.quadraticCurveTo(p1.x*scale, p1.y*scale, p2.x*scale, p2.y*scale);
                    }
                    else
                    {
                        this.context.quadraticCurveTo(p1.x*scale, p1.y*scale, this.midValue(p1.x*scale, p2.x*scale), this.midValue(p1.y*scale, p2.y*scale));
                    }
                    
                    offset+=2;
                } 
            }
            else
            {
            
            if(!p1.onCurve)
            {
                this.context.quadraticCurveTo(p0.x*scale, p0.y*scale, this.midValue(p0.x*scale, p1.x*scale), this.midValue(p0.y*scale, p1.y*scale));
            }
            else
            {
                this.context.quadraticCurveTo(p0.x*scale, p0.y*scale, p1.x*scale, p1.y*scale);
            }
            
            offset++;
            
            }
        }
    }




	
,addContourToShapeNoCurves: function ( glyph, startIndex, count, scale, firstRun )
{
        if (glyph.getPoint(startIndex).endOfContour)
        {
            return;
        }
 
        offset = 0;
        
        while(offset < count)
        {
            var p0 = glyph.getPoint(startIndex + offset%count);
            var p1 = glyph.getPoint(startIndex + (offset+1)%count);



			
			if(firstRun)
			{
			//	window.console.log( "hey" );
				this.addParticle(p0,scale,this.context);
				this.addParticle(p1,scale,this.context);				
			}
			else
			{
			//	window.console.log( "yo" );
//									window.console.log( this.getParticle( offset ).x );
var				particle0 = this.getParticle( offset );
var				particle1 = this.getParticle( offset );
				
				p0.x = particle0.x *2;
				p0.y = particle0.y *2;				
				
				p1.x = particle1.x *2;
				p1.y = particle1.y *2;				
				
				// p0.x = p1.x*scale;
				// 		        p1.y = p1.y*scale;
				// 
									
			}
			
			
			

            if (offset == 0)
            {
                this.context.moveTo(p0.x*scale, p0.y*scale);
            }

            if (p0.onCurve)
            {					
                if (p1.onCurve)
                {
                    this.context.lineTo(p1.x*scale, p1.y*scale);
                    offset++;
                }
                else
                {
                    var p2 = glyph.getPoint(startIndex + (offset+2)%count);
                    
				//	this.addParticle(p2,scale,this.context);

                    if(p2.onCurve)
                    {
                        this.context.quadraticCurveTo(p1.x*scale, p1.y*scale, p2.x*scale, p2.y*scale);
                    }
                    else
                    {
                        this.context.quadraticCurveTo(p1.x*scale, p1.y*scale, this.midValue(p1.x*scale, p2.x*scale), this.midValue(p1.y*scale, p2.y*scale));
                    }
                    
                    offset+=2;
                } 
            }
            else
            {
            
            if(!p1.onCurve)
            {
                this.context.quadraticCurveTo(p0.x*scale, p0.y*scale, this.midValue(p0.x*scale, p1.x*scale), this.midValue(p0.y*scale, p1.y*scale));
            }
            else
            {
                this.context.quadraticCurveTo(p0.x*scale, p0.y*scale, p1.x*scale, p1.y*scale);
            }
            
            offset++;
            
            }
        }
    }



	,redrawLines: function ()
	{
		this.context.lineWidth = this.LINE_WIDTH;
		this.context.strokeStyle = this.STROKE_STYLE;
        this.context.fillStyle = this.FILL_STYLE;
        this.context.beginPath();

        var firstindex=0;
        var counter=0;
        
		for(var i=0;i<_currentGlyph.getPointCount();i++)
		{
            counter++;			
            if( _currentGlyph.getPoint(i).endOfContour )
            {
                this.addContourToShapeNoCurves( _currentGlyph, firstindex, counter, this.SCALE, false );
                firstindex=i+1;
                counter=0;
            }
            else
            {
                //window.console.log("normal point");
            }   
        }
        this.context.closePath();
        this.context.stroke();
        this.context.fill();
	    }





, getParticle: function( index )
{	
	return this.physicalPoints[index];
}


, addParticle: function( point, scale )
{	
	var p = new Particle();
		p.bounce = -1;
	//	p.grav = 4;
		p.maxSpeed = 20;
	//	p.addGravPoint( 100, 500, 2000 );
	//	p.addRepelPoint( 300, 300, 900 );
	//	p.wander = 1;
		p.setEdgeBehavior("bounce");
		// p.turnToPath( true );

		// p.setGravToMouse( this.canvas, true, 30000 );
			
		p.setRepelMouse( this.canvas, true, 30000 );
			
				
		p.x = point.x*scale;
        p.y = point.y*scale;

		this.physicalPoints.push( p );
}

, midValue: function(a,b)
{
    return (a+b)/2
}

// load the binary data of the font
, load_binary_resource: function(url)
{
    var req = new XMLHttpRequest();
    req.open( 'GET', url, false );
    req.overrideMimeType( 'text/plain; charset=x-user-defined' );
    req.send(null);

   // alert( "text status:" + req.status);
   // if(req.status != 200) return '';            
   // alert( "text response:" + req.responseText);
    
    return req.responseText;
}

, clearCanvas: function (context, canvas)
{
	context.clearRect(0, 0, canvas.width, canvas.height);
}












    , animate: function() {
        this.update();
        this.draw();
    }
    
    , update: function() {
        var i, point;
        for(i = 0; i < this.physicalPoints.length; i++ ) {
            point = this.physicalPoints[i];
			point.update();
        }
    }
    
    , draw: function() {

       context.clearRect(0, 0, this.width, this.height);

        var i, point;


			this.redrawLines();

        for(i = 0; i < this.physicalPoints.length; i++ ) {
            
			// set the points on the class
			point = this.physicalPoints[i];
			point.width = point.height = 2;// tell it size dims
			
			context.save();
			context.translate(point.x,point.y);
			context.rotate( point.rotation );
			
			context.beginPath();
	//		context.strokeStyle = this.rndColor();
            context.arc(0, 0, 8, 0, Math.PI*2, false);

			context.stroke();

			context.restore();
			
        }

    }

	, rndColor: function() {
	    return '#' + ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6);
	}











});