import { Ref, prop } from "@typegoose/typegoose";
import { Inventory } from "./inventory";

export class Ingredient {
    @prop({ref: Inventory, required: true})
    public inventoryId?: Ref<Inventory> // references inventory data by id

    @prop({required: true})
    public amountNeeded?: number
}