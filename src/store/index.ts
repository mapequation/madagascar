import { makeObservable, observable, computed } from 'mobx';
import { Layer } from '@deck.gl/core';
import * as layerUtils from '../utils/layerUtils';

class Store {
  //result: number;
  landLoaded = false;
  dataLoaded = false;

  //layers: Layer<any, any>[] = [];

  terrainLayer: Layer<any, any> | null = null;
  elevationMultiplier: number = 5;
  protectedAreaGeoJson: any = null;

  protectedAreaLayerOn: boolean = true;

  constructor() {
    makeObservable(this, {
      landLoaded: observable,
      dataLoaded: observable,
      terrainLayer: observable,
      elevationMultiplier: observable,
      protectedAreaGeoJson: observable.ref,
      protectedAreaLayerOn: observable,
      layers: computed,
    });

    //this.result = 10;

    (async () => {
      console.log('Load terrain...');
      this.terrainLayer = layerUtils.createTerrainLayer();
      console.log('Load protected areas...');
      this.protectedAreaGeoJson = await layerUtils
        .loadProtectedAreas()
        .catch(console.error);
      console.log('Done loading layers!');

      this.dataLoaded = true;
    })();
  }

  get layers(): Layer<any, any>[] {
    const l = [];
    // if (this.terrainLayer) l.push(this.terrainLayer);
    const { elevationMultiplier } = this;
    l.push(layerUtils.createTerrainLayer({ elevationMultiplier }));
    if (this.protectedAreaGeoJson && this.protectedAreaLayerOn)
      l.push(layerUtils.createProtectedAreaLayer(this.protectedAreaGeoJson));
    console.log('computed layers:', l);
    return l;
  }
}

export default new Store();
