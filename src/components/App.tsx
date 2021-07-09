import { Checkbox, Container, Grid } from 'semantic-ui-react';
import Deck from './Deck';
import './App.css';
import store from '../store';
import { observer } from 'mobx-react';

export default observer(function App() {
  return (
    <>
      <Container as="header" style={{ marginTop: 20 }}>
        <h1>Madagascar</h1>
      </Container>

      <Grid container as="main">
        <Grid.Column width={4} as="aside">
          <Checkbox
            toggle
            checked={store.protectedAreaLayerOn}
            onChange={() =>
              (store.protectedAreaLayerOn = !store.protectedAreaLayerOn)
            }
            label="Protected areas"
          />
        </Grid.Column>
        <Grid.Column width={12}>
          {!store.dataLoaded && 'Loading data...'}
        </Grid.Column>
      </Grid>

      <Deck />

      <Container as="footer"></Container>
    </>
  );
});
