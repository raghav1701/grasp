import React, { useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Login from '../src/components/Login/Login';
import Register from '../src/components/Register/Register';
import Home from '../src/components/Home/Home';
import Roadmap from '../src/components/Home/Roadmap/Roadmap';
import Search from '../src/components/Search/Search';
import { UserContext, UserProvider } from './context/UserContext';

//classes
import classes from './App.css';
import Profile from './components/Profile/Profile';
import ChatContainer from './components/Chat/ChatContainer';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Routes() {
    const [user, setUser] = React.useContext(UserContext);
    const hist = useHistory();

    useEffect(() => {
        const fetchUser = async () => {
            let res = await fetch('/auth/user');
            res = await res.json();
            return res;
        };
        fetchUser().then((res) => {
            if (!res.error) {
                setUser(() => {
                    return {
                        ...res,
                        id: res.id,
                    };
                });
                hist.push('/');
            }
        });
    }, []);

    return (
        <Switch>
            <Route exact path="/login">
                <Login />
            </Route>
            <Route exact path="/register">
                <Register />
            </Route>
            <Route exact path="/search">
                <Search />
            </Route>
            <Route exact path="/roadmap/:id">
                <Roadmap />
            </Route>
            <Route exact path="/profile/:username">
                <Profile />
            </Route>
            {user && user._id && (
                <Route exact path="/chat">
                    <ChatContainer />
                </Route>
            )}
            <Route exact path="/">
                {!user || !user._id ? (
                    <Redirect to="/login" />
                ) : (
                    <Home user={user} />
                )}
            </Route>
        </Switch>
    );
}

function App() {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#2A2438',
            },
        },
    });
    return (
        <ThemeProvider theme={theme}>
            <UserProvider>
                <Routes />
            </UserProvider>
        </ThemeProvider>
    );
}

export default App;
