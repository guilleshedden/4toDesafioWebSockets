const socket = io();

const productsContainer = document.getElementById('products-container');
const add = document.getElementById('add');
const update = document.getElementById('update');
const del = document.getElementById('del');
const id = document.getElementById('id');
const title = document.getElementById('title');
const description = document.getElementById('description');
const code = document.getElementById('code');
const price = document.getElementById('price');
const stock = document.getElementById('stock');
const category = document.getElementById('category');
const messages = document.getElementById('messages');


add.addEventListener('click',() => {

    const product = {
        'title': title.value,
        'description': description.value,
        'code': code.value,
        'price': price.value,
        'status': true,
        'stock': stock.value,
        'category': category.value
    };

    socket.emit('addproduct', product);

});

update.addEventListener('click', () => {

    const product = {
        'title': title.value,
        'description': description.value,
        'code': code.value,
        'price': price.value,
        'status': true,
        'stock': stock.value,
        'category': category.value
    };

    const pid = id.value;

    const data = {
        product,
        pid
    }

    socket.emit('updateproduct', data);

});

del.addEventListener('click', () => {

    socket.emit('deleteproduct', id.value);

});

socket.on('newmessage', (message) => {
    console.log(message);
    messages.textContent = message;
});

socket.on('dbupdated', (products) => {

    productsContainer.replaceChildren();
    
    products.forEach(product => {
        const productContainer = document.createElement('div');
        const p1 = document.createElement('p');
        const p2 = document.createElement('p');
        const p3 = document.createElement('p');
        const p4 = document.createElement('p');
        const p5 = document.createElement('p');
    
        productContainer.className = 'product-container';
        p1.className = 'product-title';
        p2.className = 'product-data';
        p3.className = 'product-data';
        p4.className = 'product-data';
        p5.className = 'product-data';
    
        p1.textContent = product.title;
        p2.textContent = `ID: ${product.id}`;
        p3.textContent = `Code: ${product.code}`;
        p4.textContent = `Price: ${product.price}`;
        p5.textContent = `Stock: ${product.stock}`;
    
        productContainer.appendChild(p1);
        productContainer.appendChild(p2);
        productContainer.appendChild(p3);
        productContainer.appendChild(p4);
        productContainer.appendChild(p5);
        
        productsContainer.appendChild(productContainer);
    });
});