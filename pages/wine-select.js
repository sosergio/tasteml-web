import React, { Component } from 'react'
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import WinesList from '../src/WinesList';
import WineFilters from '../src/WineFilters';
import TasteMap from '../src/TasteMap';
import fetch from 'isomorphic-unfetch';
import tileData from '../src/titleData';

const getWines = async (country, minPrice, maxPrice) => {
  const countryFilter = country ? `&country=${country}`: null;
  const minPriceFilter = minPrice ? `&min_price=${minPrice}`: null;
  const maxPriceFilter = maxPrice ? `&max_price=${maxPrice}`: null;
  const res = await fetch(`http://localhost:3000/tasting-notes?sort=to_1${countryFilter}${minPriceFilter}${maxPriceFilter}`)
  return await res.json()
};

export default class extends Component {
  
  static async getInitialProps() {
    return {wineData: await getWines()}
  }

  componentWillMount() {
    console.log("component will mount")
    this.setState({
      wineData: this.props.wineData.items.slice(0,5)
    })
  }
  
  onFiltersChange = async (newValue) => {
    console.log(`new value of filters: `, newValue.country, newValue.price[0], newValue.price[1])
    const newWines = await getWines(newValue.country, newValue.price[0], newValue.price[1]);
    this.setState({
      wineData: newWines.items.slice(0,5)
    })
  };

  render() {
    

    return (
      <Container maxWidth="lg">
        <Grid container component="main">
          <Grid item xs={12} sm={6}>
            <WinesList data={this.state.wineData}/>
          </Grid>
          <Grid item xs={12} sm={6} component={Paper} elevation={6} square>
            <WineFilters onChange={this.onFiltersChange}></WineFilters>
            <TasteMap></TasteMap>
          </Grid>
        </Grid>
      </Container>
    )
  }
}
