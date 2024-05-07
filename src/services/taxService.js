import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import authHeader from './auth-header';

class TaxService {

    async getAllTax() {
        return await axios.get('http://localhost:8080/api/tax').then((response) => {
            return response.data;
        }).catch((error) => {
            console.log(error.message);
        })
    }

    async createFormData(form) {
        try {
            const response = await axios.post('http://localhost:8080/api/tax', form);
            return {
                message: 'Requisição realizado com sucesso!',
                data: response?.data?.data,
                success: true,
            };
        } catch (error) {
            console.log(error.message);
            return {
                message: 'Erro ao cadastrar os dados, verifique todos os campos!',
                success: false,
            };
        }
    }

    async updateFormData(id, form) {
        try {
            const response = await axios.put(`http://localhost:8080/api/tax/${id}`, form);
            return {
                message: 'Requisição realizado com sucesso!',
                data: response?.data?.data,
                success: true,
            };
        } catch (error) {
            console.log(error.message);
            return {
                message: 'Erro ao cadastrar os dados, verifique todos os campos!',
                success: false,
            };
        }
    }

    async taxDelete(id) {
        try {
            await axios.delete(`http://localhost:8080/api/tax/${id}`);
            return {
                message: 'Requisição realizado com sucesso!',
                data: [],
                success: true,
            };
        } catch (error) {
            console.log(error.message);
            return {
                message: 'Erro ao remover o dado, verifique todos os campos!',
                success: false,
            };
        }
    }
}

export default new TaxService();