import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import TableStandard from "../components/TableStandard";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from "../helpers/useFormHelper.ts";
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import ProductTypeService from "../services/productTypeService";
import TaxService from "../services/taxService";
import { Caption } from "../Style";
import * as FaIcons from "react-icons/fa";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const columns = [
    { field: 'name', headerName: 'Tipo' },
    { field: 'tax_label', headerName: 'Imposto' },
    { field: 'percent', headerName: 'Percentual %' },
    { field: 'description', headerName: 'Descrição' },
];

const ProductType = () => {
    const [productType, setProductType] = useState([]);
    const [values, setValues] = useState([]);
    const [row, setRow] = useState({});

    const resetForm = () => {
        setRow({});
    }

    const { form, onChangeInput, clearForm, setFormValues, inputError, updateError } = useForm(
        {
            defaultValues: { tax_id: '', name: '', description: '', prefix: 'RT' },
            resetForm: resetForm,
            requiredFields: {
                tax_id: {status: false, message: ''},
                name: {status: false, message: ''},
                description: {status: false, message: ''},
            },
        })

    useEffect(() => {
        getProductTypes();
        getAllTaxes();
    }, []);

    const getProductTypes = async () => {
        const data = await ProductTypeService.getProductTypes();
        setProductType(data);
    }

    const getAllTaxes = async () => {
        const data = await TaxService.getAllTax()
        data?.forEach((item) => {
            values.push({
                value: item.id,
                label: item.name,
            });
        })
    }

    const handlerChangeFilter = (e) => {
        const { value } = e.target;
        onChangeInput(value, "search");

        if (!value) {
            getProductTypes();
            return;
        }

        const searchValue = value.toLowerCase();
        const filtered = productType?.filter(data => {
            return data && data.name && data.name.toLowerCase().includes(searchValue);
        });

        setProductType(filtered || []);
    }

    const handleCreatForm = async () => {
        updateError(form);

        let save;
        if (form.id) {
            save = await ProductTypeService.updateFormData(form.id, JSON.stringify(form));
        } else {
            save = await ProductTypeService.createFormData(JSON.stringify(form));
        }

        if (save.success) {
            getProductTypes();
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
                const response = await ProductTypeService.productTypeDelete(row.id);
                if (response.success) {
                    toast.success(response.message, { autoClose: 3000 });
                    getProductTypes();
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
                    data={productType}
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
                    label="Tipo Produto"
                    variant="standard"
                    onChange={e => onChangeInput(e.target.value, 'name')}
                    value={form?.name}
                />

                <TextField
                    error={inputError.tax_id.status ?? false}
                    helperText={inputError.tax_id.message ?? ''}
                    required={true}
                    select
                    label="Imposto"
                    variant="standard"
                    name="tax_id"
                    value={form?.tax_id}
                    onChange={e => onChangeInput(e.target.value, 'tax_id')}
                >
                    {values.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
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
