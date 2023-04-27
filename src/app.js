//Modules imports
import express, { response } from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import axios from 'axios';

//File imports
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';

const PORT = process.env.PORT || 8080;

const app = express();

const server = app.listen(PORT, ()=>{
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});

//Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

//Routes
app.use('/', viewsRouter);

const io = new Server(server);

app.locals.io = io;

io.on('connection', (socket) => {

    app.locals.socket = socket;

    console.log(`Socket connected`);

    socket.on('addproduct', async (data) => {

        await axios.post('http://localhost:8080/realtimeproducts', data)
        .then((response) => {

            const message = response.data.status

            io.emit('newmessage', message);

        })
        .catch((error) => {

            const message = error.response.data.message;

            io.emit('newmessage', message);

        });

    });

    socket.on('deleteproduct', async(pid) => {

        await axios.delete(`http://localhost:8080/realtimeproducts/${pid}`)
        .then((response) => {

            const message = response.data.status

            io.emit('newmessage', message);

        })
        .catch((error) => {

            const message = error.response.data.message;

            io.emit('newmessage', message);

        });

    });

    socket.on('updateproduct', async (data) => {

        await axios.put(`http://localhost:8080/realtimeproducts/${data.pid}`, data.product)
        .then((response) => {

            const message = response.data.status

            io.emit('newmessage', message);

        })
        .catch((error) => {

            const message = error.response.data.message;

            io.emit('newmessage', message);

        });

    });
});