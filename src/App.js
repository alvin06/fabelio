import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
// import Select from 'react-select';

function Product(props){
  return(
    <div className="card">
      <div className="card-container">
        <div className="row">
          <b className="col-lg-6 product-name">{props.name}</b>
          <p className="col-lg-6 right price">{props.price}</p>
        </div>
        <p>{props.description}</p>
        <p className="row">{props.furnitureStyle}</p>
        <p className="right delivery">{props.deliveryTime} Days</p>
      </div>
    </div>
  )
}

class App extends Component{
  state ={
    ListProducts:[],
    ListProductsFiltered:[],
    ListFurnitureStyle:[{
      value:1,
      label:''
    }],
    ListDelivery:[{
        value:7,
        label: '1 Week'
      },
      {
        value: 14,
        label: '2 Week'
      },
      {
        value: 30,
        label: '1 Month'
      },
      {
        value: 31,
        label: '& More'
      }
    ],
    SearchValue:'',
    SelectValue:[],
    SelectDelivValue:0
  }

  componentWillMount(){
    this._getApiList();
  }

  _getApiList(){
    let listProduct = {...this.state.ListProducts};
    // let listFurniture = {...this.state.ListFurnitureStyle};
    let listFurniture =[];
    axios.get('http://www.mocky.io/v2/5c9105cb330000112b649af8')
    .then(response => {
      // get list product from API
      listProduct = response.data.products;
      this.setState({ListProducts: listProduct});
      // get list furniture style from API
      for(let i = 0; i<response.data.furniture_styles.length; i++){
        listFurniture.push({
          value: response.data.furniture_styles[i],
          label: response.data.furniture_styles[i]
        })
        this.setState({ListFurnitureStyle: listFurniture}); 
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  _changeBySearch(e){
    this.setState({SearchValue: e.target.value.substr(0,20)});
  }
  _changeBySelectFurniture(e){
    let selectedValue = [] ;
    for(let i=0; i<e.length; i++){
      selectedValue.push(e[i].value)
    }
    this.setState({SelectValue: selectedValue})
  }
  _changeBySelectDelivery(e){
    var value1 = 0;
    for(let i=0; i<e.length; i++){
      if(e[i].value > value1){
        value1 = e[i].value
      }
    }
    this.setState({SelectDelivValue: value1})
  }

  render(){
    return (
      <div className="">
        <div className="App-header">
          <input className="search" type="text" onChange = {this._changeBySearch.bind(this)} value={this.state.SearchValue} placeholder="Search..."></input>
          <br></br>
          <div className="row">
            <ReactMultiSelectCheckboxes 
              options={this.state.ListFurnitureStyle}
              onChange={this._changeBySelectFurniture.bind(this)}
            />
            <br/>
            <ReactMultiSelectCheckboxes 
              options={this.state.ListDelivery}
              onChange={this._changeBySelectDelivery.bind(this)}
            />
          </div>
        </div>
        {this.renderProductBySearch()}
      </div>
    );
  }

  renderProductBySearch(){
    let filteredProduct = [];
    // filter name product
    filteredProduct = this.state.ListProducts.filter(
      (ListProducts) => {
        return ListProducts.name.toLowerCase().indexOf(this.state.SearchValue.toLowerCase()) !== -1;
      }
    );
    // filter delivery time
    if(this.state.SelectDelivValue !== 0){
      filteredProduct = filteredProduct.filter(
        (ListProduct) => {
          return ListProduct.delivery_time <= this.state.SelectDelivValue;
        }
      )
    };
    // filter multiple select furniture style
    if(this.state.SelectValue.length>0){
      filteredProduct = filteredProduct.filter(
        (ListProduct) => {
          for (let i=0; i<ListProduct.furniture_style.length; i++){
            for(let j=0; j<this.state.SelectValue.length; j++){
              if(ListProduct.furniture_style[i] === this.state.SelectValue[j]){
                return ListProduct.furniture_style[i];
              }
            }
          }
        }
      )
    }

    return(
      <div>
        {filteredProduct.map(item => (
          <Product key = {item.name} 
            name = {item.name} 
            price = {item.price} 
            description = {item.description} 
            deliveryTime = {item.delivery_time} 
            furnitureStyle = {item.furniture_style.map(itemFurniture =>(
              <p className="text-left furniture-style" key={itemFurniture}>{itemFurniture}</p>
            ))}/>
        ))}
      </div>
    )
  }
}

export default App;
