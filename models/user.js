//Shows the properties of the user  

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  wishlist: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        
      }
    ]
  }
});

//Method to add product to wish list

userSchema.methods.addTowishlist = function(product) {
  const wishlistProductIndex = this.wishlist.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  
  const updatedwishlistItems = [...this.wishlist.items];
  
  if (wishlistProductIndex < 0) 
    updatedwishlistItems.push({
      productId: product._id,

    });
  

  const updatedwishlist = {
    items: updatedwishlistItems
  };
  this.wishlist = updatedwishlist;
  return this.save();
};

//Method to delete from wishlist

userSchema.methods. deleteItemFromwishlist = function(productId) {
    const updatedwishlistItems = this.wishlist.items.filter(item => {
       return item.productId.toString() !== productId.toString();
     });
     this.wishlist.items= updatedwishlistItems;
     return this.save();
  
};

module.exports = mongoose.model('User', userSchema);

