import React, { useImperativeHandle, forwardRef, useEffect } from 'react';

import axios from '../../api/axios';
import Swal from 'sweetalert2';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import { VaultItemTypes } from '../../constants';
import validateSafeForm from './validateSafeForm';
import useAuth from '../../hooks/useAuth';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';

const SafeNote = forwardRef((props, ref) => {

    const { auth } = useAuth();

    const [values, setValues] = React.useState({
        type: 0,
        id: 0,
        title: '',
        note: '',
        prompt: false
    });

    const handleChange = (props) => (event) => {
        event.preventDefault();
        setValues({ ...values, [props]: event.target.value });
    };

    const handlePromptChange = (event) => {
        setValues({ ...values, prompt: event.target.checked });
    };

    useEffect(() => {
        if (props.prop1) {
            setValues({
                type: props.prop1.type || 0,
                id: props.prop1.id || 0,
                title: props.prop1.title || '',
                note: props.prop1.note || '',
                prompt: Boolean(props.prop1.prompt) || false
            });
        }
    }, [props]);

    useImperativeHandle(ref, () => ({
        addItem() {
            if (Object.keys(validateSafeForm(values, VaultItemTypes.Note)).length) {
                return Swal.fire({
                    title: 'Error!',
                    text: 'Please fill out the fields.',
                    icon: 'error',
                    showConfirmButton: false,
                    showCloseButton: true,
                    closeButtonHtml: '&times;',
                    timer: 1500
                });
            }

            axios.post('/addnote', {
                user: auth?.id,
                title: values.title,
                note: values.note,
                prompt: values.prompt
            }).then(res => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Note has been added to your vault.',
                    icon: 'success',
                    // showConfirmButton: false,
                    confirmButtonColor: '#318ce7',
                    confirmButtonText: 'Okay',
                    showCloseButton: true,
                    closeButtonHtml: '&times;',
                    timer: 5000
                }).then((result) => {
                    window.location.reload();
                });
            });
        },

        updateItem() {
            if (Object.keys(validateSafeForm(values, VaultItemTypes.Note)).length) {
                return Swal.fire({
                    title: 'Error!',
                    text: 'Please fill out the fields.',
                    icon: 'error',
                    showConfirmButton: false,
                    showCloseButton: true,
                    closeButtonHtml: '&times;',
                    timer: 1500
                });
            }

            axios.post(`/updatenote/${values.id}`, {
                title: values.title,
                note: values.note,
                prompt: values.prompt
            }).then(() => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Note has been updated.',
                    icon: 'success',
                    confirmButtonColor: '#318ce7',
                    confirmButtonText: 'Okay',
                    showCloseButton: 'true',
                    closeButtonHtml: '&times;',
                    timer: 5000
                }).then((result) => {
                    props.onUpdate(values);
                });
            });
        },

        deleteItem() {
            axios.delete(`/deletenote/${values.id}`)
                .then(() => {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Note has been removed from your vault.',
                        icon: 'success',
                        confirmButtonColor: '#318ce7',
                        confirmButtonText: 'Okay',
                        showCloseButton: 'true',
                        closeButtonHtml: '&times;',
                        timer: 5000
                    }).then((result) => {
                        props.onDelete();
                    });
                });
        },
    }))

    return (
        <>
            <Box
                component="form"
                noValidate
                autoComplete="on"
                sx={{ mb: 1.5 }}
            >
                <TextField
                    fullWidth
                    id="outlined-name"
                    label="Name"
                    value={values.title}
                    onChange={handleChange('title')}
                />
            </Box>

            <Box sx={{ mb: 1.5 }}>
                <TextField
                    label="Note"
                    id="outlined-end-adornment"
                    position="end"
                    placeholder="Note"
                    multiline
                    rows={3}
                    style={{ minWidth: '25%', width: '100%' }}
                    value={values.note}
                    onChange={handleChange('note')}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <Tooltip title="Copy">
                                    <IconButton
                                        aria-label="copy input"
                                        onClick={() => navigator.clipboard.writeText(values.note)}
                                        edge="end"
                                    >
                                        <ContentCopyRoundedIcon />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Box sx={{ width: '100%', mb: 1 }}>
                <Stack direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ mb: 4 }}
                >
                    <Typography variant="subtitle2" id="masterpassword-re">
                        Master Password reprompt
                    </Typography>
                    <Checkbox
                        size="small"
                        checked={values.prompt}
                        onChange={handlePromptChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </Stack>
            </Box>
        </>
    );
});

export default SafeNote;
