// const productDB = [
//   {
//     id: 1, Name: 'Blue Shirt',Price: '16.99', 
//     Category: 'Shirts', Image: 'https://images.app.goo.gl/A1VVdgNYDBFprrow5',
//   },
//   {
//     id: 2, Name: 'Logo Hat',Price: '12.99',
//     Category: 'Accessories', Image: 'https://images.app.goo.gl/bBjLavbRvs7DJtpu8',
//   },
//   {
//     id: 3, Name: 'Regular Fit Jeans',Price: '34.99',
//     Category: 'Jeans', Image: 'https://images.app.goo.gl/ALG2aDEKpPxGV9137',
//   },
// ];

const productDB =[];

function productAdd(_, { product }) {
  product.id = productDB.length + 1;
  productDB.push(product);
  return product;
}

function productList() {
  return productDB;
}

const resolvers = {
  Query: {
    productList,
  },

  Mutation: {
    productAdd,
  },
};

const fs = require('fs');
const { ApolloServer} = require('apollo-server-express');
const express = require('express');

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
});
const app = express();
app.use("/",express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

app.listen(3000, function () {
  console.log('App started on port 3000');
});