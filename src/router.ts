import Router from 'koa-router';
import { createCategory, updateCategory, deleteCategory, getCategory, getCategoryById } from './controllers/category';
import { getAllOrders, getOrderById } from './controllers/order';
const router = new Router();


// category
router.post('/api/v1/cms/categories', createCategory);
router.put('/api/v1/cms/categories/:id', updateCategory);
router.get('/api/v1/cms/categories', getCategory);
router.put('/api/v1/cms/categories/delete/:id', deleteCategory);
router.get('/api/v1/cms/categories/:id', getCategoryById);

// order
router.get('/api/v1/cms/get', getAllOrders);
router.get('/api/v1/cms/get/:id', getOrderById);
export = router;

