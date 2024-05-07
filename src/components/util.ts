export const monetaryFormatter = (value) => {
    // Remove any non-numeric characters
    value = value.replace(/\D/g, '');

    if (!value){
        return '';
    }

    let formattedValue = (parseInt(value) / 100).toFixed(2);

    formattedValue = formattedValue.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

    return formattedValue;
}

export const monetaryClearFormatter = (value) => {
    // Remove any non-numeric characters
    value = value.replace(/\D/g, '');

    if (!value){
        return '';
    }

    value = value.replace(/\./g, '');

    let numericValue = parseFloat(value) / 100;

    return numericValue.toFixed(2);
}
