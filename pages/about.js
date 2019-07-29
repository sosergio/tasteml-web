import React, { Component } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Link from '../src/Link';
import { withRouter } from 'next/router'
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

import fetch from 'isomorphic-unfetch';

const baseUrl = "https://tasteml-api.herokuapp.com";

const styles = () => ({
  card: {
    maxWidth: 345,
  },
});

const getTastes = async () => {
  const res = await fetch(`${baseUrl}/tastes`)
  const array =  await res.json()
  let hashmap = {};
  for(let t of array)
    hashmap[t.name]=  [t.primary, t.secondary]
  return hashmap
};

class About extends Component {
  
  constructor({ router, props }) {
    super();
    this.state = {
      wine: null,
      tastes: []
    };
  }

  componentDidMount() {
    const id = this.props.id || this.props.router.query.id || this.props.router.asPath.replace('/about?id=','');
    const url = `${baseUrl}/tasting-notes/${id}`;
    getTastes().then(tastes => this.setState({
      tastes
    }))
    
    fetch(url)
      .then(x => x.json())
      .then(j => this.setState({
        wine:j
      }));
  }

  getColorFromTasteName = name => this.state.tastes[name] ? this.state.tastes[name][0] : '#fff';

  getFlavours(wine){
    let list = [];
    const exclude = ['description', 'country', 'to_', 'designation', 'points', 'price', 'province', 'ratio', 'region_', 'taster_', 'title', 'variety', 'winery', '_id']
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