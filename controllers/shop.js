const Product = require('../models/product');

//Similar to the admin page all the products are viewed with this  .

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

//Used to select individual product and rendered. in 

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

//all product are displayed in the index page 

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

//Used for displaying the selected products for the wishlist if nothing 

exports.getwishlist = (req, res, next) => {
  req.user
  .populate('wishlist.items.productId')
  .execPopulate()
    .then(user => {
      const products = user.wishlist.items;
      res.render('shop/wishlist', {
        path: '/wishlist',
        pageTitle: 'Your wishlist',
        products: products
      });
    })
    .catch(err => console.log(err));
};

//adding products to wish list
 
exports.postwishlist = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedSize = req.body.sizel;
  Product.findOneAndUpdate({_id : prodId }, {size:updatedSize}
    , null, function (err, docs) { 
    if (err){ 
        console.log(err) 
    } 
    else{ 
        console.log("Original Doc : ",docs); 
    } 
    });
  Product.findById(prodId)
    .then(product => {
      return req.user.addTowishlist(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/wishlist');
    });
};

//Delete items from the wishlist

exports.postwishlistDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromwishlist(prodId)
    .then(result => {
      res.redirect('/wishlist');
    })
    .catch(err => console.log(err));
};


