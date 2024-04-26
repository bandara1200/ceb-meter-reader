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
import {createTheme} from '@mui/material/styles';
import {createStyles, makeStyles} from '@mui/styles';
import axiosConfig from '../Config/axiosConfig';

const columns = [
    {field: 'id', hide: true},
    {field: 'transactionId', headerName: 'Transaction ID', width: 150},
    {field: 'invoiceAccounts', headerName: 'Account', width: 150},
    {field: 'firstName', headerName: 'Holder First Name', width: 150, editable: false},
    {field: 'lastName', headerName: 'Holder Last Name', width: 150, editable: false},
    {field: 'lastModifiedDate', headerName: 'Date', width: 200, editable: false},
    {field: 'method', headerName: 'Method', width: 100, editable: false},
    {field: 'payeeFirstName', headerName: 'Payee First Name', width: 150, editable: false},
    {field: 'payeeLastName', headerName: 'Payee Last Name', width: 150, editable: false},
    {field: 'amount', headerName: 'Amount', width: 150, editable: false},
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
    {defaultTheme},
);

function QuickSearchToolbar(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div>
                <GridToolbarFilterButton/>
                <GridToolbarDensitySelector/>
            </div>
            <TextField
                variant="standard"
                value={props.value}
                onChange={props.onChange}
                placeholder="Search…"
                className={classes.textField}
                InputProps={{
                    startAdornment: <SearchIcon fontSize="small"/>,
                    endAdornment: (
                        <IconButton
                            title="Clear"
                            aria-label="Clear"
                            size="small"
                            style={{visibility: props.value ? 'visible' : 'hidden'}}
                            onClick={props.clearSearch}
                        >
                            <ClearIcon fontSize="small"/>
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

export default function History() {

    const [invoices, setInvoices] = React.useState([]);
    const [rows, setRows] = React.useState([]);

    useEffect(() => {
        axiosConfig.get('/controller/invoices', {params: {username: '', account_number: '' }})
            .then(function (response) {
                setRows(response.data);
                setInvoices(response.data);
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
        const filteredRows = invoices.filter((row) => {
            return Object.keys(row).some((field) => {
                return searchRegex.test(row[field].toString());
            });
        });
        setRows(filteredRows);
    };

    React.useEffect(() => {
        setRows(invoices);
    }, [invoices]);

    return (
        <React.Fragment>
            <div style={{height: 400, width: '100%'}}>
                <DataGrid
                    components={{Toolbar: QuickSearchToolbar}}
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