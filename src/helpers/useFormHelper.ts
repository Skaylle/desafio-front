import { useState } from 'react';

const useForm = ({
                     defaultValues = {},
                     resetForm = () => {},
                     requiredFields  = {},
                 }) => {
    const [form, setForm] = useState(defaultValues);
    const [inputError, setInputError] = useState(requiredFields);

    const onChangeInput = (value, key) => {
        setForm({
            ...form,
            [key]: value
        });

        if(value){
            setInputError({
                ...inputError,
                [key]: {status: false, message: ''}
            });
        }else{
            setInputError({
                ...inputError,
                [key]: {status: true, message: 'Campo Obrigatório'}
            });
        }
    };

    const clearForm = () =>{
        resetForm();
        setForm(defaultValues);
        setInputError(requiredFields);
    }

    const getJsonForm = () => {
        return JSON.stringify(form, null, 2);
    };

    const setFormValues = (values) => {
        setForm({
            ...form,
            ...values
        });
    };

    const updateError = (values) => {
        const newInputError = {};
        for (const field in values) {
            if (values[field] !== '') { // Verifica se o campo tem um valor não vazio
                newInputError[field] = { status: false, message: '' };
            } else {
                newInputError[field] = { status: true, message: 'Campo Obrigatório' };
            }
        }

        setInputError({
            ...inputError,
            ...newInputError
        });
    }

    return {
        onChangeInput,
        form,
        clearForm,
        getJsonForm,
        setFormValues,
        inputError,
        updateError
    }
}

export { useForm };
