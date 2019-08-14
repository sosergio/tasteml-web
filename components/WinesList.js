import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import bottlesImages from '../services/bottlesImages'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    // width: 500,
   // height: '100vh',
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
    width: '75%',
    position: 'relative'
}
}));

export default function WinesList({data, onWineSelected}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList} cols={1}>
        {data && data.map(tile => (
          <GridListTile key={tile._id} className={classes.gridListTile}>
            <img className={classes.gridImg} src={bottlesImages(tile.variety)} alt={tile.variety} />
            <GridListTileBar
              title={tile.title}
              subtitle={<span>{tile.variety} {tile.price}$</span>}
              actionIcon={
                  <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}
                    onClick={() => onWineSelected(tile.slug)}>
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
