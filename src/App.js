import React, {useState,useEffect}from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory,{textFilter,numberFilter} from 'react-bootstrap-table2-filter';
import {Modal,ModalBody,ModalFooter,ModalHeader,Card,Breadcrumb,BreadcrumbItem,Col} from  'reactstrap';

function App() {
  const baseUrl="https://localhost:44350/Api/CatalogoProductos";
  const baseUrlEditar="https://localhost:44350/Api/Editar";
  const baseUrlEliminar="https://localhost:44350/Api/EliminarProducto/";
  const baseUrlValidar="https://localhost:44350/Api/ValidarProducto/";
  const [data,setData]=useState([]);
  const [modalAgregar,setModalAgregar]=useState(false);
  const [modalEditar,setModalEditar]=useState(false);
  const [modalEliminar,setModalEliminar]=useState(false);
  const [catalogoSeleccionado,setCatalogoSeleccionado]=useState({
    Id:0,
    Nombre:'',
    Descripcion:'',
    Categoria:'',
    Fecha:'',
    Stock:'',
    Precio:'',
  });

  const haddleChange = e =>{
    const {name, value } = e.target;
    setCatalogoSeleccionado({
      ...catalogoSeleccionado,
      [name]: value
    });
    console.log(catalogoSeleccionado);
  }

  const consultaCatalogo =async () => { 
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
      console.log(data);
    }).catch(error=>{
      console.log(error)
    })
  }


  const columns = [
    {
      dataField:"Id",
      text: "Id",
      sort: true,
    },
    {
      dataField:"Nombre",
      text: "Nombre",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField:"Descripcion",
      text: "Descripcion",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField:"Categoria",
      text: "Categoria",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField:"Stock",
      text: "Stock",
      sort: true,
    },
    {
      dataField:"Precio",
      text: "Precio",
      sort: true,
    },
    {
      dataField:"Fecha_registro",
      text: "Fecha del Registro",
      sort: true,
    },
    
  ]
  
  
  const agregarProducto =async () => { 
    delete catalogoSeleccionado.Id;
    await axios.post(baseUrl,catalogoSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      consultaCatalogo();
      gestionarModalAgregar();
      Swal.fire({
        title: 'Correcto',
        text: response.data,
        showConfirmButton: false,
        icon:'success',
        timer:'2000'
      })
    }).catch(error=>{
      Swal.fire({
        title: 'Error',
        showConfirmButton: false,
        text: error,
        icon:'error',
        timer:'2000'
      })
      console.log(error)
    })
  }

  const validarProducto =async () => { 
    const obj = {
      "Nombre":catalogoSeleccionado.Nombre
    }
    await axios.post(baseUrlValidar,obj)
    .then(response=>{
      setData(data.concat(response.data));
      var respuesta = response.data;
      if(respuesta === true)
      {
        agregarProducto();
      }
      else
      {
        Swal.fire({
          title: 'El producto '+ catalogoSeleccionado.Nombre+ ' ya existe',
          position: 'top-end',
          showConfirmButton: false,
          icon:'warning',
          timer:'3000'
        });
        consultaCatalogo();
      }
    }).catch(error=>{
      Swal.fire({
        title: 'Error',
        text: error,
        showConfirmButton: false,
        icon:'error',
        timer:'2000'
      })
      console.log(error)
    })
  }

  const editarProducto =async () => { 
    await axios.post(baseUrlEditar,catalogoSeleccionado)
    .then(response=>{
      var respuesta = response.data;
      var dataAuxiliar = data;
      dataAuxiliar.map(catalogo=>{
        if(catalogo.Id === catalogoSeleccionado.Id){
          catalogo.Nombre = respuesta.Nombre;
          catalogo.Descripcion = respuesta.Descripcion;
          catalogo.Categoria = respuesta.Categoria;
          catalogo.Stock = respuesta.Stock;
          catalogo.Precio = respuesta.Precio;
        }
      })
      consultaCatalogo();
      gestionarModalEditar();
      Swal.fire({
        title: 'Correcto',
        text: response.data,
        showConfirmButton: false,
        icon:'success',
        timer:'2000'
      })
    }).catch(error=>{
      console.log(error)
      Swal.fire({
        title: 'Error',
        text: error,
        showConfirmButton: false,
        icon:'error',
        timer:'2000'
      })
    })
  }

  const eliminarProducto =async () => { 
    console.log(catalogoSeleccionado.Id);
    const obj = {
      "Id":catalogoSeleccionado.Id
    }
    await axios.post(baseUrlEliminar,obj)
    .then(response=>{
      setData(data.filter(catalogo=>catalogo.Id!==response.data))
      consultaCatalogo();
      gestionarModalEliminar();
      Swal.fire({
        title: 'Correcto',
        text: "Producto eliminado correctamente",
        showConfirmButton: false,
        icon:'success',
        timer:'2000'
      })
    }).catch(error=>{
      console.log(error)
      Swal.fire({
        title: 'Error',
        text: error,
        showConfirmButton: false,
        icon:'error',
        timer:'2000'
      })
    })
  }

const gestionarModalAgregar=()=>{
 setModalAgregar(!modalAgregar);
}

