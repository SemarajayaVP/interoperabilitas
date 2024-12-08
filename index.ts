import { App } from './src';
import Router from 'koa-router';
import koaBody from 'koa-body';

const router = new Router();


App.use(koaBody());
App.use(router.routes());
console.log(`server listening on port 3000 on`);
App.listen(3000);

