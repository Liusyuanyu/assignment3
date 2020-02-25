class InventorySubhead extends React.Component {
    render() {
        const subhead = "Showing all available products";
        return (
            <div>{subhead}</div>
        );
    }
}

// const initialProducts = [
//     {
//         id: 1, name: 'Blue Shirt',price: '16.99', 
//         category: 'Shirts', image_url: 'https://images.app.goo.gl/A1VVdgNYDBFprrow5',
//     },
//     {
//         id: 2, name: 'Logo Hat',price: '12.99',
//         category: 'Accessories', image_url: 'https://images.app.goo.gl/bBjLavbRvs7DJtpu8',
//     },
//     {
//         id: 3, name: 'Regular Fit Jeans',price: '34.99',
//         category: 'Jeans', image_url: 'https://images.app.goo.gl/ALG2aDEKpPxGV9137',
//     },
//   ];


function ProductRow(props) {
    const product = props.product;
    return (
      <tr>
        <td id='body_pro_id'>{product.id}</td>
        <td>{product.Name}</td>
        <td>{'$'+product.Price}</td>
        <td>{product.Category}</td>
        <td><a href={product.Image} target="_blank">View</a></td>
      </tr>
    );
}

function ProductTable(props) {
    const productRows = props.products.map(product =>
      <ProductRow key={product.id} product={product} />
    );
    return (
      <table className="bordered-table">
        <thead>
          <tr>
            <th id='head_pro_id'>id</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {productRows}
        </tbody>
      </table>
    );
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    var price = form.priceper.value;
    price = price.replace('$','');
    const product = {
      name: form.name.value, category: form.category.value,
      price: price, image_url: form.image_url.value
    };
    this.props.createProduct(product);
    form.reset();
  }
  render() {
    return (
      <form name="productAdd" onSubmit={this.handleSubmit}>
        <div class="grid_container">
          <div>
            <label>Category</label>
            <br/>
            <select type="text" name="category" selectedIndex={1}>
              <option value='Shirts'>Shirts</option>
              <option value='Jeans'>Jeans</option>
              <option value='Jackets'>Jackets</option>
              <option value='Sweaters'>Sweaters</option>
              <option value='Accessories'>Accessories</option>
            </select>
          </div>
          <div>
            <label>Price Per Unit</label>
            <br/>
            <input type="text" name="priceper" defaultValue={'$'}/>
          </div>
          <div>
            <label>Product Name</label>
            <br/>
            <input type="text" name="name"/>
          </div>
          <div>
            <label>Image URL</label>
            <br/>
            <input type="text" name="image_url"/>
          </div>
        </div>
        <br/>
        <button>Add Product</button>
      </form>
    );
  }
}



const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

async function graphQLFetch(query, variables = {}) {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ query, variables })
  });
  const body = await response.text();
  const result = JSON.parse(body, jsonDateReviver);
  return result.data;
}

class MyProductList extends  React.Component{
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
    // alert("After loadData");
    // alert(products[0]);
    // alert(this.state.products);
  }
  async loadData() {
    const query = `query {
      productList {
        id Name Price Category Image
      }
    }`;
    const data = await graphQLFetch(query);
    this.setState({ products: data.productList });
    // alert(data.productlist);
  }

  async createProduct(product) {
    const query = `mutation productAdd($product: ProductInputs!) {
      productAdd(product: $product) {
        id
      }
    }`;
    const data = await graphQLFetch(query, { product });
    
    query = `query {
      productList {
        id Name Price Category Image
      }
    }`;
    data = await graphQLFetch(query);

    this.setState({ products: data.productlist });

    // product.id = this.state.products.length + 1;
    // const newProductList = this.state.products.slice();
    // newProductList.push(product);
    // this.setState({ products: newProductList });
  }
  
  render(){
    const head = "My Company Inventory";
    const addhead = "Add a new product to inventory";
    return(
        <React.Fragment>
            <h1>{head}</h1>
            <InventorySubhead/>
            <hr/><br/>
            <ProductTable products={this.state.products}/><br/>
            <label>{addhead}</label>
            <hr/>
            <ProductAdd createProduct = {this.createProduct}/>
        </React.Fragment>
    )
  }
}

const element =<MyProductList/>;
ReactDOM.render(element, document.getElementById('contents'));