import * as React from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import Icon from '@mui/material/Icon';
import classes from './Navbar.css';
import { Avatar, Button, Tooltip } from '@mui/material';
import { UserContext } from '../../context/UserContext';
import LogoutIcon from '@mui/icons-material/Logout';
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const EmptySpace = styled('div')(({ theme }) => ({
    flexGrow: 1,
    margin: 'auto 1rem',
}));

const Container = styled('div')(({ theme }) => ({
    // position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
}));

const Navbar = (props) => {
    const [user, setUser] = React.useContext(UserContext);
    // console.log(user.id);
    const pathname = useLocation().pathname;
    const hist = useHistory();
    const [showSearch, setShowSearch] = React.useState(
        props.search ? props.search : false
    );
    React.useEffect(() => {
        if (props.search === undefined && pathname !== '/search') {
            setShowSearch(true);
        }
    }, []);

    const handleLogout = async () => {
        try {
            let res = await fetch('/auth/logout', { method: 'POST' });
            res = await res.json();
            if (!res.success) throw res.error;
            else {
                hist.replace('/login');
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleChat = () => {
        hist.push('/chat', { chatUser: null });
    };

    return (
        <Container>
            <AppBar position="static" color="primary">
                <Toolbar
                    style={{
                        minHeight: '10vh',
                        height: '10vh',
                    }}
                >
                    <Link style={{ textDecoration: 'none' }} to="/">
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            color="#DBD8E3"
                            sx={{
                                // flexGrow: 1,
                                display: { sm: 'block' },
                            }}
                        >
                            Grasp
                        </Typography>
                    </Link>
                    <EmptySpace />
                    {showSearch ? (
                        <Link
                            style={{
                                marginRight: '1rem ',
                            }}
                            to="/search"
                        >
                            <Tooltip title="Search">
                                <IconButton>
                                    <Icon style={{ color: 'white' }}>
                                        search
                                    </Icon>
                                </IconButton>
                            </Tooltip>
                        </Link>
                    ) : null}
                    {/* <EmptySpace /> */}
                    {user._id &&
                        (props.message === undefined || props.message) && (
                            <Tooltip
                                title="Message"
                                style={{ marginRight: '1rem' }}
                            >
                                <IconButton onClick={handleChat}>
                                    <Icon style={{ color: 'white' }}>chat</Icon>
                                </IconButton>
                            </Tooltip>
                        )}
                    {user._id && (
                        <Tooltip title="Logout">
                            <IconButton onClick={handleLogout}>
                                <Icon style={{ color: 'red' }}>logout</Icon>
                            </IconButton>
                        </Tooltip>
                    )}
                </Toolbar>
            </AppBar>
        </Container>
    );
};

export default Navbar;
