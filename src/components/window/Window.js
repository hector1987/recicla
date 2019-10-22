/**
* CLASS Window
*
* Contiene el componente principal de la ventana
*
* @author Hector Morales <warrior1987@gmail.com>
*/

import React, { Component } from 'react';
import Modal from 'react-modal';
import globalState from '../configuration/GlobalState';
import configJson from '../configuration/configuration.json';
import {divMouseOver,divMouseOut} from '../configuration/GlobalFunctions';
import WindowContainer from './WindowContainer';
import MaterialIcon from 'material-icons-react';
import './window.css';

Modal.setAppElement('#root');

const customStyles = {
  content : {
    top         : '50%',
    left        : '50%',
    right       : 'auto',
    bottom      : 'auto',
    marginRight : '-50%',
    padding     : '0px',
    transform   : 'translate(-50%, -50%)',    
  }
};

class Window extends Component {

    constructor(props) {
        super(props); 
        this.state = {
            showModal: false
        };               
        this.handleCloseModal = this.handleCloseModal.bind(this); 
        customStyles.content.width  = this.props.width;   
        customStyles.content.height = this.props.height;        
        //control de la modal
        globalState.subscribe( ()=>{           
            if(globalState.getState().type===this.props.id){               
                this.setState({ showModal: globalState.getState()[this.props.id] });                
            }
        });
    } 
    componentWillUpdate(){
        //actualiza las propiedades segun la ventana que se despliegue
        customStyles.content.width  = this.props.width;   
        customStyles.content.height = this.props.height; 
    }
     
    handleCloseModal () {
        globalState.dispatch({
                type   : this.props.id,
                params : false
            });
    }    
  	render() {
  	  	return (
  			<Modal 
               isOpen={this.state.showModal}
               contentLabel="Minimal Modal Example"
               style={customStyles}
            >
                <div style={{backgroundColor : configJson.windowColor }} className="windowTitle" os="windows" id="windowTitleFrame">
                    <div id="windowTitleTextFrame" className="windowTitleText" os="windows">{this.props.title}</div>
                    <div className="windowTitleBoton" style={{ top: '-4px',left:'-2px'}} os="windows" id="btnCloseVentanaFrame" onClick={this.handleCloseModal}>
                        <MaterialIcon size={24} icon="close" invert id="iconClose"/>
                    </div> 
                </div> 
                <div style={{backgroundColor : configJson.windowColor }} className="windowTbar" >
                {
                    this.props.tbar !== 'false' ?                                             
                        this.props.tbar.map((tbar,i) => {
                                    return (   
                                        <div id={"windowButton"+i} className="windowButton" key={i} style={{width:tbar.width,height:tbar.height}}  onMouseOut={divMouseOut.bind(this,"windowButton"+i,configJson.windowColor)} onMouseOver={divMouseOver.bind(this,"windowButton"+i,configJson.windowColor)}>                                    
                                            <div style={{width:'calc(100% - 5px)',float:'left'}} onClick={tbar.function}> 
                                                <MaterialIcon size={24} icon={tbar.icon} invert/>
                                                <button className="save">{tbar.title}</button>                                             
                                            </div>
                                            {//la barra separadora
                                               i < this.props.tbar.length-1 ? 
                                                  <div className="windowSeparator" style={{height:tbar.height}}></div>
                                               : ''
                                            }
                                            
                                        </div>
                                    )
                        })                       
                    : ''
                }
                </div>                     
                <WindowContainer componente={this.props.componente} params={this.props.params} />
            </Modal>  				
			  );
  	}    
}

export default Window