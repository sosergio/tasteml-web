import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  }
}));

export default function TasteMap({data}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      Taste Map
    </div>
  );
}
