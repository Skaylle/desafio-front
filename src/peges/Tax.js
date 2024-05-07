import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import TableStandard from "../components/TableStandard";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from "../helpers/useFormHelper.ts";
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import TaxService from "../services/taxService";
import { Caption } from "../Style";
import * as FaIcons from "react-icons/fa";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const columns = [
    { field: 'name', headerName: 'Impost' },
    { field: 'percent', headerName: 'Percentual %' },
    { field: 'description', headerName: 'Descrição' },
];

const ProductType = () => {
    const [taxes, setTaxes] = useState([]);
    const [values, setValues] = useState([]);
    const [row, setRow] = useState({});

    const resetForm = () => {
        setRow({});
    }

    const { form, onChangeInput, clearForm, setFormValues, inputError, updateError } = useForm(
        {
            defaultValues: { name: '', description: '', percent: '' },
            resetForm: resetForm,
            requiredFields: {
                percent: {status: false, message: ''},
                name: {status: false, message: ''},
                description: {status: false, message: ''},
            },
        })

    useEffect(() => {
        getAllTaxes();
    }, []);


    const getAllTaxes = async () => {
        const data = await TaxService.getAllTax();
        setTaxes(data);
    }

    const handlerChangeFilter = (e) => {
        const { value } = e.target;
        onChangeInput(value, "search");

        if (!value) {
            getAllTaxes();
            return;
        }

        const searchValue = value.toLowerCase();
        const filtered = taxes?.filter(data => {
            return data && data.name && data.name.toLowerCase().includes(searchValue);
        });

        setTaxes(filtered || []);
    }

    const handleCreatForm = async () => {
        updateError(form);

        let save;
        if (form.id) {
            save = await TaxService.updateFormData(form.id, JSON.stringify(form));
        } else {
            save = await TaxService.createFormData(JSON.stringify(form));
        }

        if (save.success) {
            getAllTaxes();
            clearForm();
            toast.success(save.message, { autoClose: 3000 });
        }else{
            toast.error(save.message, { autoClose: 3000 });
        }
    }

    const handleRowClick = (rowData) => {
        setRow(rowData);
    }

    const actionsTable = async (action) => {
        switch (action) {
            case 'edit':
                setFormValues(row);
                break;
            case 'delete':
                const response = await TaxService.taxDelete(row.id);
                if (response.success) {
                    toast.success(response.message, { autoClose: 3000 });
                    getAllTaxes();
                    clearForm();
                    return;
                }
                toast.success(response.message, { autoClose: 3000 });
                break;
        }
    }

    return (
        <div className='productType'>
            <Box
                component="form"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Grid>
                    <TextField
                        name="search"
                        label="Pesquisar"
                        variant="standard"
                        placeholder='Buscar pelo nome ou imposto'
                        onChange={handlerChangeFilter}
                        value={form?.search ?? ''}
                        sx={{ width: '20ch' }}
                    />
                </Grid>

                {Object.keys(row).length > 0 && (
                    <Grid container spacing={1} justifyContent="flex-end">
                        <Grid item>
                            <Link to='#' title="Editar">
                                <FaIcons.FaPencilAlt size={20} color="blue" onClick={() => {
                                    actionsTable('edit')
                                }} />
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to='#' title="Apagar">
                                <FaIcons.FaTrashAlt size={20} color="red" onClick={() => {
                                    actionsTable('delete')
                                }} />
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to='#' title="Cancelar" onClick={() => {
                                setRow({})
                            }}>
                                <FaIcons.FaUndo size={20} color="gray" />
                            </Link>
                        </Grid>
                    </Grid>
                )}
            </Box>

            <Grid>
                <TableStandard
                    columns={columns}
                    data={taxes}
                    onRowClick={handleRowClick}
                />
            </Grid>

            <Caption>
                <div style={{ textAlign: 'center', marginTop: '5%' }}>
                    Incluir
                </div>
            </Caption>

            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '10ch' },
                }}
                autoComplete="off"
            >
                <TextField
                    error={inputError.name.status ?? false}
                    helperText={inputError.name.message ?? ''}
                    required={true}
                    name="name"
                    label="Imposto"
                    variant="standard"
                    onChange={e => onChangeInput(e.target.value, 'name')}
                    value={form?.name}
                />

                <TextField
                    error={inputError.percent.status ?? false}
                    helperText={inputError.percent.message ?? ''}
                    required={true}
                    name="percent"
                    label="Percentual"
                    variant="standard"
                    onChange={e => onChangeInput(e.target.value, 'percent')}
                    value={form?.percent}
                />
            </Box>

            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '31ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    name="description"
                    label="Descrição"
                    variant="standard"
                    rows={4}
                    multiline
                    value={form?.description}
                    onChange={e => onChangeInput(e.target.value, 'description')}
                />
            </Box>

            <Grid style={{ textAlign: 'center' }}>
                <Button variant="outlined" color="success" onClick={() => handleCreatForm()}>Incluir</Button>
                {' '}
                <Button variant="outlined" color="secondary" onClick={clearForm}>Limpar</Button>
            </Grid>

        </div>
    );
}

export default ProductType;
