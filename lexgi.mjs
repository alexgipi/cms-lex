import { createSlug, slugify } from "./utils.js";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import autopopulate from 'mongoose-autopopulate';
import { lexiConfig } from "./lexgi.config.mjs";
import userExtractor from "./middleware/userExtractor.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isAdmin from "./middleware/isAdmin.js";
import { DEFAULT_LEXI_SETTINGS } from "./consts.js";
import fs from "fs";
import sharp from "sharp";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const { originalname } = file;
        const originalnameSplitted = originalname.split('.');        
        const name = slugify(originalnameSplitted[0]);
        const extension = originalnameSplitted[1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

        cb(null, `${name}.${extension}`)
    }
})

  
const upload = multer({ storage: storage })

const Schema = mongoose.Schema;

const fieldTypeTypes = {
    text: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
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

export let DashboardConfig = {
  title: "Lexi CMS"
}

export let Settings = lexiConfig.settings || {};

if(lexiConfig.dashboard){
  DashboardConfig = lexiConfig.dashboard;
}

// console.log(Settings)

const collectionRouter = express.Router();

addCollections(lexiConfig.collections);
addSettings(lexiConfig.settings);

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

export async function addSettings(newSettings) {
  Settings = {
    'lexi-settings': DEFAULT_LEXI_SETTINGS
  };

  newSettings.forEach(async (newSetting) => {
    newSetting.slug = createSlug(newSetting.name);
    Settings[newSetting.slug] = newSetting;
    
    createSettingEndpoints(newSetting, collectionRouter);
    
  })

  
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

          if (field.type === 'images' || field.type === 'image'){
            const relationToSlug = slugify(field.relationTo);
           
            if(relationToSlug != 'undefined'){
              // console.log(relationToSlug, field.name)
              newSchema[field.name] = {
                type: Schema.ObjectId,
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
          } else {
            newSchema[field.name] = {
              type: fieldTypeTypes[field.type].type,
            };
          }          
  
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

        const existingUserName = await Model.findOne({ username: newUserName });

        if (existingUserName) {
          const randomString = generateRandomString(5);
          newUserName = newUserName + "-" + randomString;
        }

        const user = new Model({
          username: newUserName,
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
          username: user.username,
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
      
    }
    
    router.post(`/${collection.slug}`, cpUpload, async (req, res) => {
      try {
        const { name, slug } = req.body;
        const files = req.files;
        const data = req.body;

        if (!slug || slug === undefined) {
          data.slug = slugify(name);
        } else {
          data.slug = slugify(slug);
        }
    
        if (files) {
          for (const key of Object.keys(files)) {
            const fieldFiles = files[key];
    
            await Promise.all(
              fieldFiles.map(async (fieldFile) => {
                let newMediaData = {
                  file: fieldFile.filename,
                };

                console.log(fieldFile)
                helperImg(fieldFile.path, "uploads/thumbnail/" + fieldFile.filename, 300 )
                // helperImg(fieldFile.path, "uploads/" + fieldFile.filename, 1280 )

                if(collection.slug === 'media'){
                  newMediaData = {
                    ...newMediaData,
                    ...data
                  }

                  console.log({newMediaData})

                  
                }
    
                const newMedia = new mongoose.models['media'](newMediaData);
                await newMedia.save();
                
                if(collection.slug === 'media'){
                  return res.send({
                    data: newMedia,
                  });
                } else {
                  return newMedia._id;
                }
                
              })
            ).then((mediaIdsArray) => {
              
              if(collection.slug !== 'media'){
                const field = collection?.fields.find((field) =>
                  field.type === 'images' || field.type === 'image' ? field.name === key : false
                );
      
                if (field) {
                  const multiple = field?.multiple;
                  if (multiple) {
                    data[key] = mediaIdsArray;
                  } else {
                    data[key] = mediaIdsArray[0];
                  }
                }
              }
            });
          }
        }

        Object.keys(data).forEach(key => {
          if(key.startsWith('selectedMediaIds_')){
            const fieldToUpdate = key.split('_')[1];
            const fileIdsToAdd = data[key].split(',');
            console.log({fieldToUpdate, fileIdsToAdd})
            
            data[fieldToUpdate] = fileIdsToAdd[0];           
            

          } else if( key.startsWith('multiple_selectedMediaIds_')){
            const fieldToUpdate = key.split('_')[2];
            const fileIdsToAdd = data[key].split(',');
            
            if(data[fieldToUpdate] !== undefined) {
              data[fieldToUpdate] = [...data[fieldToUpdate], fileIdsToAdd];
            } else {
              data[fieldToUpdate] = [...fileIdsToAdd];
            }
          }
        });
    
        if(collection.slug !== 'media'){
          const newDoc = await new Model(data);
          await newDoc.save();
      
          res.send({
            data: newDoc,
          });
        }
        
      } catch (error) {
        console.error("Error creating " + collection.slug, error.message);
        res.status(500).send({
          error: "Error creating " + collection.slug,
          message: error.message,
        });
      }
    });
  
    router.get(`/${collection.slug}`, async (req, res) => {
      const {page, limit} = req.query;
      const skip = ((page || 1) - 1) * (limit || 10);
    
      const documents = await Model.find().select("-password");
    
      res.send(documents)
    });
    
    if(collection.slug === 'orders'){
      router.get("/orders/user", userExtractor, async (req, res) => {
        const { userId, userEmail } = req;
        const orders = await Model.find({ email:userEmail }).sort('-createdAt');

        // sacar userId de request
        res.send(orders);
      });
    }

    router.get(`/${collection.slug}/count`, async (req, res) => {
      try {
          const count = await Model.countDocuments();
          
          res.send({count}); // Envía el resultado del conteo como respuesta
  
      } catch (error) {
          console.error("Error al realizar el conteo de documentos:", error.message);
          res.status(500).send({ error: "Error interno del servidor" });
      }
    });

    router.get(`/${collection.slug}/:idOrSlug`, async (req, res) => {
      try {
        const { idOrSlug } = req.params;

        const query = {
          $or: [
            { _id: mongoose.Types.ObjectId.isValid(idOrSlug) ? idOrSlug : null },
            { slug: idOrSlug },
            { orderNumber: idOrSlug}
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
        const Media = mongoose.models['media'];

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
  
        if (files) {
          
          for (const key of Object.keys(files)) {
            const field = collection?.fields.find((field) =>
                field.type === 'images' || field.type === 'image' ? field.name === key : false
            );

            const fieldFiles = files[key];
    
            await Promise.all(
              fieldFiles.map(async (fieldFile) => {

                if(collection.slug === 'media'){
                  const updateMediaData = {
                    file: fieldFile.filename,
                  }

                  const updatedMediaDoc = await Media.findOneAndUpdate(query, updateMediaData, { new: true });

                  if (!updatedMediaDoc) {
                    return res.status(404).send({ error: "Error to update media" });
                  }

                  return updatedMediaDoc._id;
                  
                } else {
                  const newMediaData = {
                    file: fieldFile.filename,
                  };

                  const newMedia = new Media(newMediaData);
                  await newMedia.save();
      
                  return newMedia._id;
                }
    
                
              })
            ).then((mediaIdsArray) => {
              
    
              if (field) {
                const multiple = field?.multiple;
                
                if (multiple) {
                  // Construir la actualización para hacer push de forma programática
                  updateData.$push = { [key]: mediaIdsArray };
                } else {
                  updateData[key] = mediaIdsArray[0];
                }
              }
            });
          }
        }

        console.log({updateData})
        Object.keys(updateData).forEach(key => {
          if(key.startsWith('removeFileIds_')){

            const fieldToPull = key.split('_')[1];
            updateData[fieldToPull] = null;

          } else if( key.startsWith('multiple_removeFileIds_')){

            const fieldToPull = key.split('_')[2];
            const fileIdsToRemove = updateData[key].split(',');
            updateData.$pull = { [fieldToPull]: { $in: fileIdsToRemove } };

          }

          if(key.startsWith('selectedMediaIds_')){

            const fieldToUpdate = key.split('_')[1];
            const fileIdsToAdd = updateData[key].split(',');

            if(updateData[fieldToUpdate] !== undefined) {
              updateData[fieldToUpdate] = [...updateData[fieldToUpdate], fileIdsToAdd];
            } else {
              updateData[fieldToUpdate] = [fileIdsToAdd];
            }
            

          } else if( key.startsWith('multiple_selectedMediaIds_')){
            console.log("MULTIPLEEEEEEEEEEE")
            const fieldToUpdate = key.split('_')[1];
            const fileIdsToAdd = updateData[key].split(',');
            console.log(fileIdsToAdd)
            if(updateData[fieldToUpdate] !== undefined) {
              updateData[fieldToUpdate] = [...updateData[fieldToUpdate], fileIdsToAdd];
            } else {
              updateData[fieldToUpdate] = [fileIdsToAdd];
            }
          }
        });
        
    
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

    router.delete(`/${collection.slug}/:idOrSlug`, async (req, res) => {
      try {
        const { idOrSlug } = req.params;

        const query = {
          $or: [
            { _id: mongoose.Types.ObjectId.isValid(idOrSlug) ? idOrSlug : null },
            { slug: idOrSlug },
          ]
        };    
    
        const removedDoc = await Model.findOneAndDelete(query);

        if (!removedDoc) {
          return res.status(404).send({ error: "This document not removed" });
        }
    
        res.send({removedDoc});
    
      } catch (error) {
        console.error("Error al eliminar " + collection.slug, error.message);
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


export function getSettingCollection(collectionSlug) {
  return Settings[collectionSlug];
}


export async function createSettingEndpoints(collection, router) {
  // Define un esquema base para la colección "settings"
  const options = { discriminatorKey: 'settingType', timestamps: true };
  const settingSchema = new Schema({}, options);
  
  settingSchema.plugin(autopopulate);
  
  // Define el modelo base para la colección "settings"
  const SettingsModel = mongoose.models['Settings'] || mongoose.model('Settings', settingSchema);

  const { fields } = collection;

  let newSchema = {};

  let uploadFields = [];

  const cpUpload = upload.fields(uploadFields)

  if (fields) {
    fields.forEach((field) => {
      

      // if (field?.default) {
      //   newSchema[field.name].default = null;
      // } else {
      //   if (field?.default != undefined){
      //     newSchema[field.name].default = field.default;
      //   }else {
      //     newSchema[field.name].default = null;
      //   }
          
      // }

      if(field?.default === null) {
        newSchema[field.name] = {
          type: fieldTypeTypes[field.type].type,
          default: null,
        }
      } else {
        if(field?.default === undefined){
          newSchema[field.name] = {
            type: fieldTypeTypes[field.type].type,
            default: null,
          }

        } else {
          newSchema[field.name] = {
            type: fieldTypeTypes[field.type].type,
            default: field?.default,
          }
        }
      }

      // if (field.required) {
      //   newSchema[field.name].required = field.required;
      // }
      
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

        if (field.type === 'images' || field.type === 'image'){
          const relationToSlug = slugify(field.relationTo);
         
          if(relationToSlug != 'undefined'){
            // console.log(relationToSlug, field.name)
            newSchema[field.name] = {
              type: Schema.ObjectId,
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
        } else {
          newSchema[field.name] = {
            type: fieldTypeTypes[field.type].type,
          };
        }          

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

  const schema = new mongoose.Schema(newSchema, options);
  schema.plugin(autopopulate);

  const modelName = collection.slug;

  // Verificar si el discriminador ya existe
  if (!mongoose.modelNames().includes(modelName)) {
    // Crear el discriminador si no existe
    const ClickedLinkEvent = SettingsModel.discriminator(modelName, schema);

    const existsDoc = await ClickedLinkEvent.findOne({settingType: collection.slug});

    if(existsDoc){
      let notExistsKeys = [];
      fields.forEach(field => {
        const key = field.name;
        const keyNotExistsInDoc = existsDoc[key] === undefined;

        if(keyNotExistsInDoc){
          console.log({key, value: existsDoc[key], keyNotExistsInDoc})
          console.log("NO existe")
          notExistsKeys.push(key)
        }
        
      });

      console.log({notExistsKeys})
      if(notExistsKeys.length > 0){
        notExistsKeys.forEach(key => {
          console.log({key})
          existsDoc[key] = null;
        })

        const updatedDoc = await ClickedLinkEvent.findOneAndUpdate({_id: existsDoc._id}, existsDoc, { new: true });

        if (!updatedDoc) {
          console.log({ error: "This document not exists" });
        }
      }
    }

    if (!existsDoc) {
      try {
        const newDoc = await new ClickedLinkEvent({ settingType: collection.slug });
        await newDoc.save();
      } catch (error) {
        console.error('Error al crear ' + collection.name);
  
        if (error.name === "ValidationError") {
          let errors = {};
    
          Object.keys(error.errors).forEach((key) => {
            errors[key] = error.errors[key].message;
          });
    
          console.log(errors);
        }
      
        // Puedes manejar el error de alguna manera, como enviar una respuesta de error al cliente o registrar el error.
      }
    }    
      
  } else {
    // El discriminador ya existe, puedes manejarlo de alguna manera, por ejemplo, lanzar un error o hacer alguna acción alternativa.
    console.error(`El discriminador "${modelName}" ya existe.`);
  }

  router.get(`/settings/${collection.slug}`, async (req, res) => {
    const {page, limit} = req.query;
    const skip = ((page || 1) - 1) * (limit || 10);
    const Model = mongoose.models[collection.slug];
  
    const documents = await Model.find();

    if(!documents) res.send({message: "No documents found"})
  
    res.send(documents[0])
  });

  router.patch(`/settings/${collection.slug}`, cpUpload, async (req, res) => {
    try {
      const { idOrSlug } = req.params;
      const { name, slug } = req.body;
      const files = req.files;
      let updateData = req.body;
      const Media = mongoose.models['media'];

      const query = {
        settingType: collection.slug,
      };
  
      if(slug === undefined){
        if(name) updateData.slug = slugify(name)
      } else {
        updateData.slug = slugify(slug)
      }

      if (files) {
        
        for (const key of Object.keys(files)) {
          const field = collection?.fields.find((field) =>
              field.type === 'images' || field.type === 'image' ? field.name === key : false
          );

          const fieldFiles = files[key];
  
          await Promise.all(
            fieldFiles.map(async (fieldFile) => {

              if(collection.slug === 'media'){
                const updateMediaData = {
                  file: fieldFile.filename,
                }

                const updatedMediaDoc = await Media.findOneAndUpdate(query, updateMediaData, { new: true });

                if (!updatedMediaDoc) {
                  return res.status(404).send({ error: "Error to update media" });
                }

                return updatedMediaDoc._id;
                
              } else {
                const newMediaData = {
                  file: fieldFile.filename,
                };

                const newMedia = new Media(newMediaData);
                await newMedia.save();
    
                return newMedia._id;
              }
  
              
            })
          ).then((mediaIdsArray) => {
            
  
            if (field) {
              const multiple = field?.multiple;
              
              if (multiple) {
                // Construir la actualización para hacer push de forma programática
                updateData.$push = { [key]: mediaIdsArray };
              } else {
                updateData[key] = mediaIdsArray[0];
              }
            }
          });
        }
      }

      Object.keys(updateData).forEach(key => {
        if(key.startsWith('removeFileIds_')){
          const fieldToPull = key.split('_')[1];
          const fileIdsToRemove = updateData[key].split(',');

          updateData[fieldToPull] = null;

        } else if( key.startsWith('multiple_removeFileIds_')){
          const fieldToPull = key.split('_')[2];
          const fileIdsToRemove = updateData[key].split(',');

          // console.log({fieldToPull})
          // console.log({fileIdsToRemove})
          updateData.$pull = { [fieldToPull]: { $in: fileIdsToRemove } };
        }
      });
      
      const Model = mongoose.models[collection.slug];
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
  
  
}

// helperImg("test-uploads/antifazbuhos.jpg", "test-uploads-croped/output.webp", 1280 )
// cropImages();
// changeDBFilesExtensions()

const helperImg = (filePath, fileName, size = 300) => {
  return sharp(filePath).metadata().then(metadata => {
    if (metadata.width && metadata.height) {
      const maxSize = Math.max(metadata.width, metadata.height);
      if (maxSize > size) {
        return sharp(filePath).resize({ width: size }).toFile(fileName);
      } else {
        return sharp(filePath).toFile(fileName);
      }
    } else {
      throw new Error('No se pudo obtener el tamaño de la imagen.');
    }
  });
}

function cropImages(sizeWidth = 1280){
  const directorio = './test-uploads-min';

  // Lees el contenido del directorio
  fs.readdir(directorio, (error, archivos) => {
    if (error) {
      console.error('Error al leer el directorio:', error);
      return;
    }

    // Imprimes los nombres de archivo
    console.log('Archivos en el directorio:');
    archivos.forEach(archivo => {
      console.log(archivo);
      helperImg("test-uploads-min/" + archivo, "uploads/thumbnail/" + archivo.replace(archivo.split('.')[1], 'webp'), sizeWidth )
    });
  });
}

// cropImages(300);

async function changeDBFilesExtensions(){
  const mediaArray = await mongoose.models['media'].find({});

  if(mediaArray){

    mediaArray.forEach(async (media) => {
      if (media.file && typeof media.file === 'string') {
        media.file = media.file.replace(/\.[^.]+$/, '.webp');
  
        try {
          await media.save();
          console.log(`Documento actualizado: ${media._id}`);
        } catch (saveErr) {
          console.error(`Error al guardar el documento ${media._id}:`, saveErr);
        }

      }
    });
  } else {
    console.log('No hay documentos en la colección media');
  }
}

async function remplazarFileTelaCojinSobrantes() {
  const Product = mongoose.models['products'];
  const products = await Product.find();

  for (const product of products) {
    for (let index = 0; index < product.images.length; index++) {
      const image = product.images[index];
      if (image.file.includes('coixiinterior')) {
        product.images[index] = '65aee0bcfc192154b8b5401d';
      }
    }

    try {
      await product.save();
      console.log(`Documento actualizado: ${product._id}`);
    } catch (saveErr) {
      console.error(`Error al guardar el documento ${product._id}:`, saveErr);
    }
  }
}

// remplazarFileTelaCojinSobrantes()


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

// Import external images
export async function importExternalImages() {
  const Product = mongoose.models['products'];
  const products = await Product.find();

  let counter = 0;
  // Iterar sobre los productos
  for (const product of products) {
      // Iterar sobre las URLs de las imágenes del producto
      let mediadDocIds = [];
      console.log(product)

      for (const fileUrl of product.images) {

          try {
              const notValid = fileUrl.startsWith('/');

              if(notValid) {
                console.log('not valid')
              }else {
                const fileName = fileUrl.split('/').pop();

                // Realizar una solicitud HTTP para obtener el contenido del archivo remoto
                const response = await fetch(fileUrl);

                if (!response.ok) {
                    throw new Error(`Error al obtener el contenido del archivo desde ${fileUrl}: ${response.statusText}`);
                }
                counter++;

                // console.log({counter, fileName, productName: product.name, productId: product._id})

                const fileBlob = await response.blob();                

                // Crear un objeto FormData para enviar el archivo al servidor
                const formData = new FormData();
                formData.append('file', fileBlob, fileName); // Ajusta el nombre del archivo según tus necesidades

                // Realizar una solicitud HTTP POST al endpoint de medios en tu servidor
                const uploadResponse = await fetch('http://localhost:3500/api/media', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    throw new Error(`Error al subir el archivo al servidor: ${uploadResponse.statusText}`);
                }

                console.log(`Archivo subido exitosamente a uploads/${fileName}`);
                const responseData = await uploadResponse.json();
                const mediaDoc = responseData.data;
                mediadDocIds.push(mediaDoc._id);

              }
              
          } catch (error) {
              console.error(error.message);
          }
      }

      // Update product.images
      console.log(mediadDocIds)
      const updatedProduct = await Product.findByIdAndUpdate(
        product._id, 
        { images: mediadDocIds },
        { new: true }
      );
      
      console.log({images: updatedProduct.images})
  }
}


