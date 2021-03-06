/**
* CLASS Companies
*
* Contiene el contenedor principal de empresas
*
* @author Hector Morales <warrior1987@gmail.com>
*/

import React, { Component } from 'react';
import DataGrid from '../data_grid/DataGrid';
import TBar from '../tbar/TBar';

class Companies extends Component {
    retrocederPanel(){
        this.props.funcionClick('ControlPanel');
    }
  	render() {      
        let sqlParams = {
                            sqlCols : [
                                'T1.id',
                                'T1.id_tipo_documento', 
                                'DT.nombre AS tipo_documento',
                                'T1.documento',
                                'T1.razon_social',
                                'T1.nombre_comercial'
                            ],                                                      
                            sqlJoin : [
                                'INNER JOIN document_types AS DT ON (DT.id = T1.id_tipo_documento)'
                            ],
                            fieldSearch : [
                                'T1.documento',
                                'T1.razon_social',
                                'T1.nombre_comercial'                                
                            ],                                                                                                       
                        }                 
        return (//carga el componente que contiene la grilla de datos
            <div>
                <TBar
                    items={[
                              {
                                  type : 'boton',
                                  icon : 'arrow_back',
                                  width : '100px',
                                  height : '60px',
                                  title : 'Atras',
                                  display : true,
                                  function : this.retrocederPanel.bind(this)
                              },
                          ]}
                    length = '1'
                />
                <div style={{top: "60px",position:"relative"}}>            
                    <DataGrid titulo='Empresas' 
                              funcionClick={this.props.funcionClick} 
                              parametro={this.props.parametro}
                              colsData={[ 
                                            {
                                                type  : 'bd',
                                                label : 'Tipo Documento',
                                                field : 'tipo_documento'
                                            },
                                            {
                                                type  : 'bd',
                                                label : 'Documento',
                                                field : 'documento'
                                            },
                                            {
                                                type  : 'bd',
                                                label : 'Razon Social',
                                                field : 'razon_social'
                                            },
                                            {
                                                type  : 'bd',
                                                label : 'Nombre Comercial',
                                                field : 'nombre_comercial'
                                            },
                                        ]} 
                              sqlParams = { sqlParams } 
                              automatica="true"
                              botonNuevo="true"
                              formFields={[
                                            {
                                                label : 'Tipo de Documento',
                                                field : 'id_tipo_documento',
                                                type  : 'select',
                                                validation : '',
                                                required : 'true',
                                                dinamic : 'true',
                                                apiField : 'document_types',
                                                valueName : 'nombre',
                                                sqlParams : {
                                                                sqlCols : [
                                                                    'id',
                                                                    'nombre'                                
                                                                ],                                                                                                       
                                                            }
                                            },                                    
                                            {
                                                label : 'Documento',
                                                field : 'documento',
                                                type  : 'text',
                                                validation : 'entero',
                                                required : 'true'                                        
                                            },
                                            {
                                                label : 'Razon Social',
                                                field : 'razon_social',
                                                type  : 'text',
                                                validation : 'mayusculas',
                                                required : 'true'
                                            },
                                            {
                                                label : 'Nombre Comercial',
                                                field : 'nombre_comercial',
                                                type  : 'text',
                                                validation : 'mayusculas',
                                                required : 'true'
                                            }                                                                         
                                        ]}                     
                              apiField={'companies'}
                              mainContainer='Companies'/> 
                </div>
            </div>             
        )
    } 
}

export default Companies