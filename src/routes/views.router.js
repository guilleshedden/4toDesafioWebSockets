import { Router } from 'express';
import __dirname from '../utils.js';
import ProductManager from '../productmanager.js';

const PATH = __dirname + '/db/products.json';

const router = Router();

const productManager = new ProductManager(PATH);

router.get('/', async (request, response)=>{
    const limit = parseInt(request.query.limit);

    const respuesta = await productManager.getProducts(limit);

    response.render('home', {
        title: 'Lista de Productos',
        products: respuesta.message
    });
});

//Busca producto por ID interno
router.get('/realtimeproducts', async (request, response)=>{
    const limit = parseInt(request.query.limit);
    
    const respuesta = await productManager.getProducts(limit);

    response.render('realtimeproducts', {
        title: 'Realtime Products',
        products: respuesta.message
    });
});

router.post('/realtimeproducts', async (request, response)=>{
    const product = request.body;
    
    const respuesta = await productManager.addProduct(product);
    
    const io = request.app.locals.io;

    if (respuesta.code === 202){
        io.emit('dbupdated', respuesta.message);
    };

    response.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });
});

router.put('/realtimeproducts/:pid', async (request, response)=>{
    const pid = parseInt(request.params.pid);
    
    const product = request.body;

    const io = request.app.locals.io;

    const respuesta = await productManager.updateProduct(pid, product);

    if (respuesta.code === 202){
        io.emit('dbupdated', respuesta.message);
    };
    
    response.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });
});

router.delete('/realtimeproducts/:pid', async (request, response)=>{
    const pid = parseInt(request.params.pid);

    const respuesta = await productManager.deleteProduct(pid);

    const io = request.app.locals.io;

    if (respuesta.code === 202){
        io.emit('dbupdated', respuesta.message);
    };

    response.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });
});

export default router;