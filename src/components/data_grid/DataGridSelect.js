/**
* CLASS Purchases
*
* Contiene el contenedor principal de las compras
*
* @author Hector Morales <warrior1987@gmail.com>
*/

import React, { Component } from 'react';
import DataGrid from '../data_grid/DataGrid';

class DataGridSelect extends Component {  
    render() {  
        console.log(this.props.params);     
        return (
            <DataGrid titulo='Seleccione...' 
                      funcionClick={this.props.funcionClick}  
                      parametro={this.props.parametro}                     
                      colsHeaders={this.props.params.colsHeaders}
                      colsData={this.props.params.colsData} 
                      automatica="false"                    
                      apiField = {this.props.params.apiField}
                      mainContainer='DataGridSelect'/>             
        )
    } 
}

export default DataGridSelect