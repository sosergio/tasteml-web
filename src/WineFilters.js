import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding:'10px'
  },
  formControl: {
    //margin: theme.spacing(1),
    minWidth: 120,
    
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  input: {
    color: 'white'
  },
  flex1:{
    flex:1
  }
  // rangeContainer: {
  //   width: 300
  // }
}));

function valuetext(value) {
    return `${value}$`;
  }

export default function WineFilters({onChange}) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    country: '',
    price: [0, 50]
  });

  const commitChange = name => (event, newValue) => {
    const newState = {
        ...state,
        [name]: event.target.value || newValue,
      };
    setState(newState);
    if(onChange) onChange(newState);
  };

  const updateChange = name => (event, newValue) => {
    setState({
      ...state,
      [name]: event.target.value || newValue,
    });
  };

  return (
    <div className={classes.root}>
        <div className={classes.flex1}>
        <Typography id="price-slider1" gutterBottom>
                Country
            </Typography>
            <FormControl className={classes.formControl}>
                {/* <InputLabel htmlFor="country-select">Country</InputLabel> */}
                <Select
                  native
                  value={state.country}
                  onChange={commitChange('country')}
                  inputProps={{
                      name: 'country',
                      id: 'country-select',
                  }}
                  >
                  <option value='' >All</option>
                  <option value='italy'>Italy</option>
                  <option value='france'>France</option>
                  <option value='us'>USA</option>
                  <option value='portugal'>Portugal</option>
                </Select>
            </FormControl>
        </div>
        {/* <div>
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="price-ranges">Price</InputLabel>
                <Select
                  native
                  value={state.price}
                  onChange={commitChange('price')}
                  inputProps={{
                      name: 'price',
                      id: 'price-select',
                  }}
                  >
                  <option value='' />
                  <option value={[0,10]}>Inexpensive</option>
                  <option value={[50]}>Medium</option>
                  <option value={[50,100]}>Expensive</option>
                  <option value={[100,1000]}>Luxury</option>
                </Select>
            </FormControl> 
            
        </div> */}

        <div className={classes.flex1}>
            <Typography id="price-slider" gutterBottom>
                Price
            </Typography>
            <Slider
                value={state.price}
                onChangeCommitted={commitChange('price')}
                onChange={updateChange('price')}
                valueLabelDisplay="auto"
                aria-labelledby="price-slider"
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
            />
        </div>
    </div>
  );
}



