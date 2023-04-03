import React, { useEffect } from 'react';

//componene
import Panel from './Dashboard/Dashboard';
import Roadmap from './Roadmap/Roadmap';
import Navbar from '../Navbar/Navbar';

//classes
import classes from './Home.css';
import { Box } from '@mui/system';
import { UserContext } from '../../context/UserContext';

const Home = (props) => {
    const [user, setUser] = React.useState(props.user);

    return (
        <div className={classes.Home}>
            <Navbar />
            <Box className={classes.Box}>
                <Panel user={user} setUser={setUser} />
            </Box>
        </div>
    );
};

export default Home;
