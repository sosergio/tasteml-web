import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import WinesList from '../src/WinesList';
import WineFilters from '../src/WineFilters';
import ClustersChart from '../src/ClustersChart';
import fetch from 'isomorphic-unfetch';
import CircularProgress from '@material-ui/core/CircularProgress';

const baseUrl = "https://tasteml-api.herokuapp.com";

const getWines = async (country, minPrice, maxPrice, cluster) => {
  const clusterFilter = cluster ? `&sort=to_${cluster}`: '';
  const countryFilter = country ? `&country=${country}`: '';
  const minPriceFilter = minPrice ? `&min_price=${minPrice}`: '';
  const maxPriceFilter = maxPrice ? `&max_price=${maxPrice}`: '';
  let qs = clusterFilter+countryFilter+minPriceFilter+maxPriceFilter;
  if(qs.length > 0) qs = "?" + qs.substring(1, qs.length);
  const res = await fetch(`${baseUrl}/tasting-notes${qs}`)
  return await res.json()
};

const getClusters = async () => {
    const res = await fetch(`${baseUrl}/clusters/hierarchical`)
    const root =  await res.json()
    return root;
};

const getTastes = async () => {
  const res = await fetch(`${baseUrl}/tastes`)
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
    display: 'flex'
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
    flex: '0 0 auto'
  },
  drawerListContainer:{
    flex: '1 1 auto',
    overflowY: 'auto',
    
  },
  progressContainer:{
    display:'flex',
    height: '100%'
  },
  progress:{
    margin: 'auto'
  }
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
    this.loadWines({});
    this.loadClusters();
    this.loadTastes();
  }

  toggleDrawer = () => {
    this.setState({
      open:!this.state.open
    })
  }

  loadWines({ country, minPrice, maxPrice, cluster }){
    this.setState({loadingWines : true})
     getWines(country, minPrice, maxPrice, cluster)
      .then(newWines =>{
        this.setState({
          loadingWines: false,
          wineData: newWines.items.slice(0,5)
        })});
  }

  loadClusters(){
    getClusters().then(clusters => this.setState({
      loadingClusters: false,
      clusters
    }))
  }

  loadTastes(){
    getTastes().then(tastes => this.setState({
      loadingTastes: false,
      tastes
    }))
  }
  
  onFiltersChange = (newValue) => {
    this.loadWines({
      country: newValue.country,
      minPrice: newValue.price[0],
      maxPrice: newValue.price[1]
    })
  };

  onClusterSelected = (newValue) => {
    this.loadWines({
      cluster: newValue
    })
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
              { this.state.loadingWines ? <div className={classes.progressContainer}> <CircularProgress className={classes.progress}/></div> : 
                  <WinesList data={this.state.wineData}/> 
              }
            </div>
          </div>
        </Drawer>
        <main className={classes.content}>
          { this.state.loadingClusters || this.state.loadingTastes ? <CircularProgress className={classes.progress}/>: 
              <ClustersChart data={this.state.clusters} tastes={this.state.tastes} onClusterSelected={this.onClusterSelected}></ClustersChart>
          }
        </main>
      </div>
    );
    }
}

export default withStyles(styles)(IndexPage);
