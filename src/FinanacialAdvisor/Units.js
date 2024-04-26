import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import axiosConfig from '../Config/axiosConfig';

const columns = [
    {field: 'id', hide: true},
    {field: 'lastModifiedDate', headerName: 'Date', width: 200},
    {field: 'unitAccounts', headerName: 'Account', width: 150},
    {field: 'firstName', headerName: 'Holder First Name', width: 150},
    {field: 'lastName', headerName: 'Holder Last Name', width: 150},
    {field: 'month', headerName: 'Month', width: 100, editable: false},
    {field: 'unit', headerName: 'Units', width: 100, editable: false},
    {field: 'amount', headerName: 'Amount', width: 200, editable: false},
]

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const defaultTheme = createTheme();
const useStyles = makeStyles(
    (theme) =>
        createStyles({
          root: {
            padding: theme.spacing(0.5, 0.5, 0),
            justifyContent: 'space-between',
            display: 'flex',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          },
          textField: {
            [theme.breakpoints.down('xs')]: {
              width: '100%',
            },
            margin: theme.spacing(1, 0.5, 1.5),
            '& .MuiSvgIcon-root': {
              marginRight: theme.spacing(0.5),
            },
            '& .MuiInput-underline:before': {
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
          },
        }),
    { defaultTheme },
);

function QuickSearchToolbar(props) {
  const classes = useStyles();

  return (
      <div className={classes.root}>
        <div>
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
        </div>
        <TextField
            variant="standard"
            value={props.value}
            onChange={props.onChange}
            placeholder="Search…"
            className={classes.textField}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" />,
              endAdornment: (
                  <IconButton
                      title="Clear"
                      aria-label="Clear"
                      size="small"
                      style={{ visibility: props.value ? 'visible' : 'hidden' }}
                      onClick={props.clearSearch}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
              ),
            }}
        />
      </div>
  );
}


QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default function Units() {

    const [units, setUnits] = React.useState([]);
    const [rows, setRows] = React.useState([]);

    useEffect(() => {
        axiosConfig.get('/controller/readings', {params: {account_no: ''}})
            .then(function (response) {
                setRows(response.data);
                setUnits(response.data);
            })
            .catch(function (error) {
                alert(error)
            });
        //setIsLoaded(true);
    }, []);

  const [searchText, setSearchText] = React.useState('');

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = units.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setRows(filteredRows);
  };

  React.useEffect(() => {
    setRows(units);
  }, [units]);

  return (
      <React.Fragment>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
              components={{ Toolbar: QuickSearchToolbar }}
              rows={rows}
              columns={columns}
              componentsProps={{
                toolbar: {
                  value: searchText,
                  onChange: (event) => requestSearch(event.target.value),
                  clearSearch: () => requestSearch(''),
                },
              }}
          />
        </div>
      </React.Fragment>
  );
}