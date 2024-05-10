import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import TableStandard from "../components/TableStandard";
import ProductService from '../services/productService'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from "../helpers/useFormHelper.ts";
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import productService from "../services/productService";
import {monetaryClearFormatter, monetaryFormatter, moneyFormatter} from "../components/util.ts";
import { Caption } from "../Style";
import * as FaIcons from "react-icons/fa";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const columns = [
    { field: 'name', headerName: 'Produto' },
    { field: 'product_type_label', headerName: 'Tipo' },
    { field: 'code', headerName: 'Código' },
    { field: 'valor', headerName: 'R$ Valor', },
    { field: 'description', headerName: 'Descrição'},
];

const Products = () => {
    const [products, setProducts] = useState([]);
    const [values, setValues] = useState([]);
    const [row, setRow] = useState({});

    const resetForm = () => {
        setRow({});
    }

    const { form, onChangeInput, clearForm, setFormValues, inputError, updateError } = useForm(
        {
            defaultValues: { name: '', valor: '', description: '', product_type_id: '' },
            resetForm: resetForm,
            requiredFields: {
                name: {status: false, message: ''},
                valor: {status: false, message: ''},
                product_type_id: {status: false, message: ''},
            },
        })

    useEffect(() => {
        getAllProduct();
        getAllProductType();
    }, []);

    const getAllProduct = async () => {
        const data = await ProductService.getProducts();
        for (const key in data) {
            data[key].valor = moneyFormatter(data[key].valor);
        }
        setProducts(data);
    }

    const getAllProductType = async () => {
        const data = await ProductService.getProductType();
        data?.forEach((product) => {
            values.push({
                value: product.id,
                label: product.name,
            });
        })
    }

    const handlerChangeFilter = (e) => {
        const { value } = e.target;
        onChangeInput(value, "search");

        if (!value) {
            getAllProduct();
            return;
        }

        const searchValue = value.toLowerCase();
        const filteredProducts = products?.filter(data => {
            return data && data.name && data.name.toLowerCase().includes(searchValue);
        });

        setProducts(filteredProducts || []);
    }

    const handleCreatForm = async () => {
        updateError(form);

        const formData = { ...form, valor: monetaryClearFormatter(form?.valor) };

        let save;
        if (formData.id) {
            save = await productService.updateFormData(formData.id, JSON.stringify(formData));
        } else {
            save = await productService.createFormData(JSON.stringify(formData));
        }

        if (save.success) {
            getAllProduct();
            clearForm();
            toast.success(save.message, { autoClose: 3000 });
        }else{
            toast.error(save.message, { autoClose: 3000 });
        }
    }

    const onChangeMoney = async (e) => {
        const { value } = e.target;

        onChangeInput(monetaryFormatter(value), 'valor')
    }

    const handleRowClick = (rowData) => {
        setRow(rowData);
    }

    const actionsTable = async (action) => {
        switch (action) {
            case 'edit':
                let format = { valor: monetaryFormatter(row.valor) }
                setFormValues({ ...row, ...format });
                break;
            case 'delete':
                const response = await productService.productDelete(row.id);
                if (response.success) {
                    toast.success(response.message, { autoClose: 3000 });
                    getAllProduct();
                    clearForm();
                    return;
                }
                toast.success(response.message, { autoClose: 3000 });
                break;
        }
    }

    return (
        <div className='products'>
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
                        placeholder='Buscar pelo nome ou código'
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
                    data={products}
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
                    label="Produto"
                    variant="standard"
                    onChange={e => onChangeInput(e.target.value, 'name')}
                    value={form?.name}
                />

                <TextField
                    error={inputError.product_type_id.status ?? false}
                    helperText={inputError.product_type_id.message ?? ''}
                    required={true}
                    select
                    label="Select"
                    variant="standard"
                    name="product_type_id"
                    value={form?.product_type_id}
                    onChange={e => onChangeInput(e.target.value, 'product_type_id')}
                >
                    {values.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    error={inputError.valor.status ?? false}
                    helperText={inputError.valor.message ?? ''}
                    required={true}
                    name="valor"
                    label="Valor"
                    variant="standard"
                    onChange={onChangeMoney}
                    value={form.valor}
                    inputProps={{ maxLength: 10 }}
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

export default Products;
