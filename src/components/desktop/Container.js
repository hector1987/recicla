/**
* CLASS Container
*
* Contiene el contenedor que permite renderizar lo que se requiera en la interfaz
*
* @author Hector Morales <warrior1987@gmail.com>
*/

import React, { Component } from 'react';
import Dashboard from '../dashboard/Dashboard';
import Reciclators from '../reciclators/Reciclators';
import Customers from '../customers/Customers';
import Purchases from '../purchases/Purchases';
import Sales from '../sales/Sales';
import ControlPanel from '../control_panel/ControlPanel';
import DocumentTypes from '../control_panel/DocumentTypes';
import ProductTypes from '../control_panel/ProductTypes';
import Companies from '../control_panel/Companies';
import Roles from '../control_panel/Roles';
import Users from '../control_panel/Users';
import Smtp from '../control_panel/Smtp';
import FormDataGrid from '../data_grid/FormDataGrid';
import Reports from '../reports/Reports';
import WelcomePage from './WelcomePage';
import './desktop.css';

class Container extends Component {
	// listado de componentes 		
  	render() {
  		let componentList = {
			WelcomePage    : WelcomePage,
			Dashboard      : Dashboard,
			Reciclators    : Reciclators,
			Customers      : Customers,
			Purchases      : Purchases,
			Sales          : Sales,
			ControlPanel   : ControlPanel,			
			DocumentTypes  : DocumentTypes,
			ProductTypes   : ProductTypes,
			Companies      : Companies,
			Roles          : Roles,
			Users 		   : Users,
			FormDataGrid   : FormDataGrid,			
			Reports  	   : Reports,
			Smtp           : Smtp						  
		} 
		
  		let ChildComponent = componentList[this.props.componente];		
  	  	return (  		  
  	  		<ChildComponent funcionClick={this.props.funcionClick} parametro={this.props.parametro} />  	  		    
	    );
  	}
}

export default Container