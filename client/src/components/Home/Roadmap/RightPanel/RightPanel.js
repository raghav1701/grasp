import React, { useState, useEffect } from 'react';
import classes from './RightPanel.css';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';
import {
    Avatar,
    Chip,
    CircularProgress,
    FormControl,
    FormGroup,
    Grid,
    Tooltip,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import AddBoxIcon from '@mui/icons-material/AddBox';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const RightPanel = (props) => {
    const [description, setDescription] = useState(null);
    const [material, setMaterial] = useState([]);

    const [newMaterial, setNewMaterial] = useState(null);

    const [isDataChanged, setIsDataChanged] = useState(false);

    useEffect(() => {
        setDescription(props.data.sub.description);
        setMaterial(props.data.sub.materials);
    }, [props]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(description, material);
        props.updateSubtopic(
            {
                materials: material,
                description: description,
            },
            props.data.index,
            props.data.ind
        );
    };

    const descriptionHandler = (e) => {
        setIsDataChanged(true);
        setDescription(e.target.value);
    };

    const addMatHandler = () => {
        if (newMaterial != null) {
            setMaterial((prev) => [...prev, newMaterial]);
            setIsDataChanged(true);
            setNewMaterial(null);
        }
    };
    const handleMatDelete = (i) => {
        setMaterial((prev) => {
            let newMat = [...prev];
            newMat.splice(i, 1);
            return newMat;
        });
        setIsDataChanged(true);
    };

    return (
        <Grid item xs={12} md={3} className={classes.Container}>
            <Typography
                style={{
                    textAlign: 'left',
                    width: '100%',
                    marginBottom: '20px',
                }}
                variant="h5"
            >
                {props.data.sub.topic}
            </Typography>

            <TextField
                id="outlined-multiline-static"
                label="Multiline"
                color="primary"
                className={classes.textArea}
                multiline
                name="description"
                id="description"
                rows={10}
                value={description}
                onChange={descriptionHandler}
            />
            <div className={classes.parent} style={{ margin: '30px 0 0 0' }}>
                <label style={{ margin: '30px 0 0 0', textAlign: 'center' }}>
                    Material
                </label>
                <div className={classes.boxbox}>
                    {material.length != 0 &&
                        material.map((g, index) => (
                            <Chip
                                key={index}
                                label={g}
                                variant="outlined"
                                style={{
                                    margin: '0.2em',
                                    backgroundColor: 'white',
                                }}
                                size="small"
                                onDelete={() => handleMatDelete(index)}
                            />
                        ))}
                </div>
                <div className={classes.box}>
                    <TextField
                        onChange={(e) => {
                            setNewMaterial(
                                e.target.value === '' ? null : e.target.value
                            );
                        }}
                        value={newMaterial || ''}
                        style={{ margin: '10px 0' }}
                        size="small"
                        id="standard-basic"
                        label="Material"
                        name="material"
                        variant="outlined"
                    />
                    <IconButton
                        onClick={addMatHandler}
                        style={{ margin: '10px 0' }}
                        size="small"
                        color="primary"
                        aria-label="add"
                    >
                        <AddBoxIcon />
                    </IconButton>
                </div>
            </div>
            {isDataChanged && (
                <Button
                    style={{ marginTop: '20px' }}
                    variant="text"
                    onClick={handleSubmit}
                >
                    UPDATE
                </Button>
            )}
        </Grid>
    );
};

export default RightPanel;
