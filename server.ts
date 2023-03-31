import express, {Express} from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import bcrypt from 'bcryptjs';

// imported models
import { InventoryModel } from "./models/inventory";
import { UserModel } from "./models/user";

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

// AUTH Endpoints
app.post("/user/register", async (req, res) => {
    
    try{
        let {username, password} = req.body

        // hash password
        password = await bcrypt.hash(password, 10)

        // create user
        const user = await UserModel.create({username, password})

        res.json(user);
    } catch(error){
        res.status(400).json({error});
    }

})

app.post("/user/login", async (req, res) => {
    try{
        // getting variables
        const {username, password} = req.body

        // checking if user exists
        const user = await UserModel.findOne({username: username})

        if(user){ // if the user exists
            //check if the password matches
            const result = await bcrypt.compare(password, user.password!)

            if (result){ //if the password matches
                // OPTION: JWT Token
                res.json({success: true})
            } else { // if password doesn't match
                res.status(400).json({error: "Invalid Password"});
            }
        } else {
            res.status(400).json({error: "User does not exist"});
        }

    } catch(error){
        res.status(400).json({error});
    }
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