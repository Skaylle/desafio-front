export const monetaryFormatter = (value) => {
    if (!value){
        return '0,0';
    }

    parseFloat(value).toFixed(2);
    value = value?.replace(/\D/g, '');

    let formattedValue = (parseInt(value) / 100).toFixed(2);

    formattedValue = formattedValue.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

    return formattedValue;
}

export const monetaryClearFormatter = (value) => {
    value = value.replace(/\D/g, '');

    if (!value){
        return '';
    }

    value = value.replace(/\./g, '');

    let numericValue = parseFloat(value) / 100;

    return numericValue.toFixed(2);
}

export const moneyFormatter = (valor) => {
    let inteiro = null, decimal = null, c = null, j = null;
    let aux = [];

    if(valor == null){
        valor = 0;
    }

    if (valor != "") {
        valor = Number(valor);
        valor = valor.toFixed(2);
    }

    valor = "" + valor;
    c = valor.indexOf(".", 0);
    //encontrou o ponto na string
    if (c > 0) {
        //separa as partes em inteiro e decimal
        inteiro = valor.substring(0, c);
        decimal = valor.substring(c + 1, valor.length);
    } else {
        inteiro = valor;
    }

    //pega a parte inteiro de 3 em 3 partes
    for (j = inteiro.length, c = 0; j > 0; j -= 3, c++) {
        aux[c] = inteiro.substring(j - 3, j);
    }

    //percorre a string acrescentando os pontos
    inteiro = "";
    for (c = aux.length - 1; c >= 0; c--) {
        inteiro += aux[c] + '.';
    }
    //retirando o ultimo ponto e finalizando a parte inteiro

    inteiro = inteiro.substring(0, inteiro.length - 1);

    decimal = parseInt(decimal);
    if (isNaN(decimal)) {
        decimal = "00";
    } else {
        decimal = "" + decimal;
        if (decimal.length === 1) {
            decimal = "0" + decimal;
        }
    }
    valor = inteiro + "," + decimal;
    return valor;

}

export const monetaryUnformatter = (value) => {
    return new Number(value.split('.').join('').split(',').join('.'));
}

