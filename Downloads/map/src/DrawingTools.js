import React, { useState, useEffect } from 'react';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Draw, Modify, Snap } from 'ol/interaction';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import 'ol/ol.css';

const DrawingTools = () => {
  const [map, setMap] = useState(null);
  const [drawInteraction, setDrawInteraction] = useState(null);

  useEffect(() => {
    const mapInstance = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#ffcc33'
          })
        })
      })
    });

    mapInstance.addLayer(vectorLayer);

    setMap(mapInstance);

    return () => {
      mapInstance.dispose();
    };
  }, []);

  const startDrawing = (type) => {
    if (!map) return;

    if (drawInteraction) {
      map.removeInteraction(drawInteraction);
    }

    const draw = new Draw({
      source: map.getLayers().item(1).getSource(),
      type: type
    });

    map.addInteraction(draw);
    setDrawInteraction(draw);
  };

  const modifyFeature = () => {
    if (!map) return;
    const modify = new Modify({ source: map.getLayers().item(1).getSource() });
    map.addInteraction(modify);
  };

  const snapToFeature = () => {
    if (!map) return;
    const snap = new Snap({ source: map.getLayers().item(1).getSource() });
    map.addInteraction(snap);
  };

  return (
    <div>
      <div id="map" className="map" style={{ width: '100%', height: '600px' }}></div>
      <div className="drawing-tools">
        <button onClick={() => startDrawing('Polygon')}>Draw Polygon</button>
        <button onClick={() => startDrawing('Point')}>Draw Point</button>
        <button onClick={() => startDrawing('LineString')}>Draw Line</button>
        <button onClick={modifyFeature}>Modify Feature</button>
        <button onClick={snapToFeature}>Snap to Feature</button>
      </div>
    </div>
  );
};

export default DrawingTools;
