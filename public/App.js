class InventorySubhead extends React.Component {
  render() {
    const subhead = "Showing all available products";
    return React.createElement("div", null, subhead);
  }

} // const initialProducts = [
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
  return React.createElement("tr", null, React.createElement("td", {
    id: "body_pro_id"
  }, product.id), React.createElement("td", null, product.Name), React.createElement("td", null, '$' + product.Price), React.createElement("td", null, product.Category), React.createElement("td", null, React.createElement("a", {
    href: product.Image,
    target: "_blank"
  }, "View")));
}

function ProductTable(props) {
  const productRows = props.products.map(product => React.createElement(ProductRow, {
    key: product.id,
    product: product
  }));
  return React.createElement("table", {
    className: "bordered-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    id: "head_pro_id"
  }, "id"), React.createElement("th", null, "Name"), React.createElement("th", null, "Price"), React.createElement("th", null, "Category"), React.createElement("th", null, "Image"))), React.createElement("tbody", null, productRows));
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
    price = price.replace('$', '');
    const product = {
      name: form.name.value,
      category: form.category.value,
      price: price,
      image_url: form.image_url.value
    };
    this.props.createProduct(product);
    form.reset();
  }

  render() {
    return React.createElement("form", {
      name: "productAdd",
      onSubmit: this.handleSubmit
    }, React.createElement("div", {
      class: "grid_container"
    }, React.createElement("div", null, React.createElement("label", null, "Category"), React.createElement("br", null), React.createElement("select", {
      type: "text",
      name: "category",
      selectedIndex: 1
    }, React.createElement("option", {
      value: "Shirts"
    }, "Shirts"), React.createElement("option", {
      value: "Jeans"
    }, "Jeans"), React.createElement("option", {
      value: "Jackets"
    }, "Jackets"), React.createElement("option", {
      value: "Sweaters"
    }, "Sweaters"), React.createElement("option", {
      value: "Accessories"
    }, "Accessories"))), React.createElement("div", null, React.createElement("label", null, "Price Per Unit"), React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "priceper",
      defaultValue: '$'
    })), React.createElement("div", null, React.createElement("label", null, "Product Name"), React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "name"
    })), React.createElement("div", null, React.createElement("label", null, "Image URL"), React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "image_url"
    }))), React.createElement("br", null), React.createElement("button", null, "Add Product"));
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
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      variables
    })
  });
  const body = await response.text();
  const result = JSON.parse(body, jsonDateReviver);
  return result.data;
}

class MyProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      products: []
    };
    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.loadData(); // alert("After loadData");
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
    this.setState({
      products: data.productList
    }); // alert(data.productlist);
  }

  async createProduct(product) {
    const query = `mutation productAdd($product: ProductInputs!) {
      productAdd(product: $product) {
        id
      }
    }`;
    const data = await graphQLFetch(query, {
      product
    });
    query = `query {
      productList {
        id Name Price Category Image
      }
    }`;
    data = await graphQLFetch(query);
    this.setState({
      products: data.productlist
    }); // product.id = this.state.products.length + 1;
    // const newProductList = this.state.products.slice();
    // newProductList.push(product);
    // this.setState({ products: newProductList });
  }

  render() {
    const head = "My Company Inventory";
    const addhead = "Add a new product to inventory";
    return React.createElement(React.Fragment, null, React.createElement("h1", null, head), React.createElement(InventorySubhead, null), React.createElement("hr", null), React.createElement("br", null), React.createElement(ProductTable, {
      products: this.state.products
    }), React.createElement("br", null), React.createElement("label", null, addhead), React.createElement("hr", null), React.createElement(ProductAdd, {
      createProduct: this.createProduct
    }));
  }

}

const element = React.createElement(MyProductList, null);
ReactDOM.render(element, document.getElementById('contents'));