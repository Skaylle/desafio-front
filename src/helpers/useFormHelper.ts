import { SetStateAction, useState } from 'react';

interface FormValues {
    [key: string]: any;
}

interface InputError {
    [key: string]: {
        status: boolean;
        message: string;
    };
}

interface FormOptions {
    defaultValues?: FormValues;
    resetForm?: (type: string) => void;
    requiredFields?: FormValues;
}

const useForm = ({ defaultValues = {}, resetForm = (type: string) => {}, requiredFields = {} }: FormOptions) => {
    const [form, setForm] = useState<FormValues>(defaultValues);
    const [inputError, setInputError] = useState<InputError>(requiredFields);

    const onChangeInput = (value: any, key: string) => {
        setForm(prevForm => ({
            ...prevForm,
            [key]: value
        }));

        setInputError(prevInputError => ({
            ...prevInputError,
            [key]: {
                status: !value,
                message: value ? '' : 'Campo Obrigatório'
            }
        }));
    };

    const clearForm = (type: string = 'all') => {
        resetForm(type);
        setForm(defaultValues);
        setInputError(requiredFields);
    };

    const getJsonForm = () => {
        return JSON.stringify(form, null, 2);
    };

    const setFormValues = (values: SetStateAction<FormValues>) => {
        setForm(prevForm => ({
            ...prevForm,
            ...values
        }));
    };

    const updateError = (values: FormValues) => {
        const newInputError: InputError = {};
        for (const field in values) {
            newInputError[field] = {
                status: !values[field],
                message: values[field] ? '' : 'Campo Obrigatório'
            };
        }

        setInputError(prevInputError => ({
            ...prevInputError,
            ...newInputError
        }));
    };

    return {
        onChangeInput,
        form,
        clearForm,
        getJsonForm,
        setFormValues,
        inputError,
        updateError
    };
};

export { useForm };
