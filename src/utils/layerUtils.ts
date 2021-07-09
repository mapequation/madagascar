import { GeoJsonLayer } from '@deck.gl/layers';
import { TerrainLayer } from '@deck.gl/geo-layers';
import { RGBAColor } from '@deck.gl/core';

type Bounds = [number, number, number, number]; // west, south, east, north

interface TerrainProps {
  elevationMultiplier: number;
}

const defaultProps: Required<TerrainProps> = {
  elevationMultiplier: 5,
};

export function createTerrainLayer(props: TerrainProps = defaultProps) {
  // Terrain

  // const bounds512: Bounds = [
  //   43.216526885, -25.6084724793002, 50.508193523, -11.941805867,
  // ];
  // const elevationMax512 = 2556.754

  const bounds: Bounds = [
    38.127069950394386, -27.197664118299897, 55.193735934400635,
    -10.130998134300926,
  ];

  // const elevationData = 'elevation_2048x2048_rgba.png';
  // const texture = 'texture_moat2021.png';
  const elevationData =
    process.env.PUBLIC_URL + '/elevation_1024x1024_rgba.png';
  const texture = process.env.PUBLIC_URL + '/texture_moat2021_1024x1024.png';
  const elevationMax = 2774;
  const { elevationMultiplier } = props;

  const elevationDecoder = {
    rScaler: (elevationMax / 255) * elevationMultiplier,
    gScaler: 0,
    bScaler: 0,
    offset: 0,
  };

  const material = {
    // ambient: 0.35,
    // diffuse: 0.6,
    // shininess: 32,
    // specularColor: [30, 30, 30]
    ambient: 0.5,
    diffuse: 0.9,
    shininess: 111,
    specularColor: [120, 120, 120],
  };

  const terrainLayer = new TerrainLayer({
    id: 'TerrainLayer',
    elevationData,
    texture,
    bounds,
    elevationDecoder,
    material,
  });

  // console.log(terrainLayer);

  // const terrainLayer2 = new TerrainLayer({
  //   id: 'TerrainLayer',

  //   /* props from TerrainLayer class */

  //   // bounds: [-122.5233, 37.6493, -122.3566, 37.8159],,
  //   bounds: bounds,
  //   // color: [255, 255, 255],
  //   // data: [],
  //   // elevationData:
  //   //   'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/terrain.png',
  //   elevationData,
  //   // texture:
  //   //   'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/terrain-mask.png',
  //   texture,
  //   elevationDecoder: {
  //     rScaler: 100,
  //     gScaler: 0,
  //     bScaler: 0,
  //     offset: 0,
  //   },
  //   // extent: null,
  //   // getTileData: null,
  //   // loaders: ,
  //   material: {
  //     diffuse: 1,
  //   },
  //   // maxCacheByteSize: null,
  //   // maxCacheSize: null,
  //   // maxRequests: 6,
  //   // maxZoom: null,
  //   // meshMaxError: 4,
  //   // minZoom: 0,
  //   // onTileError: null,
  //   // onTileLoad: null,
  //   // onTileUnload: null,
  //   // onViewportLoad: null,
  //   // refinementStrategy: 'best-available',
  //   // renderSubLayers: null,
  //   // tileSize: 512,
  //   // wireframe: false,
  //   // workerUrl: null,
  //   // zRange: null,

  //   /* props inherited from Layer class */

  //   // autoHighlight: false,
  //   // coordinateOrigin: [0, 0, 0],
  //   // coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
  //   // highlightColor: [0, 0, 128, 128],
  //   // modelMatrix: null,
  //   // opacity: 1,
  //   // pickable: false,
  //   // visible: true,
  //   // wrapLongitude: false,
  // });

  return terrainLayer;
}

export async function loadProtectedAreas() {
  const filename =
    process.env.PUBLIC_URL + '/Madagascar_synthesized_land.geojson';
  console.log(`Loading '${filename}'...`);
  const res = await fetch(filename);
  if (!res.ok) {
    console.error(`Failed to load protected areas: ${res.statusText}`);
    return;
  }
  const geojson = await res.json();
  console.log('geojson:', geojson);
  return geojson;
}

export function createProtectedAreaLayer(geojson: any) {
  const getFillColor = (d: any): RGBAColor =>
    d.properties.protected === 'yes'
      ? [100, 100, 255, 130]
      : [200, 200, 200, 130];

  return new GeoJsonLayer({
    id: 'geojson-layer',
    // @ts-ignore
    data: geojson,
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    getFillColor,
    // @ts-ignore
    //getTooltip: (info) => 'test',
    //getLineColor: d => colorToRGBArray(d.properties.color),
    getLineColor: [20, 20, 200],
    getRadius: 100,
    getLineWidth: 1,
    getElevation: 20000,
  });
}
