import express, {Express} from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import bcrypt from 'bcryptjs';

// imported models
import { InventoryModel } from "./models/inventory";
import { UserModel } from "./models/user";
import { RecipeModel } from "./models/recipes";

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

// just to add to db
// Create inventory item
// app.post("/inventory", async (req, res) => {
//     const { image, name, category, quantity } = req.body;
//     const inventory = await InventoryModel.create({ image, name, category, quantity });
//     res.send(inventory);
// })

// Read inventory
app.get("/inventory", async (req, res) => {
    const inventory = await InventoryModel.find({});
    res.send(inventory);
})

// Update inventory by id
app.put("/inventory/:id", async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    const inventory = await InventoryModel.findByIdAndUpdate(id, { quantity }, {new: true});
    res.send(inventory);
})

// Recipe data handling
// TODO: Comment out, just needed to create db
// app.post('/recipe/create', async (req, res) => {
//     const recipeData= [
//         {
//             name: "Fortune Tonic",
//             image: "assets/wealth.png",
//             description: "The Potion of Prosperity is a valuable alchemical creation that is sought after by many aspiring adventurers and merchants. This potion is known to bring good luck and financial gain to those who consume it.",
//             amount: 0,
//             ingredients: [
//                 {inventoryId: "6432a058e916419be87e6f69", amountNeeded: 2},
//                 {inventoryId: "6432a2efe916419be87e6f85", amountNeeded: 3},
//                 {inventoryId: "64329d89e916419be87e6f46", amountNeeded: 1},
//                 {inventoryId: "6432a0b0e916419be87e6f6f", amountNeeded: 1},
//                 {inventoryId: "6432a12ae916419be87e6f76", amountNeeded: 1},
//                 {inventoryId: "64329fa6e916419be87e6f60", amountNeeded: 2}
//             ]
//         },
//         {
//             name: "Cupid's Cocktail",
//             image: "assets/love.png",
//             description: "The Potion of Love is a powerful and sought-after elixir that is rumored to make anyone who drinks it fall deeply in love with the first person they see.",
//             amount: 0,
//             ingredients: [
//                 {inventoryId: "6432a074e916419be87e6f6b", amountNeeded: 1},
//                 {inventoryId: "6432a2efe916419be87e6f85", amountNeeded: 1},
//                 {inventoryId: "6432a12ae916419be87e6f76", amountNeeded: 1},
//                 {inventoryId: "6432a058e916419be87e6f69", amountNeeded: 1},
//                 {inventoryId: "6432cfc7aadf367c9b19d83f", amountNeeded: 5},
//                 {inventoryId: "64329fa6e916419be87e6f60", amountNeeded: 2}
//             ]
//         },
//         {
//             name: "Regeneration Brew",
//             image: "assets/healing.png",
//             description: "The Potion of Healing is a vital elixir for any adventurer or warrior who wishes to stay in peak physical condition. This potion is designed to quickly heal any injuries or ailments that the drinker may have sustained during their journeys.",
//             amount: 0,
//             ingredients: [
//                 {inventoryId: "6432a074e916419be87e6f6b", amountNeeded: 2},
//                 {inventoryId: "6432a0c8e916419be87e6f71", amountNeeded: 3},
//                 {inventoryId: "64329d89e916419be87e6f46", amountNeeded: 1},
//                 {inventoryId: "6432a0b0e916419be87e6f6f", amountNeeded: 1},
//                 {inventoryId: "6432d1b2aadf367c9b19d843", amountNeeded: 3},
//                 {inventoryId: "64329fa6e916419be87e6f60", amountNeeded: 1}
//             ]
//         },
//         {
//             name: "The Reaper",
//             image: "assets/death.png",
//             description: "The Potion of Death is a dangerous and most likely lethal elixir that can be used to harm or incapacitate enemies. The poison is made from a potent mixture of poisonous ingredients that can cause severe damage/death to an enemy.",
//             amount: 0,
//             ingredients: [
//                 {inventoryId: "6432a074e916419be87e6f6b", amountNeeded: 1},
//                 {inventoryId: "6432a0b0e916419be87e6f6f", amountNeeded: 3},
//                 {inventoryId: "64329fa6e916419be87e6f60", amountNeeded: 1},
//                 {inventoryId: "6432d32caadf367c9b19d847", amountNeeded: 2},
//                 {inventoryId: "6432a12ae916419be87e6f76", amountNeeded: 1},
//                 {inventoryId: "6432d4dbaadf367c9b19d849", amountNeeded: 5}
//             ]
//         },
//         {
//             name: "Forget Me Now",
//             image: "assets/forgetful.png",
//             description: "The Potion of Forgetfulness is a mysterious elixir that can be used to cause temporary amnesia in the drinker. The potion can be made using a combination of rare and hard-to-find ingredients, and its effects can vary depending on the strength of the potion and the susceptibility of the drinker.",
//             amount: 0,
//             ingredients: [
//                 {inventoryId: "64329fe0e916419be87e6f63", amountNeeded: 1},
//                 {inventoryId: "6432a0a0e916419be87e6f6d", amountNeeded: 1},
//                 {inventoryId: "6432a0c8e916419be87e6f71", amountNeeded: 1},
//                 {inventoryId: "6432a145e916419be87e6f78", amountNeeded: 4},
//                 {inventoryId: "6432a220e916419be87e6f82", amountNeeded: 1},
//                 {inventoryId: "64329fa6e916419be87e6f60", amountNeeded: 2}
//             ]
//         },
//         {
//             name: "Godly Grog",
//             image: "assets/power.png",
//             description: "The Potion of Power is a potent elixir that can grant the drinker great strength and abilities. The potion is made using rare and exotic ingredients that can enhance the body's natural abilities and unlock hidden potential.",
//             amount: 0,
//             ingredients: [
//                 {inventoryId: "64329fe0e916419be87e6f63", amountNeeded: 3},
//                 {inventoryId: "6432a058e916419be87e6f69", amountNeeded: 5},
//                 {inventoryId: "6432a074e916419be87e6f6b", amountNeeded: 5},
//                 {inventoryId: "6432a0dfe916419be87e6f73", amountNeeded: 2},
//                 {inventoryId: "6432d1b2aadf367c9b19d843", amountNeeded: 5},
//                 {inventoryId: "6432d32caadf367c9b19d847", amountNeeded: 2}
//             ]
//         },
//         {
//             name: "Illusion Infusion",
//             image: "assets/delusion.png",
//             description: "The Potion of Delusion is a dangerous elixir that can cause the drinker to become delusional and lose touch with reality. The potion is made using toxic and unstable ingredients that can alter the drinker's perceptions and cause them to experience hallucinations.",
//             amount: 0,
//             ingredients: [
//                 {inventoryId: "6432a017e916419be87e6f66", amountNeeded: 2},
//                 {inventoryId: "6432a0a0e916419be87e6f6d", amountNeeded: 3},
//                 {inventoryId: "6432a0c8e916419be87e6f71", amountNeeded: 10},
//                 {inventoryId: "6432a1e2e916419be87e6f7f", amountNeeded: 1},
//                 {inventoryId: "6432d1b2aadf367c9b19d843", amountNeeded: 1},
//                 {inventoryId: "6432d4dbaadf367c9b19d849", amountNeeded: 2}
//             ]
//         },
//         {
//             name: "Aged Ale",
//             image: "assets/age.png",
//             description: "The Potion of Aging is a mysterious elixir that can cause the drinker to age rapidly and experience the effects of old age. The potion is made using rare and exotic ingredients that can accelerate the aging process and cause the body to deteriorate.",
//             amount: 0,
//             ingredients: [
//                 {inventoryId: "64329fa6e916419be87e6f60", amountNeeded: 2},
//                 {inventoryId: "6432a017e916419be87e6f66", amountNeeded: 3},
//                 {inventoryId: "6432a058e916419be87e6f69", amountNeeded: 1},
//                 {inventoryId: "6432a074e916419be87e6f6b", amountNeeded: 1},
//                 {inventoryId: "6432d1b2aadf367c9b19d843", amountNeeded: 1},
//                 {inventoryId: "6432a220e916419be87e6f82", amountNeeded: 2}
//             ]
//         },
//         {
//             name: "Turbo Tonic",
//             image: "assets/speed.png",
//             description: "The Potion of Swiftness is a magical elixir that grants the drinker superhuman speed and agility. The potion can enhance the drinker's physical abilities and allow them to move at incredible speeds.",
//             amount: 0,
//             ingredients: [
//                 {inventoryId: "6432a074e916419be87e6f6b", amountNeeded: 1},
//                 {inventoryId: "6432a0a0e916419be87e6f6d", amountNeeded: 3},
//                 {inventoryId: "6432a0dfe916419be87e6f73", amountNeeded: 2},
//                 {inventoryId: "6432a12ae916419be87e6f76", amountNeeded: 1},
//                 {inventoryId: "6432a1e2e916419be87e6f7f", amountNeeded: 2},
//                 {inventoryId: "6432a220e916419be87e6f82", amountNeeded: 2}
//             ]
//         },
//         {
//             name: "Potion of Desire",
//             image: "assets/wish.png",
//             description: "The Potion of Desire is a rare and powerful elixir that can grant the drinker any one wish of their choosing. The potion can tap into the user's deepest desires and manifest them into reality. The drinker cannot wish for more wishes.",
//             amount: 0,
//             ingredients: [
//                 {inventoryId: "64329d89e916419be87e6f46", amountNeeded: 3},
//                 {inventoryId: "64329fa6e916419be87e6f60", amountNeeded: 1},
//                 {inventoryId: "64329fe0e916419be87e6f63", amountNeeded: 3},
//                 {inventoryId: "6432a12ae916419be87e6f76", amountNeeded: 2},
//                 {inventoryId: "6432a2efe916419be87e6f85", amountNeeded: 3},
//                 {inventoryId: "6432a058e916419be87e6f69", amountNeeded: 5}
//             ]
//         }
//     ]

