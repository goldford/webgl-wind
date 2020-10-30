// using var to work around a WebKit bug
var canvas = document.getElementById('canvas'); // eslint-disable-line

const pxRatio = Math.max(Math.floor(window.devicePixelRatio) || 1, 2);
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const gl = canvas.getContext('webgl', {antialiasing: false});

// go - replacing hardcoded stuff lines 83/84
const degspan_height = 4.75;
const degspan_width = 6.273;
const minlon = 127.14; //neg to pos
const maxlat = 52.15;

const wind = window.wind = new WindGL(gl);
wind.numParticles = 20000;

function frame() {
    if (wind.windData) {
        wind.draw();
    }
    requestAnimationFrame(frame);
}
frame();

const gui = new dat.GUI();
gui.add(wind, 'numParticles', 1024, 589824);
gui.add(wind, 'fadeOpacity', 0.96, 0.999).step(0.001).updateDisplay();
gui.add(wind, 'speedFactor', 0.05, 1.0);
gui.add(wind, 'dropRate', 0, 0.1);
gui.add(wind, 'dropRateBump', 0, 0.2);

const windFiles = {
    //0: '2016112000',
    //6: '2016112006',
    //12: '2016112012',
    //18: '2016112018',
    //24: '2016112100',
    //30: '2016112106',
    //36: '2016112112',
    //42: '2016112118',
    //48: '2016112200'
	0: '1980-05',
    6: '2000-05'
};

const meta = {
    '1980-01-01+h': 0,
    'retina resolution': true,
    'github.com/goldford/webgl-wind': function () {
        window.location = 'https://github.com/goldford/webgl-wind';
    }
};
gui.add(meta, '1980-01-01+h', 0, 48, 6).onFinishChange(updateWind);
if (pxRatio !== 1) {
    gui.add(meta, 'retina resolution').onFinishChange(updateRetina);
}
gui.add(meta, 'github.com/goldford/webgl-wind');
updateWind(0);
updateRetina();

function updateRetina() {
    const ratio = meta['retina resolution'] ? pxRatio : 1;
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    wind.resize();
}

//getJSON('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_coastline.geojson', function (data) {
getJSON('https://goldford.github.io/webgl-wind/data/sscoast.geojson', function (data) {
    const canvas = document.getElementById('coastline');
    
	canvas.width = canvas.clientWidth * pxRatio;
    canvas.height = canvas.clientHeight * pxRatio;
	//console.log(canvas.width);
	//console.log(canvas.height);

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = pxRatio;
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.strokeStyle = 'white';
    ctx.beginPath();

    for (let i = 0; i < data.features.length; i++) {
        	
		const linetype = data.features[i].geometry.type;
		//console.log(linetype);
		
		// if linetype is MultiLineString then need to have a second nested loop -go
		if (linetype == "LineString"){
			const line = data.features[i].geometry.coordinates;
			for (let j = 0; j < line.length; j++) {
				
				const x_pos = (line[j][0] + minlon) * canvas.width / degspan_width;
				const y_pos = (-line[j][1] + maxlat) * canvas.height / degspan_height;
				const test1 = isNaN(parseFloat(x_pos));
				const test2 = isNaN(parseFloat(y_pos));
				
				if (test1 == true || test2 == true) {
					//console.log(line[j][0]);
					//console.log(line[j][1]);
					//console.log(x_pos);
					//console.log(y_pos);
					continue;
				}else if(x_pos < 0 || y_pos < 0){
					//console.log(line[j][0]);
					//console.log(line[j][1]);
					//console.log(x_pos);
					//console.log(y_pos);
					continue;
				}
				
				ctx[j ? 'lineTo' : 'moveTo'](
					//(line[j][0] + 180) * canvas.width / 360,		
					//(-line[j][1] + 90) * canvas.height / 180);
					x_pos,y_pos
					);
			}
        } else if (linetype == "MultiLineString"){
			
			const multilines = data.features[i].geometry.coordinates;
			
			for (let j = 0; j < multilines.length; j++) {
				
				for (let k = 0; k < multilines[j].length; k++) {
					
					const x_pos = (multilines[j][k][0] + minlon) * canvas.width / degspan_width;
					const y_pos = (-multilines[j][k][1] + maxlat) * canvas.height / degspan_height;
					const test1 = isNaN(parseFloat(x_pos));
					const test2 = isNaN(parseFloat(y_pos));
					
					if (test1 == true || test2 == true) {
						//console.log(line[j][0]);
						//console.log(line[j][1]);
						//console.log(x_pos);
						//console.log(y_pos);
						continue;
					}else if(x_pos < 0 || y_pos < 0){
						//console.log(line[j][0]);
						//console.log(line[j][1]);
						//console.log(x_pos);
						//console.log(y_pos);
						continue;
					}else{
						ctx[k ? 'lineTo' : 'moveTo'](
						//(line[j][0] + 180) * canvas.width / 360,		
						//(-line[j][1] + 90) * canvas.height / 180);
						x_pos,y_pos);
					}
				}
			}
		}
	}
    ctx.stroke();
});

function updateWind(name) {
    getJSON('wind/' + windFiles[name] + '.json', function (windData) {
        const windImage = new Image();
        windData.image = windImage;
        windImage.src = 'wind/' + windFiles[name] + '.png';
        windImage.onload = function () {
            wind.setWind(windData);
        };
    });
}

function getJSON(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('get', url, true);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            callback(xhr.response);
        } else {
            throw new Error(xhr.statusText);
        }
    };
    xhr.send();
}
