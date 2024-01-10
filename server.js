import express, { json } from "express";
import http from "http"
import path from "path"
import reload from "reload";

import bodyParser from "body-parser";
import mongoose from "mongoose";
import multer from "multer";

import { handler as ssrHandler } from "./dist/server/entry.mjs";
import { createSlug, slugify } from "./utils.js";
import { Collections, createCollectionEndpoints, LEXI_CONFIG } from "./lexgi.mjs"
// import type { Collection } from "./src/types";
import cors from "cors";
import colors from "colors";

const app = express();
app.use(cors());
app.use(json());
app.use(bodyParser.urlencoded({ extended: false }));
const base = "/";
const API_PREFIX = "/api";

app.use(base, express.static("dist/client/"));

app.use(base + 'uploads' + '/', express.static("uploads/"));

app.use((req, res, next) => {
  ssrHandler(req, res, next);
});

const collectionRouter = express.Router();

Object.values(Collections).forEach((collection) => {
  createCollectionEndpoints(collection, collectionRouter);
});

app.use(API_PREFIX, collectionRouter);

const server = http.createServer(app)

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test-elmundo");
}

main()
  .then(() => {
    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);

    console.log('')
    console.log(' Lexgi CMS '.inverse.green + ' v1.0.0'.green + ' is ready'.gray);

    console.log(`${formattedDate}`.gray + ` INFO`.green + ' (Lexgi CMS): '.white + 'Connected to MongoDB server successfully!'.blue);
    console.log(`${formattedDate}`.gray + ` INFO`.green + ' (Lexgi CMS): '.white + 'Starting Lexgi CMS...'.blue);

    const port = LEXI_CONFIG.port || 3400;
  
    reload(app).then(function (reloadReturned) {
      
      server.listen(port, () => {
        
        console.log(`${formattedDate}`.gray + ` INFO`.green + ' (Lexgi CMS): '.white + `URL:`.blue + ` http://localhost:${port}`.magenta);
        console.log(`${formattedDate}`.gray + ` watching for file changes...`.green);

      });
    }).catch(function (err) {
      console.error('Reload could not start, could not start server/sample app', err)
    })
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.message);
  });


