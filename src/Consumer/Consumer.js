import React, {useRef, useEffect} from 'react';
import {Grid, Paper} from "@mui/material";
import './consumer.css';
import Title from './Title';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
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
import { getAllUserData } from "../actions/session";

const columns = [
    {field: 'id', hide: true},
    {field: 'transactionId', headerName: 'Transaction ID', width: 250},
    {field: 'createdBy', headerName: 'Date', width: 200, editable: false},
    {field: 'paymentType', headerName: 'Method', width: 250, editable: false},
    {field: 'amount', headerName: 'Amount', width: 400, editable: false},
]

function preventDefault(event) {
    event.preventDefault();
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

function postData(data) {

    if (!data.payAmount) {
        alert("Enter payment amount");
        return;
    }
    if (!data.account) {
        alert("Select account number");
        return;
    }
    if (!data.payMethod) {
        alert("Select payment method");
        return;
    }

    const session = getAllUserData();

    var jsonData = {
        "id": "",
        "transactionId": "",
        "amount": data.payAmount,
        "method": data.payMethod,
        "invoiceAccounts": data.account,
        "payee": {
            "id": session.id,
            "username": session.username,
            "firstName": session.firstName,
            "lastName": session.lastName,
            "email": session.email,
            "mobile": session.mobile
        }

    };

    axiosConfig.post('/consumer/payments', jsonData)
        .then(function (response) {
            alert("payment success");
            window.location.reload();
        })
        .catch(function (error) {
            alert(error);
        });
}

export default function Consumer() {
    const [account, setAccount] = React.useState("");
    const [searchText, setSearchText] = React.useState('');
    const [invoices, setInvoices] = React.useState([]);
    const [rows, setRows] = React.useState([]);
    const valueRef = useRef('');
    const [selection, setSelection] = React.useState();
    const [userAccounts, setUserAccounts] = React.useState([]);


    const updateSelection = (event, value) => {
        setSelection(value);
    };

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

    function clickAccountNumber(account){
        axiosConfig.get('/account', {params : {mobile_number: '', account_number: account.accountNumber}})
            .then(function (response) {
                setAccount(response.data);
            })
            .catch(function (error) {
                alert(error);
            });
        axiosConfig.get('/consumer/invoices', {params : {account_number: account.accountNumber, username: ''}})
            .then(function (response) {
                setInvoices(response.data);
                setRows(response.data);
            })
            .catch(function (error) {
                alert(error);
            });
    }

    useEffect(() => {
        const session = getAllUserData();
        axiosConfig.get('/consumer/accounts', {params: {username: session.username}})
            .then(function (response) {
                setUserAccounts(response.data);
            })
            .catch(function (error) {
                alert(error);
            });
    }, []);

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={3}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                        }}
                    >
                    <Title>Account List</Title>
                    <ul>
                        {userAccounts.map(function (d, idx) {
                            return (<li key={idx}
                                        onClick={() =>
                                            clickAccountNumber(d)
                                        }>{d.accountNumber}</li>)
                        })}
                    </ul>
                    </Paper>
                </Grid>
                {/* Recent Deposits */}
                <Grid item xs={12} md={4} lg={3}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                        }}
                    >
                        <React.Fragment>
                            <Title>Outstanding</Title>
                            <Typography component="p" variant="h4">
                                ${account.outstandAmount}
                            </Typography>
                            <Typography color="text.secondary" sx={{flex: 1}}>
                                ${account.lastModifiedDate}
                            </Typography>
                        </React.Fragment>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={5} lg={4}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                        }}
                    >
                        <React.Fragment>
                            <FormLabel>Selected Account : {account.accountNumber} </FormLabel>
                            <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start">Rs</InputAdornment>}
                                label="Amount"
                                inputRef={valueRef}
                            />
                            <FormLabel component="legend">Payment Methods</FormLabel>
                            <RadioGroup name="value" row aria-label="paymentMethods"
                                        name="row-radio-buttons-group" value={selection}
                                        onChange={updateSelection}>
                                <FormControlLabel value="visa" control={<Radio/>} label="Visa"/>
                                <FormControlLabel value="master" control={<Radio/>} label="Master"/>
                                <FormControlLabel value="easyCash" control={<Radio/>} label="easyCash"/>
                            </RadioGroup>
                            <Stack direction="row" spacing={2}>
                                <Button variant="contained" onClick={() => {
                                    postData({
                                        payAmount: valueRef.current.value,
                                        payMethod: selection,
                                        account: account
                                    })
                                }}>Pay</Button>
                            </Stack>
                        </React.Fragment>
                    </Paper>
                </Grid>
                {/* Recent Orders */}
                <Grid item xs={12}>
                    <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                        <React.Fragment>
                            <Title>Recent Payments</Title>
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