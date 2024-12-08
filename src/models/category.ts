import mongoose, { Document, Schema, Types, Model, model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  organizer?: Types.ObjectId;
  isDeleted: boolean;
}

export const categorySchema = new Schema(
  {
    name: {
      type: String,
      minLength: [3, 'Panjang nama kategori minimal 3 karakter'],
      maxLength: [20, 'Panjang nama kategori maksimal 20 karakter'],
      required: [true, 'Nama kategori harus diisi'],
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'organizers',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ _id: 1 });

export const CategoryModel: Model<ICategory> = model<ICategory>('category', categorySchema, 'category');
