import express, { json } from "express";
import http from "http"
import reload from "reload";

import bodyParser from "body-parser";
import mongoose from "mongoose";

import { handler as ssrHandler } from "./dist/server/entry.mjs";
import { formatOrderNumber } from "./utils.js";
import { Collections, createCollectionEndpoints, createSettingEndpoints, Settings } from "./lexgi.mjs"

import cors from "cors";
import colors from "colors";
import 'dotenv/config';
import { sendOrderEmail } from "./email-service.js";
import Stripe from "stripe";
import errorHandlerMiddleware from "./middleware/handleErrors.js";

// This is your test secret API key.
const stripe = new Stripe(process.env.STRIPE_SK);

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

Object.values(Settings).forEach((collection) => {
  createSettingEndpoints(collection, collectionRouter);
});

const OrderModel = mongoose.models['orders'];
console.log(OrderModel)

// Stripe
app.post("/api/create-confirm-intent", async (req, res) => {
  const {
    user,
    paymentMethodId,
    items,
    email,
    customerName,
    guestCustomerId,
    address,
    shippingCost,
    shippingType,
    subtotal,
    total
  } = req.body;
  // console.log({ paymentMethodId, items, email, address })

  try {
    const intent = await stripe.paymentIntents.create({
      confirm: true,
      amount: total*100,
      currency: "eur",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
      payment_method: paymentMethodId, // the PaymentMethod ID sent by your client
      return_url: "https://example.com/order/123/complete",
      use_stripe_sdk: true,
      mandate_data: {
        customer_acceptance: {
          type: "online",
          online: {
            ip_address: req.ip,
            user_agent: req.get("user-agent"),
          },
        },
      },
    });

    const { status } = intent;

    if (status === "succeeded") {
      const ordersCount = await OrderModel.find().count({});
      console.log(formatOrderNumber(ordersCount + 1, 6))
      // create order
      const newOrderData = {
        user: user || null,
        guestCustomerId,
        orderNumber: formatOrderNumber(ordersCount + 1, 6),
        items,
        email,
        customerName,
        billingAddress: address,
        shippingAddress: address,
        paymentMethod: "stripe",
        shippingCost,
        shippingType,
        subtotal,
        total
      };

      try {
        const order = await createOrder(newOrderData);

        res.json({
          order,
          client_secret: intent.client_secret,
          status: intent.status,
        });
      } catch (error) {
        console.log(error)

        newOrderData.orderNumber = formatOrderNumber(ordersCount + 2, 6);      
        const order = await createOrder(newOrderData);

        res.json({
          order,
          client_secret: intent.client_secret,
          status: intent.status,
        });
      }

    } else {
      res.status(500).send({status: 'error'})
    }

    
  } catch (err) {
    console.log(err)
    res.json({
      error: err,
    });
  }
});

app.use(API_PREFIX, collectionRouter);

const server = http.createServer(app)

// Dejar el middleware de manejo de errores al final de todas las rutas.
app.use(errorHandlerMiddleware);


async function createOrder(order) {
  const newOrder = new OrderModel(order);
  await newOrder.save();

  const emailOptions = {
    fromName: "🌍 Elmundo del saquito", // sender address
    fromEmail: "ventas@elmundodelsaquito.es",
    to: "alexgp895@gmail.com",
  }
  sendOrderEmail(newOrder, emailOptions)

  return newOrder;
}

async function main() {
  await mongoose.connect(process.env.DATABASE_URI);
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

    const port = process.env.PORT || 3500;
  
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


