import { Button, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import ChatIcon from '@mui/icons-material/Chat';
import { Link } from 'react-router-dom';

const NewConnection = (props) => {
    const { currentuser, profile } = props;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleConnect = async () => {
        setLoading(true);
        try {
            if (!profile.username) {
                setError('Invalid Username');
                return;
            }
            let res = await fetch(`/profile/${profile.username}/connect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            res = await res.json();
            if (res.error) setError(res.error);
            else {
                setError('');
                setSuccess(true);
            }
        } catch (e) {
            setError('Something went wrong');
        }
        setLoading(false);
    };

    if (currentuser._id && profile.connections.includes(currentuser._id))
        return (
            <Link style={{ textDecoration: 'none' }} to={`/chat`}>
                <Tooltip title="Message">
                    <Button
                        variant="contained"
                        color="success"
                        endIcon={<ChatIcon />}
                    >
                        Message
                    </Button>
                </Tooltip>
            </Link>
        );
    if (currentuser._id && profile.received.includes(currentuser._id))
        return <Chip color="warning" label="Pending" />;
    if (currentuser._id && profile.sent.includes(currentuser._id))
        return <Chip color="warning" label="Pending" />;

    if (currentuser._id)
        return (
            <Box>
                {!success ? (
                    <Box>
                        <LoadingButton
                            disabled={loading ? true : false}
                            variant="contained"
                            onClick={handleConnect}
                            loading={loading}
                        >
                            Connect
                        </LoadingButton>
                        <Typography color="error">{error}</Typography>
                        <Typography color="success">{success}</Typography>
                    </Box>
                ) : (
                    <Chip color="warning" label="Pending" />
                )}
            </Box>
        );

    return <Box></Box>;
};

export default NewConnection;
