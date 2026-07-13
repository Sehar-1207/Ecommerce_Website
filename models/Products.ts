import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  rating: number;
  stock: number;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, index: true }, 
  imageUrl: { type: String, required: true },
  rating: { type: Number, default: 5 },
  stock: { type: Number, default: 10 },
}, { timestamps: true });

export default models.Product || model<IProduct>('Product', ProductSchema);