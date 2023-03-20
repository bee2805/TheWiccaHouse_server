import express, {Express} from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';

// imported models
import { InventoryModel } from "./models/inventory";

// NOTES: 
// - Nodemon re-runs server as it detects changes

dotenv.config();

const app: Express = express();

// middleware
app.use(cors()); // avoid cors error
app.use(express.json()); // get params from body

// declaring variables
const port = process.env.PORT || 3000;
const clusterUrl = process.env.CLUSTER;

// establish mongo db connection
mongoose.set('strictQuery', false);

mongoose.connect(clusterUrl!).then(() => {
    console.log("MongoDB Connected Successfully")
}).catch((error) => {
    console.log(error.message);
})

// endpoints
app.get("/", (req, res) => {
    res.send("working server");
})

// Inventory CRUD operations
// TODO: Change responses!
// Create
app.post("/inventory", async (req, res) => {
    const { image, name, category, quantity } = req.body;
    const inventory = await InventoryModel.create({ image, name, category, quantity });
    res.send(inventory);
})

// Read
app.get("/inventory", async (req, res) => {
    const inventory = await InventoryModel.find({});
    res.send(inventory);
})

// Update
app.put("/inventory/:id", async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    const inventory = await InventoryModel.findByIdAndUpdate(id, { quantity }, {new: true});
    res.send(inventory);
})

// Delete
app.delete("/inventory/:id", async (req, res) => {
    const { id } = req.params;

    const inventory = await InventoryModel.findByIdAndDelete(id);
    res.send(inventory);
})

// TODO: Recipe CRUD operations

// listner for the port
app.listen(port, () => {
    console.log('Server running at http://localhost:' + port)
})