const gestionarModalEditar=()=>{
  setModalEditar(!modalEditar);
 }

 const gestionarModalEliminar=()=>{
  setModalEliminar(!modalEliminar);
 }

 const consultarProducto=(producto,caso)=>{
  setCatalogoSeleccionado(producto);
  (caso ==="Editar")?
  gestionarModalEditar(): gestionarModalEliminar();
 }
 

  useEffect(()=>{
  consultaCatalogo();
    },[])
  

  return (
    
    <div className="App mx-4">
    
      <Card body className='mx-4'>
        <div className="mx-4">
                    <Breadcrumb>
                        <BreadcrumbItem active>Prueba Técnica Hogar Universal</BreadcrumbItem>
                        <BreadcrumbItem active>Catalogo de Productos</BreadcrumbItem>
                    </Breadcrumb>
        </div>
        <button className='btn btn-outline-success' onClick={()=>gestionarModalAgregar()}>Insertar</button>
        <br />
        <Col>
          <h4 style={{ marginLeft: "40px" }}>
              Tabla con Acciones
          </h4>
        </Col>
      <table className="table table-bordered table-responsive">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Precio</th>
            <th>Fecha de Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {data.map(catalogo=>(
          <tr key={catalogo.Id}>
            <td>{catalogo.Id}</td>
            <td>{catalogo.Nombre}</td>
            <td>{catalogo.Descripcion}</td>
            <td>{catalogo.Categoria}</td>
            <td>{catalogo.Stock}</td>
            <td>{catalogo.Precio}</td>
            <td>{catalogo.Fecha_registro}</td>
            <td>
              <button className="btn btn-primary mx-1" onClick={()=>consultarProducto(catalogo,"Editar")}>Editar</button>
              <button className="btn btn-danger" onClick={()=>consultarProducto(catalogo,"Eliminar")}>Eliminar</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>  
      <Modal isOpen={modalAgregar}>
        <ModalHeader>Insertar Producto</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre: </label>
            <br />
            <input type="text" className="form-control" name='Nombre' placeholder='Digite el nombre del producto' onChange={haddleChange} required/>
            <br />
            <label>Descripcion: </label>
            <br />
            <input type="text" className="form-control" name='Descripcion' placeholder='Digite la descripción del producto' onChange={haddleChange} required/>
            <br />
            <label>Categoria: </label>
            <br />
            <input type="text" className="form-control" name='Categoria' placeholder='Digite la categoría del producto' onChange={haddleChange} required/>
            <br />
            <label>Stock: </label>
            <br />
            <input type="number" className="form-control" name='Stock' placeholder='Digite el stock del producto' onChange={haddleChange} required/>
            <br />
            <label>Precio: </label>
            <br />
            <input type="number" className="form-control" name='Precio' placeholder='Digite el precio del producto' onChange={haddleChange} required/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-success' onClick={()=>validarProducto()}>Insertar</button>
          <button className='btn btn-secondary' onClick={()=>gestionarModalAgregar()}>Cerrar</button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalEditar}>
        <ModalHeader>Editr Producto</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Id: </label>
            <br />
            <input type="text" className="form-control" name='Descripcion' readOnly value={catalogoSeleccionado && catalogoSeleccionado.Id}/>
            <br />
            <label>Nombre: </label>
            <br />
            <input type="text" className="form-control" name='Nombre' readOnly value={catalogoSeleccionado && catalogoSeleccionado.Nombre}/>
            <br />
            <label>Descripcion: </label>
            <br />
            <input type="text" className="form-control" name='Descripcion' onChange={haddleChange} value={catalogoSeleccionado && catalogoSeleccionado.Descripcion} required/>
            <br />
            <label>Categoria: </label>
            <br />
            <input type="text" className="form-control" name='Categoria' onChange={haddleChange} value={catalogoSeleccionado && catalogoSeleccionado.Categoria} required/>
            <br />
            <label>Stock: </label>
            <br />
            <input type="number" className="form-control" name='Stock' onChange={haddleChange} value={catalogoSeleccionado && catalogoSeleccionado.Stock} required/>
            <br />
            <label>Precio: </label>
            <br />
            <input type="number" className="form-control" name='Precio' onChange={haddleChange} value={catalogoSeleccionado && catalogoSeleccionado.Precio} required/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-success' onClick={()=>editarProducto()}>Editar</button>
          <button className='btn btn-secondary' onClick={()=>gestionarModalEditar()}>Cerrar</button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalEliminar}>
        <ModalBody>
          ¿Estás seguro de eliminar el producto {catalogoSeleccionado && catalogoSeleccionado.Nombre}?
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-danger' onClick={()=>eliminarProducto()}>
            Si
          </button>
          <button className='btn btn-secondary' onClick={()=>gestionarModalEliminar()}>
            No
          </button>
        </ModalFooter>
      </Modal>
      <br />
        <Col>
          <h4 style={{ marginLeft: "40px" }}>
              Tabla con Filtros y Paginación
          </h4>
        </Col>
      <BootstrapTable  className='table table-bordered table-responsive' keyField='Id' data={data} columns={columns} pagination={paginationFactory()} filter={filterFactory()}/>
      </Card>
    </div>
  );
}

export default App;
