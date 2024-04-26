import * as React from 'react';
import History from './History';
import Units from './Units';
import {Grid, Paper} from "@mui/material";
import Title from './Title';

export default function FinancialAdvisor() {
    return (
        <React.Fragment>
            <Grid container spacing={3}>
                {/* Recent Orders */}
                <Grid item xs={12}>
                    <Title> Units </Title>
                    <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                        <Units/>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Title> Invoices </Title>
                    <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                        <History/>
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}