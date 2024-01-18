import { createSlug, slugify } from "./utils.js";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import autopopulate from 'mongoose-autopopulate';
import { CollectionsConfig } from "./lexgi.config.mjs";
import userExtractor from "./middleware/userExtractor.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    const cpUpload = upload.fields(uploadFields)
  
    if (fields) {
      fields.forEach((field) => {
        
        if(field.type === 'relation'){         
          const relationToSlug = slugify(field.relationTo);
          newSchema[field.name] = {
            type: fieldTypeTypes[field.type].type,
            ref: relationToSlug,
            autopopulate: true,
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
    schema.plugin(autopopulate);

    const Model = mongoose.models[collection.slug] || mongoose.model(collection.slug, schema);

    if(collection.slug === 'users'){
      // Users
      router.post("/users", async (req, res) => {
        const { email, password } = req.body;

        const existingUser = await Model.findOne({ email });

        if (existingUser) {
          return res.status(400).send({ ok:false, error: "User already exists" });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        let newUserName = email.split("@")[0] || null;

        const existingUserName = await Model.findOne({ userName: newUserName });

        if (existingUserName) {
          const randomString = generateRandomString(5);
          newUserName = newUserName + "-" + randomString;
        }

        const user = new Model({
          userName: newUserName,
          email,
          password: hash,
        });

        await user.save();

        if (user) {
          res.status(200).send({ ok: true, user, message: 'User created'});
        } else {
          res.status(400).send({ ok: false, error: "Error creating user" });
        }
      });

      router.get("/users", userExtractor, async (req, res) => {
        const users = await Model.find({});

        // sacar userId de request
        res.send({
          userId: req.userId,
          users,
        });
      });

      router.post("/users/login", async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password)
          return res.status(400).send({ ok: false, error: "Missing email or password" });

        const user = await Model.findOne({ email });

        if (!user) {
          return res.status(401).send({
            ok: false,
            error: "Invalid user or password",
          });
        }

        const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.password);

        const userForToken = {
          id: user._id,
          name: user.name,
          userName: user.userName,
          email: user.email,
          role: user.role,
          address: user.address,
        };

        const token = await jwt.sign(userForToken, process.env.SECRET, {
          expiresIn: 60 * 60 * 24 * 7,
        });

        if (passwordCorrect) {
          res.send({
            ok: true,
            message: "Auth Passed",
            user: userForToken,
            token,
          });
        } else {
          res.status(401).send({
            ok: false,
            error: "Invalid user or password",
          });
        }
      });
      
    } else {
    
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
        const skip = ((page || 1) - 1) * (limit || 10);
      
        const documents = await Model.find();
      
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

          const doc = await Model.findOne(query)
      
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

          if (!updatedDoc) {
            return res.status(404).send({ error: "This document not exists" });
          }
      
          res.send({updatedDoc});
      
        } catch (error) {
          console.error("Error al actualizar el producto:", error.message);
          res.status(500).send({ error: "Error interno del servidor" });
        }
      });

      router.get(`/${collection.slug}/:prop/:value`, async (req, res) => {
        try {
          const {page, limit} = req.query;
          const skip = ((page || 1) - 1) * (limit || 10);
          const { prop, value } = req.params;

          console.log({value})

          const propArray = prop.split('.')
          const propName = propArray[0];
          const childProps = propArray.slice(1);

          console.log({propName, childProps})

          let collectionField = collection.fields.find((colField) => colField.name === propName);

          if(!collectionField) {
            return res.send({message: "La propiedad " + prop + ' no existe en la coleccion ' + collection.slug})
          }

          if(collectionField.type === 'relation' && childProps.length >= 1){
            const relationToSlug = slugify(collectionField?.relationTo);
            const relationModel = mongoose.models[relationToSlug];

            let childCollectionFind = {}

            childCollectionFind[childProps[0]] = value;

            const document = await relationModel.findOne(childCollectionFind);

            if(document){
              let find = {};
              find[propName] = document._id;
              const documents = await Model.find(find).limit(limit);
            
              res.send(documents)
            }
          }else {
            let find = {};
            find[propName] = value;
            const documents = await Model.find(find).limit(limit);
          
            res.send(documents)
          }

          

        } catch (error) {
          console.error("Error al buscar el producto:", error.message);
          res.status(404).send({ error: "Producto no encontrado" });
        }
      });
    }
}

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}