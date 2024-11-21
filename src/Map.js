import React from 'react';
import mapboxgl from 'mapbox-gl';
import vantaanjoki from './kirkonkyla.json';
import wwtpicon from './wwtp.png';

mapboxgl.accessToken = 'pk.eyJ1IjoicmVhbHR1dWtrYSIsImEiOiJjbGxsdmNuNTUybHViM2ZtZ2Q3YWtsMWQxIn0.lfinMy_YBLSB8Cs1A0QPTA';
const voimala_coordinates = [ 24.774500736980102, 60.385511869049438 ];
const BYPASS_PER_MINUTE = 1;
let intv;

export class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      flow: props.flow,
      bypass: props.bypass,
      step: 0,
      timeString: "Click 'Run' to start simulation!",
    }

    this.getTimeString = this.getTimeString.bind(this);
    this.updateValues = this.updateValues.bind(this);
  }

  componentWillReceiveProps(newProps) {
    clearInterval(intv);
    this.setState({
      step: 0,
      flow: newProps.flow,
      bypass: newProps.bypass,
    }, function() {
      intv = setInterval(this.updateValues, 100)
    });
  }

  componentDidMount() {

    // Map Setup

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      // style: 'mapbox://styles/vantaanjokelaiset/cjcx6chvn0unn2smcb0dbcttv',
      style: 'mapbox://styles/mapbox/streets-v10',
      zoom: 8.7,
      center: [24.9539, 60.25459],
    });

    let map = this.map;
    map.on('load', function() {

      // Map, update data

      window.setInterval(function() {
        map.getSource('values').setData({
          "type": "FeatureCollection",
          "features": vantaanjoki.features
        });
      }, 100);

      map.addSource('values', { type: 'geojson', data: {
          "type": "FeatureCollection",
          "features": vantaanjoki.features
        }
      });

      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      map.on('mouseenter', 'factory', function(e) {
        popup.setLngLat(e.features[0].geometry.coordinates)
          .setHTML(e.features[0].properties.name)
          .addTo(map);
      });

      map.on('mouseleave', 'factory', function() {
        popup.remove();
      });

      map.loadImage(wwtpicon, function(error, image) {
        if (error) throw error;
        map.addImage('factory', image);
        map.addLayer({
            "id": "factory",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                      "type": "Feature",
                      "geometry": {
                          "type": "Point",
                          "coordinates": voimala_coordinates
                      },
                      "properties" : {
                        "name": "Kirkonkylä wastewater treatment plant"
                      }
                    }]
                }
            },
            "layout": {
                "icon-image": "factory"
            }
        });
      });

      map.addLayer({
        "id": "points",
        "type": "circle",
        "source": "values",
        "paint": {
          'circle-color': [
            "interpolate",
            ["linear"],
            ["get", "concent"],
            0, "rgb(28, 224, 242)",
            0.083, "rgb(102, 0, 255)",
            0.0925, "rgb(153, 51, 102)",
            0.097, "rgb(153, 0, 51)",
            1, "rgb(255,0,0)",
          ],
          "circle-opacity": [
            "interpolate",
            ["linear"],
            ["get", "concent"],
            0, 0,
            0.083, 0.2,
            0.0925, 0.6,
            0.097, 0.8,
            1, 1,
          ],
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            8.8, 4,
            9, 5,
            10, 8,

          ]
        }
      });
    });
  }


  getTimeString(step) {
    let base = "Time from start of bypass: ";
    let h = Math.floor(step / 60);
    let m = step - h * 60;
    if (h) {
      let h_string = h > 1 ? " hours, " : " hour, ";
      return base + h + h_string + m + " minutes.";
    }
    else {
      return base + m + " minutes.";
    }


  }

  // - Update values of points on map (color)
  // - Color is amount of dirty water in comparison to total water amount at that point
  // - This function does math to determine if there is dirty water in that points area
  // and updates it's concentration value to represent that dirtiness in map

  updateValues() {
    let step = this.state.step + 1;
    let speedCoefficient = this.state.flow / 0.83;
    let timeString = this.getTimeString(step);
    let number_of_bypasseds = Math.floor(this.state.bypass / BYPASS_PER_MINUTE);
    if (Math.floor(speedCoefficient * step) > vantaanjoki.features.length + Math.floor(speedCoefficient * number_of_bypasseds)) {
      clearInterval(intv);
    }
    if (this.state.bypass % BYPASS_PER_MINUTE !== 0) {
      number_of_bypasseds += 1;
    }
    this.setState({ step, timeString }, () => {
      vantaanjoki.features.forEach(function(point, i) {
        let bypassed_water;
        if (Math.floor(speedCoefficient * (step - number_of_bypasseds)) <= (i + 1) && (i + 1) <= Math.floor(speedCoefficient * step)) {
          bypassed_water = BYPASS_PER_MINUTE;
        }
        else {
          bypassed_water = 0;
        }
        point.properties.concent = bypassed_water / point.properties.virtaama;
      });
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return (
      <div>
        <div>
          <span className="onmap step">
            { this.state.timeString }
          </span>
        </div>
        <div className="map">
          <div className="onmap legend">
            <div className="legend-title">
              <span>
                Concentration of bypassed water
              </span>
            </div>
            <div>
              <span className="onmap concentration concentration-1"></span>
              <span className="onmap concentration concentration-2"></span>
              <span className="onmap concentration concentration-3"></span>
              <span className="onmap concentration concentration-4"></span>
              <span className="onmap concentration concentration-5"></span>
            </div>
            <div>
              <span className="legend-label legend-label-high">lower</span>
              <span className="legend-label legend-label-low">higher</span>
            </div>
          </div>
        </div>
        <div className="map" ref={el => this.mapContainer = el} />;
      </div>
    )
  }

}