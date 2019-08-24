import clsx from "clsx";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import WinesList from "./../components/WinesList";
import WineFilters from "./../components/WineFilters";
import ClustersChart from "./../components/ClustersChart";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import About from "./about";
import TastemlApi from "./../services/tastemlApi";
import { logEvent, logPageView } from '../services/analytics';

const drawerWidth = 340;

const styles = theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    flex: "0 0 auto",
    paddingRight: 24 // keep right padding when drawer closed
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    display: "flex"
  },
  drawerRoot: {
    zIndex: 1,
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)"
  },
  drawerFlexContainer: {
    height: "100vh",
    display: "flex",
    flexDirection: "column"
  },
  drawerToolbarContainer: {
    flex: "0 0 auto"
  },
  drawerListContainer: {
    flex: "1 1 auto",
    overflowY: "auto"
  },
  progressContainer: {
    display: "flex",
    height: "100%"
  },
  progress: {
    margin: "auto"
  }
});

function WineDetailDialog(props) {
  const { onClose, selectedValue, open } = props;

  function handleClose() {
    onClose();
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <About id={selectedValue} />
    </Dialog>
  );
}

class Index extends Component {
  constructor(props) {
    super();
    this.tastemlApi = new TastemlApi();
    this.state = {
      open: true,
      loadingWines: true,
      loadingClusters: true,
      loadingFlavours: true,
      wineData: [],
      selectedWineId: null,
      isModalOpen: false
    };
  }

  componentDidMount() {
    this.loadWines({});
    this.loadClusters();
    this.loadFlavours();
  }

  toggleDrawer = () => {
    this.setState({
      open: !this.state.open
    });
  };

  loadWines() {
    const { country, minPrice, maxPrice, cluster } = this;
    this.setState({ loadingWines: true });
    this.tastemlApi.getWines(country, minPrice, maxPrice, cluster).then(newWines => {
      this.setState({
        loadingWines: false,
        wineData: newWines.items.slice(0, 10)
      });
    });
  }

  loadClusters() {
    this.tastemlApi.getClusters().then(clusters =>
      this.setState({
        loadingClusters: false,
        clusters
      })
    );
  }

  loadFlavours() {
    this.tastemlApi.getFlavours().then(flavours =>
      this.setState({
        loadingFlavours: false,
        flavours
      })
    );
  }

  onFiltersChange = newValue => {
    this.country = newValue.country;
    this.minPrice = newValue.price[0];
    this.maxPrice = newValue.price[1];
    this.loadWines();
    logEvent('INDEX','onFiltersChange');
  };

  onClusterSelected = newValue => {
    this.cluster = newValue;
    this.loadWines();
    logEvent('INDEX','onClusterSelected');
  };

  onWineSelected = id => {
    this.setState({
      selectedWineId: id,
      isModalOpen: true
    });
    logEvent('INDEX','onWineSelected');
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(
              classes.drawerPaper,
              !this.state.open && classes.drawerPaperClose
            ),
            root: classes.drawerRoot
          }}
          open={this.state.open}
        >
          <div className={classes.drawerFlexContainer}>
            <div className={classes.drawerToolbarContainer}>
              <Toolbar className={classes.toolbar}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={this.toggleDrawer}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <Typography
                  component="h1"
                  variant="h6"
                  color="inherit"
                  noWrap
                  className={classes.title}
                >
                  TasteML
                </Typography>
              </Toolbar>
              <WineFilters onChange={this.onFiltersChange} />
            </div>
            <div className={classes.drawerListContainer}>
              {this.state.loadingWines ? (
                <div className={classes.progressContainer}>
                  {" "}
                  <CircularProgress className={classes.progress} />
                </div>
              ) : (
                <WinesList
                  data={this.state.wineData}
                  onWineSelected={this.onWineSelected}
                />
              )}
            </div>
          </div>
        </Drawer>
        <main className={classes.content}>
          {this.state.loadingClusters || this.state.loadingFlavours ? (
            <CircularProgress className={classes.progress} />
          ) : (
            <ClustersChart
              data={this.state.clusters}
              flavours={this.state.flavours}
              onClusterSelected={this.onClusterSelected}
            />
          )}
        </main>
        <WineDetailDialog
          selectedValue={this.state.selectedWineId}
          open={this.state.isModalOpen}
          onClose={this.closeModal}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Index);
