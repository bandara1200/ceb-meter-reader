import './Dashboard.css';
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {mainListItems, secondaryListItems} from './listItems';
import {Badge, Container} from "@mui/material";
import {Link} from "@mui/icons-material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import Consumer from '../Consumer/Consumer';
import FinancialAdvisor from '../FinanacialAdvisor/FinancialAdvisor';
import MeterReader from '../MeterReader/MeterReader';
import Form from '../Form/Form';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {isValidSession, getAllSessionParameters, decodeIdToken} from "../actions/session";
import pkceChallenge from 'pkce-challenge';

const drawerWidth = 240;

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function ResponsiveDrawer(props) {
    const {window} = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [idToken, setIdToken] = React.useState({});
    const [tokenResponse, setTokenResponse] = React.useState({});
    useEffect( () => {
        if (isValidSession()) {
            const session = getAllSessionParameters();
            const _tokenResponse = {
                access_token: session.ACCESS_TOKEN,
                refresh_token: session.REFRESH_TOKEN,
                scope: session.SCOPE,
                id_token: session.ID_TOKEN,
                token_type: session.TOKEN_TYPE,
                expires_in: parseInt(session.EXPIRES_IN),
            };
            setTokenResponse(_tokenResponse);
            setIdToken(decodeIdToken(session.ID_TOKEN));
            setIsLoggedIn(true);
            return;
        }
        /*const code = new URL(window.location.href).searchParams.get("code");

        if (code) {
            sendTokenRequest(code)
                .then(response => {
                    console.log("TOKEN REQUEST SUCCESS", response);
                    setTokenResponse(response[0]);
                    setIdToken(response[1]);
                    setIsLoggedIn(true);
                })
                .catch((error => {
                    console.log("TOKEN REQUEST ERROR", error);
                    setIsLoggedIn(false);
                }));
        }*/

        //initAuthenticatedUserSession(user);

    }, []);

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <BrowserRouter>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <AppBar
                    position="fixed"
                    sx={{
                        width: {sm: `calc(100% - ${drawerWidth}px)`},
                        ml: {sm: `${drawerWidth}px`},
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{mr: 2, display: {sm: 'none'}}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{flexGrow: 1}}
                        >
                            Dashboard
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon/>
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                { isLoggedIn? <>
                    <Box
                        component="nav"
                        sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                        aria-label="mailbox folders"
                    >
                        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                        <Drawer
                            container={container}
                            variant="temporary"
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                            sx={{
                                display: {xs: 'block', sm: 'none'},
                                '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                            }}
                        >
                            <Toolbar
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    px: [1],
                                }}
                            >
                            </Toolbar>
                            <Divider/>
                            <List>{mainListItems}</List>
                            <Divider/>
                            <List>{secondaryListItems}</List>
                        </Drawer>
                        <Drawer
                            variant="permanent"
                            sx={{
                                display: {xs: 'none', sm: 'block'},
                                '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                            }}
                            open
                        >
                            <Toolbar
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    px: [1],
                                }}
                            >
                            </Toolbar>
                            <Divider/>
                            <List>{mainListItems}</List>
                            <Divider/>
                            <List>{secondaryListItems}</List>
                        </Drawer>
                    </Box>
                </> : <></> }




                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar/>
                    <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
                        <Routes>
                            <Route path="financial" element={<FinancialAdvisor />} />
                            <Route path="meter-reader" element={<MeterReader />} />
                            <Route path="consumer" element={<Consumer />} />
                            <Route path="form" element={<Form />} />
                        </Routes>
                        <Copyright sx={{pt: 4}}/>
                    </Container>
                </Box>
            </Box>
        </BrowserRouter>
    );
}

ResponsiveDrawer.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default ResponsiveDrawer;

