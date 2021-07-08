import ReactDOMServer from 'react-dom/server';
import DeckGL from '@deck.gl/react';
import { observer } from 'mobx-react';
import store from '../store';
import {
  WebMercatorViewport,
  MapView,
  //@ts-ignore
  _GlobeViewport as GlobeViewport,
} from '@deck.gl/core';
//@ts-ignore
import { _GlobeView as GlobeView } from 'deck.gl';

import { PickInfo, PickMode } from '@deck.gl/core/lib/deck';
import { List } from 'semantic-ui-react';

const viewportGlobe = new GlobeViewport({
  width: 800,
  height: 800,
  longitude: -50,
  latitude: 10,
  zoom: 0,
});

const viewportMercator = new WebMercatorViewport({
  width: 800,
  height: 800,
  longitude: -50,
  latitude: 10,
  zoom: 1,
});

const globeView = new GlobeView({
  id: 'base-map-globe',
  controller: true,
});

const mapView = new MapView({
  id: 'base-map',
  controller: true,
});

interface Props {
  width?: number;
  height?: number;
  useGlobe?: boolean;
}

const defaultProps: Required<Props> = {
  width: 800,
  height: 800,
  useGlobe: true,
};

function getName(props: any) {
  return (
    props.NAME ??
    props[' KBA_name'] ??
    props.SG_PA_name ??
    props.SG_name ??
    props.ORIG_NAME
  );
}

function Tooltip({ properties: p }: any) {
  return (
    <List>
      <List.Item>
        <List.Header>{getName(p)}</List.Header>
        <List.Description>{Math.round(p.AREA)} km²</List.Description>
      </List.Item>
      <List.Item icon="marker" content={p.Province} />
      <List.Item
        icon={p.protected === 'yes' ? 'lock' : 'unlock'}
        content={p.protected === 'yes' ? 'Protected' : 'Not protected'}
      />
      {p.YEAR_PROT != null && <List.Item>Protected in {p.YEAR_PROT}</List.Item>}
      {p.IUCN != null && <List.Item>IUCN: {p.SG_IUCN}</List.Item>}
      <List.Item><span style={{ textTransform: "capitalize" }}>{p.Habitat}</span></List.Item>
    </List>
  );
}

export default observer(function Deck(
  props: Props & React.ComponentProps<typeof DeckGL> = defaultProps,
) {
  const hasLayers = store.layers.length > 0;

  const { width, height, useGlobe, ...deckGlProps } = props;

  // const viewport = useGlobe ? viewportGlobe : viewportMercator;
  const view = useGlobe ? globeView : mapView;

  console.log(
    `Render Deck.gl, useGlobe: ${useGlobe}, num layers: ${store.layers.length}`,
  );

  // 43.216526885, -25.6084724793002, 50.508193523, -11.941805867
  const initialViewState = {
    // longitude: -122.4,
    // latitude: 37.74,
    longitude: 48,
    latitude: -20,
    zoom: 5,
    maxZoom: 20,
    pitch: 60,
    bearing: 45,
  };

  return (
    <>
      {hasLayers && store.dataLoaded ? (
        <DeckGL
          initialViewState={initialViewState}
          views={[view]}
          controller={true}
          width={width}
          height={height}
          onLoad={() => console.log('Deck GL loaded.')}
          onError={(err) => console.log('Error: ', err)}
          layers={store.layers}
          getTooltip={(info: PickInfo<any>) => {
            if (
              info.layer &&
              info.layer.id === 'geojson-layer' &&
              info.object
            ) {
              console.log(info);
              return {
                html: ReactDOMServer.renderToStaticMarkup(
                  <Tooltip properties={info.object.properties} />,
                ),
                style: {
                  color: 'unset',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: 'solid 1px #ccc',
                },
              };
            }
            return null;
          }}
          {...deckGlProps}
        />
      ) : (
        <div>Loading data...</div>
      )}
    </>
  );
});
