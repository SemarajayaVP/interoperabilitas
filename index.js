"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("./src");
const koa_router_1 = __importDefault(require("koa-router"));
const koa_body_1 = __importDefault(require("koa-body"));
const router = new koa_router_1.default();
src_1.App.use((0, koa_body_1.default)());
src_1.App.use(router.routes());
console.log(`server listening on port 3000 on`);
src_1.App.listen(3000);
