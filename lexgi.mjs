import { createSlug, slugify } from "./utils.js";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { CollectionsConfig, lexgiConfig } from "./lexgi.config.mjs";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const { originalname } = file;
        const extension = originalname.split('.')[1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`)
    }
})
  
const upload = multer({ storage: storage })

const Schema = mongoose.Schema;

const fieldTypeTypes = {
    text: {
      type: String,
    },
    richText: {
      type: String,
    },
    select: {
      type: String,
    },
    number: {
      type: Number,
    },
    relation: {
      type: Schema.ObjectId,
    },
    object: {
      type: Object,
    },
    images: {
      type: Array,
    },
    image: {
      type: String,
    },
    array: {
      type: Array,
    },
    boolean: {
      type: Boolean,
    },
};

export const LEXI_CONFIG = lexgiConfig;

export let Collections = {
  users: {
    name: "Users",
    slug: "users",
  },
};

const collectionRouter = express.Router();

addCollections(CollectionsConfig);

export function addCollections(newCollections) {
  Collections = {
    users: {
      name: "Users",
      slug: "users",
    },
  };
  newCollections.forEach((newCollection) => {
    newCollection.slug = createSlug(newCollection.name);
    const collectionExists = Collections[newCollection.slug];

    Collections[newCollection.slug] = newCollection;

    if (!collectionExists) {
      createCollectionEndpoints(newCollection, collectionRouter);
    }
  });
}

export function getCollection(collectionSlug) {
  return Collections[collectionSlug];
}

export function createCollectionEndpoints(collection, router) {
    const { fields } = collection;
  
    let newSchema = {};
    let uploadFields = [];
  
    if (fields) {
      fields.forEach((field) => {
        
  
        if(field.type === 'relation'){
          newSchema[field.name] = {
            type: fieldTypeTypes[field.type].type,
            ref: field.relationTo
          };
  
          if(field.hasMany){
            newSchema[field.name] = [newSchema[field.name]]
          }        
  
        } else {
  
          newSchema[field.name] = {
            type: fieldTypeTypes[field.type].type,
          };
  
        }
  
        if (field.required) {
          newSchema[field.name].required = field.required;
        }
  
        if (field.unique) {
          newSchema[field.name].unique = field.unique;
        }
  
        if (field.default === null) {
          newSchema[field.name].default = null;
        } else {
          if (field.default != undefined)
            newSchema[field.name].default = field.default;
        }
  
        // Upload fields
        if(field.type === 'image'){
          uploadFields.push({name: field.name, maxCount: 1})
        }
  
        if(field.type === 'images'){
          uploadFields.push({name: field.name, maxCount: field?.max || 10})
        }
      });
    }
  
    const schema = new Schema(newSchema, { timestamps: true });
  
    // Define el modelo de mongoose para la colección
    const Model = mongoose.models[collection.slug] || mongoose.model(collection.slug, schema);
  
    const cpUpload = upload.fields(uploadFields)
    
    router.post(`/${collection.slug}`, cpUpload, async (req, res) => {
      try {
        const { name, slug} = req.body;
  
        const files = req.files;
        const data = req.body;
  
        if(files){
          Object.keys(files).map(key => {
            const fieldFiles = files[key];
            collection?.fields.forEach((field) => {
              if(field.type === 'images' || field.type === 'image'){
                if(field.name === key){
                  const multiple = field?.multiple;
                  const fileNamesArray = [];
  
                  fieldFiles.forEach(fieldFile => {
                    fileNamesArray.push(fieldFile.filename);
                  })
  
                  if(multiple){
                    data[key] = fileNamesArray;
                  }else {
                    data[key] = fileNamesArray[0];
                  }
  
                  console.log({multiple})
                }
              }
            })
            
          })
        }
    
        if(!slug || slug === undefined){
          data.slug = slugify(name)
        } else {
          data.slug = slugify(slug)
        }
    
        const newDoc = new Model(data);
        await newDoc.save();
    
        res.send({
          data: newDoc
        })
        
      } catch (error) {
        console.error("Error creating " + collection.slug, error.message);
        res.status(500).send({ 
          error: "Error creating " + collection.slug,
          message: error.message
        });
      }
      
    });
  
    router.get(`/${collection.slug}`, async (req, res) => {
      const {page, limit} = req.query;
      const skip = (page - 1) * limit;
    
      const documents = await Model.find().limit(limit * 1).skip(skip);
    
      res.send(documents)
    });
  
    router.get(`/${collection.slug}/:idOrSlug`, async (req, res) => {
      try {
        const { idOrSlug } = req.params;
    
        const query = {
          $or: [
            { _id: mongoose.Types.ObjectId.isValid(idOrSlug) ? idOrSlug : null },
            { slug: idOrSlug },
          ]
        };
    
        const doc = await Model.findOne(query); // Selecciona los campos que necesitas
    
        if (!doc) {
          return res.status(404).send({ error: collection.name + " no encontrado" });
        }
    
        res.send(doc);
    
      } catch (error) {
        console.error("Error al buscar el producto:", error.message);
        res.status(500).send({ error: "Error interno del servidor" });
      }
    });
  
    router.patch(`/${collection.slug}/:idOrSlug`, cpUpload, async (req, res) => {
      try {
        const { idOrSlug } = req.params;
        const { name, slug } = req.body;
        const files = req.files;
        let updateData = req.body;
  
        if(files){
          Object.keys(files).map(key => {
            const fieldFiles = files[key];
            collection?.fields.forEach((field) => {
              if(field.type === 'images' || field.type === 'image'){
                if(field.name === key){
                  const multiple = field?.multiple;
                  const fileNamesArray = [];
  
                  fieldFiles.forEach(fieldFile => {
                    fileNamesArray.push(fieldFile.filename);
                  })
  
                  if(multiple){
                    updateData[key] = fileNamesArray;
                  }else {
                    updateData[key] = fileNamesArray[0];
                  }
  
                  console.log({multiple})
                }
              }
            })
            
          })
        }
    
    
        const query = {
          $or: [
            { _id: mongoose.Types.ObjectId.isValid(idOrSlug) ? idOrSlug : null },
            { slug: idOrSlug },
          ]
        };
    
        if(slug === undefined){
          if(name) updateData.slug = slugify(name)
        } else {
          updateData.slug = slugify(slug)
        }
    
        const updatedDoc = await Model.findOneAndUpdate(query, updateData, { new: true });
        console.log({updatedDoc})
        if (!updatedDoc) {
          return res.status(404).send({ error: "This document not exists" });
        }
    
        res.send({updatedDoc});
    
      } catch (error) {
        console.error("Error al actualizar el producto:", error.message);
        res.status(500).send({ error: "Error interno del servidor" });
      }
    });
    
  
    // APARTIR DE AQUí es lo antiguo
  
    // router.get(`/${collection.slug}`, (req, res) => {
    //   // Lógica para buscar todos los elementos de la colección
  
    //   Model.find({})
    //     .then((documents) => {
    //       res.send(documents);
    //     })
    //     .catch((err) => {
    //       res.send(err);
    //     });
    // });
  
    router.get(`/${collection.slug}/:id`, (req, res) => {
      // Lógica para buscar por ID en la colección
      res.send({
        type: "Find by Id",
        collectionSlug: collection.slug,
        collection,
        data: [{ id: 1, name: "John Doe" }],
      });
    });
  
    router.post(`/${collection.slug}`, (req, res) => {
      // Lógica para crear un nuevo elemento en la colección
      const requestBody = req.body;
  
      const collectionModel = new Model(requestBody);
  
      //Guardar collectionModel
      collectionModel
        .save()
        .then((newArticle) => {
          res.send("New Article Has been Added Into Your DataBase.");
        })
        .catch((err) => {
          res.send(err);
        });
  
      // res.send({
      //   type: "Create",
      //   collectionSlug: collection.slug,
      //   collection,
      //   body: requestBody,
      // });
    });
}