import React, {useRef} from 'react';
import {Grid, Paper} from "@mui/material";
import Title from './Title';
import {  TextField } from '@material-ui/core';
import axiosConfig from '../Config/axiosConfig';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function saveFormData(data){

    if(!data.firstname){
        alert("Enter first name");
        return;
    }
    if(!data.lastName){
        alert("Enter last name");
        return;
    }
    if(!data.nic){
        alert("Enter NIC");
        return;
    }
    if(!data.address){
        alert("Enter address");
        return;
    }
    if(!data.distrct){
        alert("Enter district");
        return;
    }
    if(!data.email){
        alert("Enter email");
        return;
    }
    if(!data.mobile){
        alert("Enter mobile");
        return;
    }

    var jsonData = {
        "id":"",
        "accountNumber":"",
        "consumerFirstName": data.firstname,
        "consumerLastName": data.lastName,
        "consumerNIC": data.nic,
        "consumerAddress": data.address,
        "consumerDistrict": data.distrct,
        "consumerEmail": data.email,
        "consumerMobile" : data.mobile
    };

    axiosConfig.post('/account', jsonData)
        .then(function (response) {
            alert("Save Success");
            window.location.reload();
        })
        .catch(function (error) {
            alert("Error" + error);
        });
}

export default function Form() {
    const firstName = useRef('');
    const lastName = useRef('');
    const nic = useRef('');
    const address = useRef('');
    const distrct = useRef('');
    const email = useRef('');
    const mobile = useRef('');

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                {/* Recent Orders */}
                <Grid item xs={12} md={2} lg={2}>
                </Grid>
                {/* Chart */}
                <Grid item xs={12} md={8} lg={8}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 500,
                        }}
                    >
                        <React.Fragment>
                            <Title>Enter consumer details</Title>
                            <TextField
                                required
                                id="first-name"
                                label="First Name"
                                inputRef={firstName}
                            />
                            <TextField
                                required
                                id="last-name"
                                label="Last Name"
                                inputRef={lastName}
                            />
                            <TextField
                                required
                                id="nic"
                                label="NIC"
                                inputRef={nic}
                            />
                            <TextField
                                required
                                id="address"
                                label="Address"
                                inputRef={address}
                            />
                            <TextField
                                required
                                id="distrcit"
                                label="Distrcit"
                                inputRef={distrct}
                            />
                            <TextField
                                required
                                id="email"
                                label="Email"
                                inputRef={email}
                            />
                            <TextField
                                required
                                id="mobile-number"
                                label="Mobile"
                                inputRef={mobile}
                            />
                                <Stack direction="row" >
                                    <Button variant="contained" onClick={() => {
                                        saveFormData({
                                            firstname: firstName.current.value,
                                            lastName: lastName.current.value,
                                            nic: nic.current.value,
                                            address: address.current.value,
                                            distrct: distrct.current.value,
                                            email: email.current.value,
                                            mobile: mobile.current.value
                                        })
                                    }}>Pay</Button>
                                </Stack>
                        </React.Fragment>
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}