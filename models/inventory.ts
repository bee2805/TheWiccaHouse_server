import { prop, getModelForClass } from "@typegoose/typegoose";

// model class
class Inventory{
    @prop({ required: true})
    public image?: String;

    @prop({ required: true})
    public name?: String;

    @prop({ required: true})
    public category?: String;

    @prop({ required: true})
    public quantity?: number;
}

// Get models from the schema
export const InventoryModel = getModelForClass(Inventory);