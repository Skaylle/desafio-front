import React, {useEffect, useState} from 'react';
import {Grid} from '@mui/material';
import TableStandard from "../components/TableStandard";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {useForm} from "../helpers/useFormHelper.ts";
import Button from '@mui/material/Button';
import TransactionService from "../services/trasactionService";
import ProductService from "../services/productService";
import TaxService from "../services/taxService";
import ProductTypeService from "../services/productTypeService";
import {Caption} from "../Style";
import * as FaIcons from "react-icons/fa";
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MenuItem from "@mui/material/MenuItem";
import {moneyFormatter} from "../components/util.ts";

const columns = [
    {field: 'create_fmt', headerName: 'Data'},
    {field: 'total_tax', headerName: 'Total Impostos'},
    {field: 'total', headerName: 'Total'},
];

const columnsTransaction = [
    {field: 'product_label', headerName: 'Produto'},
    {field: 'valor_unit', headerName: 'valor Unitário'},
    {field: 'quantity', headerName: 'Qtd'},
    {field: 'tax', headerName: 'Imposto'},
    {field: 'subtotal', headerName: 'Subtotal'},
    {field: 'total_tax', headerName: 'Total Impostos'},
    {field: 'total', headerName: 'Total'},
];

const Transaction = () => {
    const [transactions, setTransaction] = useState([]);
    const [products, setProducts] = useState([]);
    const [tax, setTax] = useState([])
    const [productType, setProductType] = useState([]);
    const [row, setRow] = useState({});
    const [arrTable, setArrTable] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [rowTransaction, setRowTransaction] = useState({});

    const resetForm = (type) => {
        if (type === 'all'){
            setRow({});
            setRowTransaction({});
            setArrTable([]);
            setTotal(0);
            setTotalTax(0);
        }
    }

    const {form, onChangeInput, clearForm, setFormValues, inputError, updateError} = useForm(
        {
            defaultValues: {product_id: '', quantity: ''},
            resetForm: resetForm,
            requiredFields: {
                product_id: {status: false, message: ''},
                quantity: {status: false, message: ''},
            },
        })

    useEffect(() => {
        getAllTransaction();
        getAllProducts();
        getAllTax();
        getAllProductType();
    }, []);

    const getAllTransaction = async () => {
        const data = await TransactionService.getAllTransaction();
        setTransaction(data);
    }

    const getAllProducts = async () => {
        const data = await ProductService.getProducts();
        data?.forEach((item) => {
            products.push({
                value: item.id,
                label: item.name,
                product_type_id: item.product_type_id,
                valor: item.valor,
            });
        })
    }

    const getAllTax = async () => {
        const data = await TaxService.getAllTax();
        setTax(data);
    }

    const getAllProductType = async () => {
        const data = await ProductTypeService.getProductTypes();
        setProductType(data);
    }

    const handleCreatForm = async () => {
        updateError(form);

        const formData = {
            transaction: arrTable,
            total: total,
            total_tax: totalTax
        };

        let save;
        if (form.id) {
            save = await TransactionService.updateFormData(form.id, JSON.stringify(formData));
        } else {
            save = await TransactionService.createFormData(JSON.stringify(formData));
        }

        if (save.success) {
            getAllTransaction();
            clearForm();
            toast.success(save.message, {autoClose: 3000});
        } else {
            toast.error(save.message, {autoClose: 3000});
        }
    }

    const handleRowClick = (rowData) => {
        setRow(rowData);
    }
    const handleRowTransactionClick = (rowData) => {
        setRowTransaction(rowData);
    }

    const actionsTable = async (action) => {
        switch (action) {
            case 'edit':
                setFormValues(row);
                break;
            case 'delete':
                let d = arrTable.find((item) => {
                    return item.id == row.id;
                })
                setTotal((total - d.total));
                setTotal((totalTax - d.total_tax));

                setArrTable(
                    arrTable.filter((item) => {
                        return item.id != row.id;
                    })
                )
                break;
        }
    }

    const actionsTableTransaction = async (action) => {
        switch (action) {
            case 'edit':
                rowTransaction.items?.map((i) => {
                    let product = products?.find((item) => {return item.value === i?.product_id });
                    let type = productType?.find((item) => {return item.id === product?.product_type_id});
                    let taxes = tax?.find((item) => {return item.id === type?.tax_id});

                    let t = product?.valor * (taxes.percent / 100);
                    let s = product?.valor * i.quantity;
                    let tt = (product?.valor * i.quantity) * (taxes.percent / 100);
                    let to = (product?.valor * i.quantity) + (product?.valor * i.quantity) * (taxes.percent / 100);

                    let newRow  = {
                        id: i.id,
                        product_id: i?.product_id,
                        product_label: product?.label,
                        valor_unit: moneyFormatter(product?.valor),
                        quantity: i.quantity,
                        tax: moneyFormatter(t),
                        subtotal: moneyFormatter(s),
                        total_tax: moneyFormatter(tt),
                        total: moneyFormatter(to),
                    }

                    const existingRow = arrTable.find(row => row.id === newRow.id);
                    if (existingRow) {
                        setArrTable(prevArrTable => prevArrTable.map(row => (row.id === newRow.id ? newRow : row)));
                    } else {
                        setArrTable(prevArrTable => [...prevArrTable, newRow]);
                    }
                    clearForm();
                    getTotal(to);
                    getTotalTax(tt);
                })
                setRowTransaction({});
                break;
            case 'delete':
                const response = await TransactionService.transactionDelete(rowTransaction.id);
                if (response.success) {
                    toast.success(response.message, { autoClose: 3000 });
                    getAllTransaction();
                    //clearForm();
                    return;
                }
                toast.success(response.message, { autoClose: 3000 });
                break;
        }
    }

    const addTableTransaction = () => {
        if(form?.product_id === "" && form.quantity === ""){
            updateError(form);
            return;
        }

        let product = products?.find((item) => {return item.value === form?.product_id });
        let type = productType?.find((item) => {return item.id === product?.product_type_id});
        let taxes = tax?.find((item) => {return item.id === type?.tax_id});

        let t = product?.valor * (taxes.percent / 100);
        let s = product?.valor * form.quantity;
        let tt = (product?.valor * form.quantity) * (taxes.percent / 100);
        let to = (product?.valor * form.quantity) + (product?.valor * form.quantity) * (taxes.percent / 100);

        let newRow  = {
            id: row.id ?? Math.floor(Math.random() * 1000000000000),
            product_id: form?.product_id,
            product_label: product?.label,
            valor_unit: moneyFormatter(product?.valor),
            quantity: form.quantity,
            tax: moneyFormatter(t),
            subtotal: moneyFormatter(s),
            total_tax: moneyFormatter(tt),
            total: moneyFormatter(to),
        }

        const existingRow = arrTable.find(row => row.id === newRow.id);
        if (existingRow) {
            setArrTable(prevArrTable => prevArrTable.map(row => (row.id === newRow.id ? newRow : row)));
        } else {
            setArrTable(prevArrTable => [...prevArrTable, newRow]);
        }
        clearForm('form')
        getTotal(to);
        getTotalTax(tt);
    }

    const getTotal = (value) => {
        setTotal(total + value);
    }
    const getTotalTax = (value) => {
        setTotalTax(totalTax + value);
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
                {Object.keys(rowTransaction).length > 0 && (
                    <Grid container spacing={1} justifyContent="flex-end">
                        <Grid item>
                            <Link to='#' title="Editar">
                                <FaIcons.FaPencilAlt size={20} color="blue" onClick={() => {
                                    actionsTableTransaction('edit')
                                }}/>
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to='#' title="Apagar">
                                <FaIcons.FaTrashAlt size={20} color="red" onClick={() => {
                                    actionsTableTransaction('delete')
                                }}/>
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to='#' title="Cancelar" onClick={() => {
                                setRowTransaction({})
                            }}>
                                <FaIcons.FaUndo size={20} color="gray"/>
                            </Link>
                        </Grid>
                    </Grid>
                )}
            </Box>

            <Grid>
                <TableStandard
                    columns={columns}
                    data={transactions}
                    onRowClick={handleRowTransactionClick}
                />
            </Grid>

            <Caption>
                <div style={{textAlign: 'center', marginTop: '5%'}}>
                    Incluir
                </div>
            </Caption>

            <Box
                component="form"
                autoComplete="off"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Grid container spacing={2}>
                    <Grid item>
                        <TextField
                            style={{width: '200px'}} // Ajusta o tamanho do campo "Quantidade"
                            error={inputError.product_id.status ?? false}
                            helperText={inputError.product_id.message ?? ''}
                            required={true}
                            select
                            label="Produto"
                            variant="standard"
                            name="product_id"
                            value={form?.product_id}
                            onChange={e => onChangeInput(e.target.value, 'product_id')}
                        >
                            {products?.map((option, index) => (
                                <MenuItem key={index} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item>
                        <TextField
                            error={inputError.quantity.status ?? false}
                            helperText={inputError.quantity.message ?? ''}
                            required={true}
                            label="Qtd"
                            variant="standard"
                            name="quantity"
                            value={form?.quantity}
                            onChange={e => onChangeInput(e.target.value, 'quantity')}
                            style={{width: '100px'}}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            variant="outlined"
                            color="success"
                            onClick={() => addTableTransaction()}
                            style={{marginTop: '1%'}}
                        >
                            Incluir
                        </Button>
                        {' '}
                        <Button variant="outlined" color="secondary" onClick={() => {clearForm('form')}}>Limpar</Button>
                    </Grid>
                </Grid>

                {Object.keys(row).length > 0 && (
                    <Grid container spacing={1} justifyContent="flex-end">
                        <Grid item>
                            <Link to='#' title="Editar">
                                <FaIcons.FaPencilAlt size={20} color="blue" onClick={() => {
                                    actionsTable('edit')
                                }}/>
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to='#' title="Apagar">
                                <FaIcons.FaTrashAlt size={20} color="red" onClick={() => {
                                    actionsTable('delete')
                                }}/>
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to='#' title="Cancelar" onClick={() => {
                                setRow({})
                            }}>
                                <FaIcons.FaUndo size={20} color="gray"/>
                            </Link>
                        </Grid>
                    </Grid>
                )}
            </Box>

            <Grid>
                <TableStandard
                    columns={columnsTransaction}
                    data={arrTable}
                    onRowClick={handleRowClick}
                />
                <div style={{fontSize: '20px'}}>
                    Total: R$: {moneyFormatter(total)}
                </div>
                <div style={{fontSize: '20px'}}>
                    Total Imposto: R$: {moneyFormatter(totalTax)}
                </div>
            </Grid>


            <Grid style={{textAlign: 'center'}}>
                <Button variant="outlined" color="success" onClick={() => handleCreatForm()}>Incluir</Button>
                {' '}
                <Button variant="outlined" color="secondary" onClick={() => {clearForm('all')}}>Limpar</Button>
            </Grid>

        </div>
    );
}

export default Transaction;
