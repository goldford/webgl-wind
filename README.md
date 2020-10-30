## WebGL Wind Patterns in the Strait of Georgia and Salish Sea — [World Demo](https://goldford.github.io/webgl-wind/demo) - [Salish Sea Demo](https://goldford.github.io/webgl-wind/salish-sea-demo)

A WebGL-powered visualization of wind power.
Capable of rendering up to 1 million wind particles at 60fps.

This project is forked from the work of 
- [Vladimir Agafonkin](https://blog.mapbox.com/how-i-built-a-wind-map-with-webgl-b63022b5537f)

which in turn was heavily inspired by the work of:

- [Cameron Beccario](https://twitter.com/cambecc)
and his wonderful [Earth project](https://earth.nullschool.net/)
with its [open-source version](https://github.com/cambecc/earth).
- [Fernanda Viégas and Martin Wattenberg](http://hint.fm/) and their
[US Wind Map project](http://hint.fm/projects/wind/).
- [Chris Wellons](http://nullprogram.com) and his WebGL tutorials,
in particular [A GPU Approach to Particle Physics](http://nullprogram.com/blog/2014/06/29/).
- [Greggman](http://games.greggman.com/game/) and his [WebGL Fundamentals](http://webglfundamentals.org/) guide.

### Running the demo locally

The current version is build to run and test on github pages. See the original for a version that can run locally: 

- [Original Forked Repo](https://github.com/mapbox/webgl-wind/)

### Downloading and processing wind data, and running the demo

The ERA5 model is a (retrospective reanalysis)[(https://climate.copernicus.eu/climate-reanalysis)] of past weather conditions produced by the European Centre for Medium-Range Weather Forecasts. The original project uses [ecCodes](https://confluence.ecmwf.int//display/ECC/ecCodes+Home) (e.g. `brew install eccodes`) but due to issues installing on Windows, I instead reprogrammed the processing of copernicus NetCDF files in Python (see notebook). 

1. Download [copernicus model files](https://www.ecmwf.int/en/forecasts/datasets/browse-reanalysis-datasets) as NetCDF and place it in the 'data' folder.
2. Run the Python script provided in the Jupyter noteboook to produce a PNG file. 
3. If desired, swap out or remove the geoJSON and background elevation image (set in the index.html and index.js files in demo folder). You should do this if you're downloading different data than I used. 
3. Run the 'demo' which uses the PNG file and interpolates it using tools in WEBGL and simulates particles. 

Note: the drawing of geoJSON correctly is fiddley. To properly align with the wind image you'll need to play with params in index.js

