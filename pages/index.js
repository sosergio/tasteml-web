import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';

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

const drawerWidth = 340;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    flex: '0 0 auto',
    paddingRight: 24, // keep right padding when drawer closed
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  drawerRoot:{
    zIndex:1,
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)'
  },
  drawerFlexContainer:{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  drawerToolbarContainer:{
    flex: '0 0 auto',
    //background: 'radial-gradient(#091C33, #091426)',
    //color: 'white'
  },
  drawerListContainer:{
    flex: '1 1 auto',
    overflowY: 'auto'
  },
});


class IndexPage extends Component {
  
  constructor(props) {
    super();
    this.state = {
      open: true,
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

  toggleDrawer = () => {
    this.setState({
      ...this.state,
      open:!this.state.open
    })
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

  render(){
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
            root: classes.drawerRoot
          }}
          open={this.state.open}>
          <div className={classes.drawerFlexContainer}>
            <div className={classes.drawerToolbarContainer}>
              <Toolbar className={classes.toolbar}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={this.toggleDrawer} >
                  <ChevronLeftIcon />
                </IconButton>
                <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                  TasteML
                </Typography>
              </Toolbar>
              <WineFilters onChange={this.onFiltersChange}></WineFilters>
            </div>
            <div className={classes.drawerListContainer}>
              { this.state.loadingWines ? <CircularProgress/> : 
                  <WinesList data={this.state.wineData}/> 
              }
            </div>
          </div>
        </Drawer>
        <main className={classes.content}>
        { this.state.loadingClusters || this.state.loadingTastes ? <CircularProgress/> : 
              <BubbleChart data={this.state.clusters} tastes={this.state.tastes} onClusterSelected={this.onClusterSelected}></BubbleChart>
            }
        </main>
      </div>
    );
    }
}

export default withStyles(styles)(IndexPage);
