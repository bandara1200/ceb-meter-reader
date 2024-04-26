import React, {useRef} from 'react';
import {Grid, Paper} from "@mui/material";
import Typography from '@mui/material/Typography';
import Title from './Title';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {SearchOutlined} from '@material-ui/icons';
import {TextField, IconButton} from '@material-ui/core';
import axiosConfig from '../Config/axiosConfig';
import {unitSave} from './api/unitSave';
import {getAllUserData} from "../actions/session";
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import PropTypes from 'prop-types';
import {
    DataGrid,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import {createTheme} from '@mui/material/styles';
import {createStyles, makeStyles} from '@mui/styles';

function saveUnit(data) {

    if (!data.units) {
        alert("enter current units");
        return;
    }
    if (!data.account) {
        alert("Search account");
        return;
    }

    const session = getAllUserData();

    var date = new Date();
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    var jsonData = {
        "id": "",
        "month": month[date.getMonth()],
        "unit": data.units,
        "amount": data.amount,
        "unitAccounts": data.account,
        "meterReader": {
            "id": session.id,
            "username": session.username,
            "firstName": session.firstName,
            "lastName": session.lastName,
            "email": session.email,
            "mobile": session.mobile
        }
    };

    axiosConfig.post(process.env.REACT_APP_APIM_READINGS_PREFIX + process.env.REACT_APP_API_PREFIX + '/meter-readings', jsonData)
        .then(function (response) {
            alert("Save Success");
            window.location.reload();
        })
        .catch(function (error) {
            alert(error);
        });
    unitSave(data);
}

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

const columns = [
    {field: 'id', hide: true},
    {field: 'unitAccounts', headerName: 'Account', width: 150},
    {field: 'month', headerName: 'Month', width: 150, editable: false},
    {field: 'unit', headerName: 'Readings', width: 150, editable: false},
    {field: 'amount', headerName: 'Amount', width: 150, editable: false},
    {field: 'lastModifiedDate', headerName: 'Date', width: 400, editable: false},
]

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



export default function MeterReader() {
    const [query, setQuery] = React.useState('');
    const [value, setValue] = React.useState('');
    const [lastUnit, setLastUnit] = React.useState('');
    const [searchText, setSearchText] = React.useState('');
    const [readings, setReadings] = React.useState([]);
    const [rows, setRows] = React.useState([]);
    const [selection, setSelection] = React.useState();
    const [account, setAccount] = React.useState('');
    const valueRef = useRef('');
    const amountRef = useRef('');


    function fvalueCal(value) {
        setValue(value * 2);
    }

    const valuecal = async (e) => {
            console.log(e);
            console.log(value);
    }

    const search = async (e) => {
        if (e.key === 'Enter') {
            axiosConfig.get(process.env.REACT_APP_APIM_ACCOUNT_PREFIX + process.env.REACT_APP_API_PREFIX +  '/account', {params: {mobile_number: '', account_number: query}})
                .then(function (response) {
                    setAccount(response);
                    axiosConfig.get(process.env.REACT_APP_APIM_READINGS_PREFIX + process.env.REACT_APP_API_PREFIX +  '/meter-readings', {
                        params: {
                            account_no: query
                        }
                    })
                        .then(function (response) {
                            setLastUnit(response);
                            axiosConfig.get(process.env.REACT_APP_APIM_CONTROLLER_PREFIX + process.env.REACT_APP_API_PREFIX +  '/controller/readings', {
                                params: {
                                    account_no: query
                                }
                            })
                                .then(function (response) {
                                    console.log(response);
                                    setReadings(response.data);
                                    setRows(response.data);
                                    setQuery('');
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                })
                .catch(function (error) {
                    alert(error);
                });
        }
    }

    const updateSelection = (event, value) => {
        setSelection(value);
    };

    const requestSearch = (searchValue) => {
        setSearchText(searchValue);
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
        const filteredRows = readings.filter((row) => {
            return Object.keys(row).some((field) => {
                return searchRegex.test(row[field].toString());
            });
        });
        setRows(filteredRows);
    };

    console.log(value);

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                {/* Recent Orders */}
                <Grid item xs={12} md={5} lg={4}>
                    <Paper sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 180,
                    }}>
                        <React.Fragment>
                            <Title>Search Account</Title>
                            <TextField
                                id="standard-search"
                                label="Search by Account"
                                type="search"
                                variant="standard"
                                InputProps={{
                                    endAdornment: (
                                        <IconButton>
                                            <SearchOutlined onClick={console.log("clicked ")}/>
                                        </IconButton>
                                    ),
                                }}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={search}
                            />
                        </React.Fragment>
                    </Paper>
                </Grid>
                {/* Chart */}
                <Grid item xs={12} md={5} lg={4}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 260,
                        }}
                    >
                        <React.Fragment>
                            <Title>Last Entered Readings</Title>
                            <Typography component="p" variant="h4" sx={{flex: 1}}>
                                {lastUnit && (lastUnit.data.unit)}
                            </Typography>
                            <Typography color="text.secondary">
                                Month : {lastUnit && (lastUnit.data.month)}
                            </Typography>
                            <Typography color="text.secondary">
                                Account Number : {account && (account.data.accountNumber)}
                            </Typography>
                            <Typography color="text.secondary">
                                Owner Name : {account && (account.data.consumerFirstName + ' '+  account.data.consumerLastName)}
                            </Typography>
                            <div>
                                <Typography component="p" variant="p">
                                    Due Amount : Rs {lastUnit && (lastUnit.data.amount)}
                                </Typography>
                            </div>
                        </React.Fragment>
                    </Paper>
                </Grid>
                {/* Recent Deposits */}
                <Grid item xs={12} md={5} lg={4}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 260,
                        }}
                    >
                        <Title>Enter Reading Details</Title>
                        <TextField
                            id="outlined-number"
                            label="Enter current units"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{flex: 1}}
                            inputRef={valueRef}
                            onChange={(e) => fvalueCal(e.target.value)}
                        />
                        <Typography color="text.secondary" sx={{flex: 1}}>
                        </Typography>
                        <InputLabel htmlFor="standard-adornment-amount"></InputLabel>
                        <Input
                            id="standard-adornment-amount"
                            label="amount"
                            inputRef={amountRef}
                            startAdornment={<InputAdornment position="start">Rs</InputAdornment>}
                            value={value}
                        />
                        <Typography color="text.secondary" sx={{flex: 1}}>
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" onClick={() => {
                                saveUnit(
                                    {
                                        units: valueRef.current.value,
                                        account: account.data,
                                        amount: amountRef.current.value
                                    }
                                )
                            }}>Save</Button>
                        </Stack>

                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                        <React.Fragment>
                            <Title>Reading History</Title>
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
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}