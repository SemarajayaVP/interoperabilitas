import router from './router';
import Koa from 'koa';
import mongoose from 'mongoose';
import bodyParser from 'koa-body';

import { MONGO_DEBUG, MONGODB_URL } from './config';
import { Mongoose } from 'mongoose';

const app = new Koa();
let conn: Mongoose;

app.use(async (ctx, next) => {
  if (conn === undefined) conn = await mongoose.connect(MONGODB_URL);
  mongoose.set('debug', MONGO_DEBUG);
  await next();
});
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
export const App = app;
