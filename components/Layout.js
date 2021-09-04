import React, { useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'
import NextLink from 'next/link';
import { createTheme } from '@material-ui/core/styles';
import { AppBar, Container, Link, Switch, Toolbar, ThemeProvider, Typography, Button } from '@material-ui/core';
import useStyles from '../utils/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ExitToApp } from '@material-ui/icons';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';

export default function Layout({ title, description, children, style = {} }) {
  const router = useRouter()
  const { state, dispatch } = useContext(Store);
  const { darkMode, userInfo } = state;
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0'
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0'
      }
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      }
    }
  });
  const classes = useStyles();
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON'});
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'dark' : 'light');
  }
  return (
    <div data-testid='layout'>
      <Head>
          <title>{title ? `${title} - ROUTINEXT` : 'ROUTINEXT'}</title>
        {description  && <meta name="description" content={description}/>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar className={classes.navbar} position="static">
          <Toolbar>
            <NextLink href="/" passHref>
              <Link><Typography className={classes.brand}>ROUTINEXT</Typography></Link>
            </NextLink>
            <div className={classes.grow}></div>
            <div style={{ display: 'flex', alignItems: 'center'}}>
              <Switch checked={darkMode} onChange={darkModeChangeHandler}></Switch>
              <NextLink href={userInfo ? '/profile' : '/login'} passHref>
                <Link>{userInfo ? userInfo.name : 'Login'}</Link>
              </NextLink>
              {userInfo && (
                <Button
                  startIcon={<ExitToApp />}
                  onClick={() => {
                    Cookies.set('userInfo', null);
                    dispatch({ type: 'USER_LOGOUT' });
                    router.push('/login');
                  }}
                />
              )}
            </div>
          </Toolbar>
        </AppBar>
      <Container className={classes.main} style={style}>
        {children}
      </Container>
      <footer className={classes.footer}>
        <Typography>
          Application made by Zaquiel Rodriguez Arce
        </Typography>
      </footer>
      </ThemeProvider>
    </div>
  );
}
