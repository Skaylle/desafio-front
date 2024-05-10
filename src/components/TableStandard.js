import React from "react";
import { DataGrid } from '@mui/x-data-grid';
import {moneyFormatter, moneyUnformatter} from "./util.ts";

function TableStandard(props) {
    const { columns, data, onRowClick } = props;

    const handlerClick = (params) => {
        onRowClick(params.row);
    }

    return (
        <DataGrid
            rows={data}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            onRowClick={handlerClick}
        />
    );
}

export default TableStandard;
