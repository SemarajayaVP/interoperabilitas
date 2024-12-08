import mongoose, { Document, Schema, Types, Model, model } from 'mongoose';

export interface IOrderDetail extends Document {
  ticketCategories: {
    type: string;
    price: number;
  };
  sumTicket: number;
}

export interface IOrder extends Document {
  date: Date;
  personaDetail: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  status: string;
  totalPay: number;
  totalOrderTicket: number;
  orderItems: [IOrderDetail];
  participant: mongoose.Types.ObjectId;
  payment: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  historyEvent: {
    title: string;
    date: Date;
    about: string;
    tagline: string;
    keyPoint: [string];
    venueName: string;
    image: mongoose.Types.ObjectId;
    category: mongoose.Types.ObjectId;
    talent: mongoose.Types.ObjectId;
    organizer: mongoose.Types.ObjectId;
  };
}

export const orderDetailSchema = new Schema({
  ticketCategories: {
    type: {
      type: String,
      required: [true, 'Tipe tiket harus diisi'],
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  sumTicket: {
    type: Number,
    required: true,
  },
});

export const orderSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    personalDetail: {
      firstName: {
        type: String,
        required: [true, 'Please provide firstName'],
        minlength: 3,
        maxlength: 50,
      },
      lastName: {
        type: String,
        required: [true, 'Please provide lastName'],
        minlength: 3,
        maxlength: 50,
      },
      email: {
        type: String,
        required: [true, 'Please provide email'],
      },
      role: {
        type: String,
        default: 'Designer',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    totalPay: {
      type: Number,
      required: true,
    },
    totalOrderTicket: {
      type: Number,
      required: true,
    },
    orderItems: [orderDetailSchema],
    participant: {
      type: mongoose.Types.ObjectId,
      ref: 'participant',
      required: true,
    },
    payment: {
      type: mongoose.Types.ObjectId,
      ref: 'payment',
      required: true,
    },
    event: {
      type: mongoose.Types.ObjectId,
      ref: 'events',
      required: true,
    },

    historyEvent: {
      title: {
        type: String,
        required: [true, 'Judul harus diisi'],
        minlength: 3,
        maxlength: 50,
      },
      date: {
        type: Date,
        required: [true, 'Tanggal dan waktu harus diisi'],
      },
      about: {
        type: String,
      },
      tagline: {
        type: String,
        required: [true, 'Tagline harus diisi'],
      },
      keyPoint: {
        type: [String],
      },
      venueName: {
        type: String,
        required: [true, 'Tempat acara harus diisi'],
      },

      image: {
        type: mongoose.Types.ObjectId,
        ref: 'images',
        required: true,
      },
      category: {
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: true,
      },
      talent: {
        type: mongoose.Types.ObjectId,
        ref: 'talents',
        required: true,
      },
      organizer: {
        type: mongoose.Types.ObjectId,
        ref: 'organizer',
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ _id: 1 });
orderDetailSchema.index({ _id: 1 });

export const OrderModel: Model<IOrder> = model<IOrder>('orders', orderSchema, 'orders');



