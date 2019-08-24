import React, { Component } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Link from './../components/Link';
import { withRouter } from 'next/router'
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import TastemlApi from "./../services/tastemlApi";
import { logPageView } from '../services/analytics'

const styles = () => ({
  card: {
    maxWidth: 345,
  },
});

class About extends Component {
  
  constructor({ router, props }) {
    super();
    this.tastemlApi = new TastemlApi();
    this.state = {
      wine: null,
      tastes: []
    };
  }

  componentDidMount() {
    const id = this.props.id || this.props.router.query.id || this.props.router.asPath.replace('/about?id=','');
    console.log(id)
    
    this.tastemlApi.getFlavours().then(tastes => this.setState({
      tastes
    }))

    this.tastemlApi.getTastingNote(id).then(wine => this.setState({
      wine
    }))
  }

  getColorFromTasteName = name => this.state.tastes[name] ? this.state.tastes[name][0] : '#fff';

  getFlavours(wine){
    let list = [];
    const exclude = ['description', 'country', 'to_', 'designation', 'points', 'price', 'province', 'ratio', 'region_', 'taster_', 'title', 'variety', 'winery', '_id', 'slug']
    for (var property in wine) {
      let found = exclude.find(x => property.indexOf(x) > -1)
      if (!found && wine.hasOwnProperty(property)) {
        list.push({key: property, value:wine[property]})
      }
    }
    return list;
  }

  renderWineDetail(wine){
    return (
      <div>
        <h1>{wine.title}</h1>
        <p>{wine.description}</p>
        { this.getFlavours(wine).map(f => <Chip
            label={f.key}
            style={{backgroundColor:this.getColorFromTasteName(f.key)}}
          /> )}
      </div>
    );
  }
  
  render(){
    const { wine } = this.state;
    const { classes } = this.props;
    return (
      <Container maxWidth="sm">
        <Box my={4}>
          {wine ? this.renderWineDetail(wine)
            : <CircularProgress />}      
          {this.props.id ? null : <Link href="/">Go to the main page</Link>}
          
        </Box>
      </Container>
    );
  }
}

export default withRouter(withStyles(styles)(About))