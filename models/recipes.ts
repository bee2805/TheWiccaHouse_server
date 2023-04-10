import { prop, getModelForClass } from "@typegoose/typegoose";
import { Ingredient } from "./ingredient";

export class Recipe {
    @prop({ required: true})
    public image?: String;

    @prop({ required: true})
    public name?: String;

    @prop({ required: true})
    public description?: String;

    @prop({ required: true})
    public amount?: number;

    //  array of ingridients needed from the inventory
    @prop({type: () => [Ingredient], required: true})
    public ingredients?: Ingredient[]
}

export const RecipeModel = getModelForClass(Recipe);