const mongoCollections = require("../config/mongoCollections");
const pending = mongoCollections.pendingProducts;
const validate = require("./validation");
const { ObjectId } = require("mongodb");

async function getAll() {
    const pendingCollection = await pending();
    const allPending = await pendingCollection.find({}).toArray();
  
    // Change all _id values to strings
    return allPending.map(validate.convertObjId);
}
  
async function getById(id) {
    if (!validate.validString(id)) throw "Pending product id must be a valid string.";
    let objId = ObjectId(id.trim());
    const pendingCollection = await pending();
    const prod = await pendingCollection.findOne({ _id: objId });
  
    if (!prod) throw `No Product found with id=${id}.`;
  
    // Convert _id field to string before returning
    return validate.convertObjId(prod);
}
  
  
async function createPending(productName, brand,) {
    if (!validate.validString(productName))
      throw "Product name must be a valid string.";
    if (!validate.validString(brand))
      throw "Product Brand must be a valid string.";
    
    const pendingCollection = await pending();
    const newProd = {
      productName: productName.trim(),
      brand: brand.trim(),
    };

    const insertInfo = await pendingCollection.insertOne(newProd);
    if (insertInfo.insertedCount === 0)
      throw "Could not add Product to database.";
    const id = insertInfo.insertedId.toString();
  
    return await getById(id);
  }

  async function deletePending(id) {
    if (!validate.validString(id)) throw "Pending product id must be a valid string.";
    const toDelete = await getById(id);
    if (toDelete == null) throw "Pending product not found";
    const pendingCollection = await pending();
    id = ObjectId(id);
    const deletionInfo = await pendingCollection.deleteOne({ _id: id });
  
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete pending product with id of ${id}`;
    }
  
    return `${toDelete._id}`;
  }
  
  module.exports = {
    getAll,
    getById,
    createPending,
    deletePending,
  };
  