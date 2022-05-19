import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import Axios from 'axios';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

import SafeLogin from '../components/forms/safelogin';
import SafeCard from '../components/forms/safecard';
import SafeNote from '../components/forms/safenote';

const Vault = (props) => {

    const navigate = useNavigate();

    const child = useRef();

    const location = useLocation();
    const state = location.state || {};

    const [firstItem, setFirstItem] = useState([]);
    const [lastItem, setLastItem] = useState([]);

    useEffect(() => {
        if (state.data) return;
        Axios.get("http://localhost:3001/showlogins").then((res) => {
            if (res.data.length > 0) {
                setFirstItem({...res.data[0], type: 1});
                return;
            } else {
                Axios.get("http://localhost:3001/showcards").then((res) => {
                    if (res.data.length > 0) {
                        setFirstItem({...res.data[0], type: 2});
                        return;
                    } else {
                        Axios.get("http://localhost:3001/shownotes").then((res) => {
                            if (res.data.length > 0) {
                                setFirstItem({...res.data[0], type: 3});
                                return;
                            }
                        });
                    }
                });
            }
        });
    }, [state.data]);
    
    function handleUpdate(data) {
        setLastItem(data);
    }

    const safeForm = () => {

        var data = [];
        var type = 0;

        if (state.data) {
            data = state.data.id === lastItem.id ? lastItem : state.data;
            type = state.data.type;
        } else {
            data = firstItem;
            type = firstItem.type;
        }

        if (type === 1)
            return <SafeLogin ref={child} prop1={data} onChange={handleUpdate} />
        else if (type === 2)
            return <SafeCard ref={child} prop1={data} onChange={handleUpdate} />
        else if (type === 3)
            return <SafeNote ref={child} prop1={data} onChange={handleUpdate} />
        else
            return navigate('/emptyvault');
    }

    return (
        <>
            <Box sx={{ mb: 4 }}>
                <h2>Vault</h2>
            </Box>
            { safeForm() }
            <Stack direction="row" spacing={2}>
                <Button variant="outlined" onClick={() => child.current.updateItem()} startIcon={<UpdateRoundedIcon />}>
                    Update
                </Button>
                <Button variant="outlined" color="error" onClick={() => child.current.deleteItem()} endIcon={<DeleteRoundedIcon />}>
                    Delete
                </Button>
            </Stack>
        </>
    );
}

export default Vault;