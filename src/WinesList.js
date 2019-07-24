import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';


const useStyles = makeStyles(theme => ({
  root: {
    
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  gridListTile:{
    backgroundColor: 'lightgray'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  gridImg2: {
      transform: 'translateY(-30%) translateX(-30%)',
      top: '50%',
      width: '100%',
      position: 'relative'
  },
  gridImg: {
    transform: 'translateY(-38%) translateX(-49%)',
    top: '50%',
    width: '125%',
    position: 'relative'
}
}));

function resolveImage(wineVariety){
  const imgs = ['red-1','red-2','red-3','white-1','white-2','white-4'];
  const ix = Math.floor(Math.random() * 6);
  return `static/sil/${imgs[ix]}.png`
}

export default function WinesList({data}) {
  const classes = useStyles();
  console.log("WinesList", data)
  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        {data && data.map(tile => (
          <GridListTile key={tile._id} className={classes.gridListTile}>
            <img className={classes.gridImg} src={resolveImage(tile.variety)} alt={tile.variety} />
            <GridListTileBar
              title={tile.title}
              subtitle={<span>{tile.variety} {tile.price}$</span>}
              actionIcon={
                <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