//     for (const recipe of recipeData){
//         await RecipeModel.create(recipe);
//     }

//     res.send({success: true})
// })

// GET recipes
app.get('/recipes', async (req, res) => {

    try{
        const recipes = await RecipeModel.find().populate('ingredients.inventoryId').exec()

        // check if there are enough items to craft this recipe 01:17:19 on video
        const recipesWithAvailability = await Promise.all(
            recipes.map(async (recipe) => {
                // loop though each recipe
                const ingredients = recipe.ingredients;
                let craftable = true;
    
                // loop though each ingridient and see if there are enough inventory
                for(const ingredient of ingredients!){
                    // get inventory data for each ingridient
                    const inventory = await InventoryModel.findById(ingredient.inventoryId).exec();
                    // get amount available from inventory
                    const amount = inventory!.quantity
    
                    // check if there is not enough
                    if(!amount || amount < ingredient.amountNeeded!){
                        craftable = false;
                        break;
                    }
                }
                // return the recipe with the craftable property
                return {...recipe.toObject(), craftable};
            })
        )
        res.send(recipesWithAvailability);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"})
    }
})

// endpoint to craft recipe
app.post('/recipes/craft', async (req, res) => {

    try{
        const { recipeId } = req.body;

        const recipe = await RecipeModel.findById(recipeId).exec();

        if(recipe){
            // incrementing the recipe/potion amount
            recipe!.amount!++
            recipe!.save()

            // updating inventory amount
            const ingredients = recipe.ingredients!
            for(const ingredient of ingredients){
                const inventoryId = ingredient.inventoryId;
                const inventory = await InventoryModel.findById(inventoryId).exec();

                if(inventory){
                    inventory.quantity! -= ingredient.amountNeeded!
                    await inventory.save()
                }
            }
        }

        res.send({success: true})
    } catch(err) {
        console.log(err)
        res.status(500).send({error: err})
    }
})

// listner for the port
app.listen(port, () => {
    console.log('Server running at http://localhost:' + port)
})