import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import authHeader from './auth-header';

class ProductTypeService {

    async getProductTypes() {
        return await axios.get('http://localhost:8080/api/product-type').then((response) => {
            return response.data;
        }).catch((error) => {
            console.log(error.message);
        })
    }

    async createFormData(form) {
        try {
            const response = await axios.post('http://localhost:8080/api/product-type', form);
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
            const response = await axios.put(`http://localhost:8080/api/product-type/${id}`, form);
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

    async productTypeDelete(id) {
        try {
            await axios.delete(`http://localhost:8080/api/product-type/${id}`);
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

export default new ProductTypeService();