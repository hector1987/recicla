/**
* CLASS FormDataGrid
*
* Contiene el formulario dinamico del datagrid
*
* @author Hector Morales <warrior1987@gmail.com>
*/

import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import ComboBoxFormDataGrid from './ComboBoxFormDataGrid';
import configJson from '../configuration/configuration.json';
import globalState from '../configuration/GlobalState';
import {divMouseOver,divMouseOut,validarEmail,modalLoading} from '../configuration/GlobalFunctions';
import RichTextEditor from 'react-rte';
import Window from '../window/Window';
import {insertarActualizarFila,eliminarFilas} from '../api_calls/ApiCalls';
import alertify from 'alertifyjs';
import '../../css/alertify.css';
import './dataGrid.css'; 

class FormDataGrid extends Component {
  	
  	constructor(props) {
        super(props);
        //cargar dinamicamente los estados        
        this.state = {};           
        //botones de cancelar y guardar      
        this.handleCancelButton = this.handleCancelButton.bind(this);
        this.handleSaveButton   = this.handleSaveButton.bind(this);
        this.handleConfirmAction = this.handleConfirmAction.bind(this);
        this.funcionEditDataSelect = this.funcionEditDataSelect.bind(this); 
                     
    }
    cargarCampos(){
        this.props.parametro.formFields.forEach((formFields,i) => {            
            if(this.props.parametro.idRow !== 0){                
                if(this.props.parametro.idRow[formFields.field] === '' || this.props.parametro.idRow[formFields.field] === undefined || this.props.parametro.idRow[formFields.field] === null){
                    if(formFields.type==='campo_empresa'){
                        this.setState({[formFields.field] : globalState.getState().companyData[0].id}); 
                    }
                    else if(formFields.type==='textarea-rich'){                    
                        this.setState({[formFields.field] : RichTextEditor.createEmptyValue()});                          
                    }
                    else{
                        this.setState({[formFields.field] : ''});
                    }
                }
                else{
                    if(formFields.type==='textarea-rich'){                    
                        this.setState({[formFields.field] : RichTextEditor.createValueFromString(this.props.parametro.idRow[formFields.field], 'html')});                          
                    }
                    else{
                        this.setState({[formFields.field] : this.props.parametro.idRow[formFields.field]});        
                    }         
                    if(formFields.type==='data_select'){//adicional pone el texto en el input del data select
                        this.setState({[formFields.dataParams.fetchData.valueField] : this.props.parametro.idRow[formFields.dataParams.fetchData.valueField]});
                    }
                }
            }
            else{
                if(formFields.type==='select'){
                    if(formFields.dinamic === 'false'){
                        this.setState({[formFields.field] : formFields.options[0].id});
                    }
                    else{
                        this.setState({[formFields.field] : 1});
                    }
                }
                else if(formFields.type==='campo_empresa'){
                    this.setState({[formFields.field] : globalState.getState().companyData[0].id});
                }
                else if(formFields.type==='textarea-rich'){                    
                    this.setState({[formFields.field] : RichTextEditor.createEmptyValue()});                          
                }
                else{                    
                    this.setState({[formFields.field] : ''});                          
                }                
            }
            if(formFields.type==='hidden'){
                this.setState({[formFields.field] : formFields.value}); 
            }
        });        
    } 
    componentWillMount(){        
        this.cargarCampos();
    }
    componentDidUpdate(prevProps){
        if (this.props.parametro !== prevProps.parametro) {           
            this.cargarCampos();
        }          
    } 
    componentDidMount(){
        this.setState({windowDataSelectId : ''});
    } 
    handleCancelButton(){
        this.props.funcionClick(this.props.parametro.mainContainer);        
    }
    handleSaveButton(id){
        //recorrido dinamico de los campos y cargar dinamicamente el arrayData
        var arrayData = {};
        var errors = 0;            

        this.props.parametro.formFields.forEach((formFields,i) => {
            if(formFields.type==='textarea-rich'){ 
                if(!this.state[formFields.field].getEditorState().getCurrentContent().hasText()){
                    alertify.error('Digite el campo '+formFields.label+'!'); 
                    errors++;
                    return; 
                }
                else{
                    arrayData[formFields.field] = this.state[formFields.field].toString('html');
                }                
            }
            else if((this.state[formFields.field] === undefined || this.state[formFields.field] === '') && formFields.required === 'true'){
                alertify.error('Digite el campo '+formFields.label+'!'); 
                errors++;
                return;
            } 
            else{
                if(formFields.validation === 'email'){
                    if(!validarEmail(this.state[formFields.field])){
                        alertify.error('No es una cuenta de Email Valida en el campo '+formFields.label+'!'); 
                        errors++;
                        return;
                    }
                }                
                arrayData[formFields.field] = this.state[formFields.field];
            }
        });
        //hay errores?
        if(errors > 0){
            return;
        }            
      
        var method = '';

        if(id>0){//si es update o insert           
            method = 'put';
            arrayData['id'] = id;//mandar el ID
        }
        else{            
            method = 'post';
        }   
        modalLoading(true);     
        //ajax que llama a la API para insertar o actualizar        
        insertarActualizarFila(method,this.props.parametro.apiField,arrayData)
        .then(response => {
            modalLoading(false); 
            response = response.data;
            if(response.msg === 'error'){
                alertify.alert('Error!', 'Ha ocurrido un error accesando a la base de datos!<br />Codigo de Error: '+response.detail); 
            }
            else {
                //aqui es donde refresca el datagrid una vez se han hecho los cambios
                this.props.funcionClick(this.props.parametro.mainContainer);                
            }
        })
        .catch(function (error) {
            modalLoading(false); 
            alertify.alert('Error!', 'No se ha logrado la conexion con el servidor!<br />'+error);
        });
    }
    //manejo dinamico de los estados, con esto actualizo el valor de cualquier campo para enviarlos a la API
    handleStateChange(validation,funcionOnChange,e) {      
        
        var ingresado = null; //validaciones   

        if(validation === 'textarea-rich'){
            ingresado = e;
        }
        else{
            ingresado = e.target.value;
        }

        if(validation === 'mayusculas'){
            ingresado = ingresado.toUpperCase();
        }
        if(validation === 'email'){
            ingresado = ingresado.toLowerCase();
        }
        if(validation === 'entero'){
            ingresado = ingresado.replace(/[^\d]/g,'');
        }
        if(validation === 'numero_real'){
            ingresado = ingresado.replace(/[^\d.]/g,'');
        } 
        if(validation === 'numero_texto'){
            ingresado = ingresado.replace(/[^a-zA-Z0-9&]/g,'');
            ingresado = ingresado.toUpperCase();
        }        
        if(typeof funcionOnChange === 'function'){//la funcion onchange del combo  
            funcionOnChange(ingresado);           
        }

        if(validation === 'textarea-rich'){
            this.setState({ [funcionOnChange]: ingresado });
        }
        else{
            this.setState({ [e.target.name]: ingresado });
        }
    }   
    handleDeleteButton(id){//boton eliminar
        alertify.confirm('Confirmacion', 'Esta seguro(a) de eliminar este item?', this.handleConfirmAction.bind(this,id), function(){});
    }   
    handleConfirmAction(id) {        
        //CODIGO PARA ELIMINAR LA FILA        
        eliminarFilas(this.props.parametro.apiField,id)
        .then(response => {            
            response = response.data;
            if(response.msg === 'error'){
                alertify.alert('Error!', 'Ha ocurrido un error accesando a la base de datos!<br />Codigo de Error: '+response.detail); 
            }
            else if(response.msg === 'notExist'){
                alertify.alert('Error!', 'El dato a eliminar no existe!'); 
            }
            this.props.funcionClick('WelcomePage');
            this.props.funcionClick(this.props.parametro.mainContainer);
        })
        .catch(function (error) {
            alertify.alert('Error!', 'No se ha logrado la conexion con el servidor!<br />'+error);
        });        
    }  
    handleDataSelect(dataParams){//al dar clic en el campo de texto
        dataParams['funcionEdit'] = this.funcionEditDataSelect;      
        this.setState({windowDataSelectId : "windowFormDataSelect_"+this.props.parametro.mainContainer+"_"+dataParams.idField }, () => {
            globalState.dispatch({
                type   : "windowFormDataSelect_"+this.props.parametro.mainContainer+"_"+dataParams.idField,
                params : {
                    visible : true,
                    params  : dataParams
                }
            })
        });        
    }
    funcionEditDataSelect(data,params){//la funcion que carga los datos del DataSelect        
        this.setState({[params.idField] : data.id });
        this.setState({[params.valueField] : data[params.fieldFetch]});
        this.setState({windowDataSelectId : "windowFormDataSelect_"+this.props.parametro.mainContainer+"_"+params.idField }, () => {
            globalState.dispatch({
                type   : "windowFormDataSelect_"+this.props.parametro.mainContainer+"_"+params.idField,
                params : {
                    visible : false,                    
                }
            })
        }); 
    }  
  	render() {
    	var titulo = 'Agregar';
        var id = 0;
        var field = '';
        var field1 = '';
        var count = 1;        
    	if(this.props.parametro.idRow !== 0){
    		  titulo = 'Editar';
           id = this.props.parametro.idRow.id;
    	}                             			
    	return (  //carga dinamica del formulario
    	 	<div className="container">
               <div className="content">
                   <div className="table-responsive mt-4">
                       <div className="titulo">{titulo} {this.props.parametro.titulo}</div>
                   </div>
                   <hr />
                   <div className="table-responsive mb-3">	
    			    	<Form>                            
                            {                                
                                //cargar dinamicamente los campos, dependiendo si es input o select                                
                                this.props.parametro.formFields.map((formFields,i) => {                                                                                                                                          
                                    if(formFields.type === 'text' || formFields.type === 'date'){
                                        field = <>{field}<Form.Group as={Col}  controlId={"formField_"+formFields.field}>
                                                    <Form.Label>{formFields.label}</Form.Label>
                                                    <Form.Control name = {formFields.field} type={formFields.type} onChange={this.handleStateChange.bind(this,formFields.validation,'')} value={this.state[formFields.field]}/>                               
                                                </Form.Group></>
                                    }
                                    else if(formFields.type === 'textarea'){
                                        if(count%2===0){
                                            count+=3;
                                            field1 = field;
                                            field = '';                                                                                                                               
                                        } 
                                        return <div key= {i}> 
                                                <Form.Row style={{width:'99%'}}>
                                                    {field1}
                                                </Form.Row>
                                                <Form.Row style={{width:'99%'}}>
                                                    <Form.Group as={Col} key= {i} controlId={"formField_"+formFields.field}>
                                                        <Form.Label>{formFields.label}</Form.Label>                                                        
                                                        <Form.Control name = {formFields.field} as="textarea" rows={formFields.rows} onChange={this.handleStateChange.bind(this,formFields.validation,'')} value={this.state[formFields.field]}/>
                                                    </Form.Group>
                                                </Form.Row>
                                               </div>
                                    }  
                                    else if(formFields.type === 'textarea-rich'){
                                        if(count%2===0){
                                            count+=3;
                                            field1 = field;
                                            field = '';                                                                                                                               
                                        } 
                                        return <div key= {i}> 
                                                <Form.Row style={{width:'99%'}}>
                                                    {field1}
                                                </Form.Row>
                                                <Form.Row style={{width:'99%'}}>
                                                    <Form.Group as={Col} key= {i} controlId={"formField_"+formFields.field}>
                                                        <Form.Label>{formFields.label}</Form.Label>
                                                        <RichTextEditor
                                                            name = {formFields.field}
                                                            onChange={this.handleStateChange.bind(this,'textarea-rich',formFields.field)} 
                                                            value={this.state[formFields.field]} 
                                                            editorClassName="richTextEditor"                                                           
                                                        />                                                       
                                                    </Form.Group>
                                                </Form.Row>
                                               </div>
                                    }                                  
                                    else if(formFields.type === 'select'){
                                        field = <>{field}<Form.Group as={Col} controlId={"formField_"+formFields.field}>
                                                    <Form.Label>{formFields.label}</Form.Label>
                                                    <ComboBoxFormDataGrid 
                                                        valueName = {formFields.valueName} 
                                                        options = {formFields.options} 
                                                        apiField={formFields.apiField} 
                                                        dinamic={formFields.dinamic} 
                                                        name = {formFields.field} 
                                                        type={formFields.type}                                                         
                                                        fieldUpdate={formFields.fieldUpdate}
                                                        valueUpdate={this.state[formFields.fieldUpdate]}
                                                        functionChange={this.handleStateChange.bind(this,formFields.validation,formFields.onChange)} 
                                                        value={this.state[formFields.field]} 
                                                        sqlParams={formFields.sqlParams}/>                               
                                                </Form.Group></>
                                    }
                                    else if(formFields.type === 'data_select'){                                           
                                        field = <>{field}<Form.Group as={Col} controlId={"formField_"+formFields.field}>
                                                    <input type="hidden" name = {formFields.field} value={this.state[formFields.field]} />
                                                    <Form.Label>{formFields.label}</Form.Label>
                                                    <Form.Control style={{backgroundColor:'#fff'}} name={formFields.dataParams.fetchData.valueField} type="text" onClick={this.handleDataSelect.bind(this,formFields.dataParams)} value={this.state[formFields.dataParams.fetchData.valueField] || 'Seleccione...'} readOnly/>                                
                                               </Form.Group></>
                                    }
                                    else if(formFields.type === 'campo_empresa'){
                                        return <input key= {i} type="hidden" name = {formFields.field} value={this.state[formFields.field]} />
                                    }
                                    else if(formFields.type === 'hidden'){
                                        return <input key= {i} type="hidden" name = {formFields.field} value={this.state[formFields.field]} />
                                    }
                                    //organizar las columnas en filas
                                    if(count%2===0){
                                        count++;
                                        field1 = field;
                                        field = '';                                       
                                        return <Form.Row style={{width:'99%'}} key= {i}>
                                                    {field1}
                                                </Form.Row>;   

                                    }                                    
                                    else{
                                        count++;                                                                                
                                    } 
                                    return null;                                     
                                })                                
                            } 
                            {
                                (count%2===0)?<Form.Row style={{width:'99%'}}>{field}</Form.Row>:''                                 
                            }
                            <Form.Row style={{width:'99%'}}>                        
                            {
                                this.props.parametro.enableBtnEdit === true || this.props.parametro.idRow === 0 ?
                                    <Button id="formGridBtnSave" className="float-left mr-3" variant="primary" onClick={this.handleSaveButton.bind(this,id)} style={{backgroundColor:configJson.fondoBotonGrilla}} onMouseOut={divMouseOut.bind(this,'formGridBtnSave',configJson.fondoBotonGrilla)} onMouseOver={divMouseOver.bind(this,'formGridBtnSave',configJson.fondoBotonGrilla)}>
                                        GUARDAR
                                    </Button> 
                                : ''
                            }
                            <Button variant="secondary" className="float-left mr-3" onClick={this.handleCancelButton.bind(this)}>
                                CANCELAR
                            </Button>
                            {                                
                                this.props.parametro.idRow !== 0 && this.props.parametro.enableBtnDel === true ?
                                    <Button id="formGridBtnDelete" className="float-left mr-3" variant="danger" onClick={this.handleDeleteButton.bind(this,id)} onMouseOut={divMouseOut.bind(this,"formGridBtnDelete","#dc3545")} onMouseOver={divMouseOver.bind(this,"formGridBtnDelete","#dc3545")}>
                                        ELIMINAR
                                    </Button>                                
                                :  ""                                
                            } 
                            </Form.Row>                           
    				    </Form>
                        <Window   //ventana para el data select
                            id = {this.state.windowDataSelectId}                    
                            title='Seleccione ...'
                            width='400px' 
                            height='300px'                     
                            tbar="false"
                            componente="DataGridSelect"
                            params="" 
                        /> 
    			    </div> 
    		    </div> 	  	 		       
    	    </div> 	
    	);
  	}
}

export default FormDataGrid