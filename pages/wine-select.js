import React, { Component } from 'react'
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import WinesList from '../src/WinesList';
import WineFilters from '../src/WineFilters';
import BubbleChart from '../src/BubbleChart';
import fetch from 'isomorphic-unfetch';
import CircularProgress from '@material-ui/core/CircularProgress';

const getWines = async (country, minPrice, maxPrice, cluster) => {
  const clusterFilter = cluster ? `&sort=to_${cluster}`: '';
  const countryFilter = country ? `&country=${country}`: '';
  const minPriceFilter = minPrice ? `&min_price=${minPrice}`: '';
  const maxPriceFilter = maxPrice ? `&max_price=${maxPrice}`: '';
  let qs = clusterFilter+countryFilter+minPriceFilter+maxPriceFilter;
  if(qs.length > 0) qs = "?" + qs.substring(1, qs.length);
  const res = await fetch(`http://localhost:3000/tasting-notes${qs}`)
  return await res.json()
};

const getClusters = async () => {
    const res = await fetch(`http://localhost:3000/clusters/hierarchical`)
    const root =  await res.json()
    return root;
};

const getTastes = async () => {
  const res = await fetch(`http://localhost:3000/tastes`)
  const array =  await res.json()
  let hashmap = {};
  for(let t of array)
    hashmap[t.name]=  [t.primary, t.secondary]
  return hashmap
};

export default class extends Component {
  
  constructor(props) {
    super();
    this.state = {
      loadingWines: true,
      loadingClusters: true,
      loadingTastes: true,
      wineData: []
    };
  }

  componentDidMount() {
    console.log('componentDidMount')
    this.loadWines();
    this.loadClusters();
    this.loadTastes();
  }

  loadWines(){
    let { country, minPrice, maxPrice, cluster } = this.state;
    getWines(country, minPrice, maxPrice, cluster)
      .then(newWines =>{
        this.setState({
          ...this.state,
          loadingWines: false,
          wineData: newWines.items.slice(0,5)
        })});
  }

  loadClusters(){
    getClusters().then(clusters => this.setState({
      ...this.state,
      loadingClusters: false,
      clusters
    }))
  }

  loadTastes(){
    getTastes().then(tastes => this.setState({
      ...this.state,
      loadingTastes: false,
      tastes
    }))
  }
  
  onFiltersChange = (newValue) => {
    this.setState({
      ...this.state,
      country: newValue.country,
      minPrice: newValue.price[0],
      maxPrice: newValue.price[1]
    })
    this.loadWines();
  };

  onClusterSelected = (newValue) => {
    this.setState({
      ...this.state,
      cluster: newValue
    })
    this.loadWines();
  };

  render() {
    return (
      <Container >
        <Grid container component="main" >
          <Grid item xs={12} sm={3} component={Paper} elevation={6}>
            { this.state.loadingWines ? <CircularProgress/> : 
              <WinesList data={this.state.wineData}/> 
            }
          </Grid>
          <Grid item xs={12} sm={9}>
            <WineFilters onChange={this.onFiltersChange}></WineFilters>
            { this.state.loadingClusters || this.state.loadingTastes ? <CircularProgress/> : 
              <BubbleChart data={this.state.clusters} tastes={this.state.tastes} onClusterSelected={this.onClusterSelected}></BubbleChart>
            }
          </Grid>
        </Grid>
      </Container>
    )
  }
}
