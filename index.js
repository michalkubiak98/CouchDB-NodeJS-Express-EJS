const express = require('express');  
const path = require('path');  
const NodeCouchdb = require('node-couchdb');  

const dbName = 'customers';
const couch = new NodeCouchdb({
    auth: {
        user: 'admin',
        password: 'root'
    }
});

const getCustomersUrl = '_design/all_customers/_view/get_all_customers';
const countPetsUrl = '_design/all_customers/_view/count_pets';

const app = express();  

app.set('view engine', 'ejs');  
app.set('views', path.join(__dirname, 'views'));  

app.use(express.static('./public'));
app.use (express.json());  
app.use(express.urlencoded({extended: false}));  

// Home
app.get('/', (req,res) => {  
    couch.get(dbName, countPetsUrl).then(({data, headers, status}) => {
        //const pets = data.rows[0]
        //const newPets = pets.reduce((a, b) => a + b, 0)
        res.render('pages/home', {
            // Get the total number of dogs and cats and add them
            pets: data.rows[0]
        });       
    }, err => {
        res.send(err);
    });
}); 

// Customers
app.get('/customers', (req,res) => {  
    couch.get(dbName, getCustomersUrl).then(({data, headers, status}) => {
        res.render('pages/customers', {
            customers:data.rows
        });
    }, err => {
        res.send(err);
    });
});  

app.post('/customer/add', (req,res) => {  
    const name = req.body.name;
    const email = req.body.email;
    const cats = req.body.cats;
    const dogs = req.body.dogs;

    couch.uniqid().then(function(ids){
        const id = ids[0];

        couch.insert(dbName, {
            _id: id,
            name: name,
            email: email,
            cats: parseInt(cats),
            dogs:parseInt(dogs)
        })
        .then(({data, headers, status}) => {
            res.redirect('/customers')
        }, err => {
            res.send(err);
        });
    });   
});


app.post('/customer/edit/:id', (req,res) =>{  
    const name = req.body.name;
    const email = req.body.email;
    const cats = req.body.cats;
    const dogs = req.body.dogs;
    const id = req.params.id;
    const rev = req.body.rev;

    couch.update(dbName, {
        _id: id,
        _rev: rev,
        name: name,
        email: email,
        cats: parseInt(cats),
        dogs:parseInt(dogs)
    })
    .then(({data, headers, status}) => {
        res.redirect('/customers')
    }, err => {
        res.send(err);
    });
});

app.post('/customer/delete/:id', (req, res) => {
    const id = req.params.id;
    const rev = req.body.rev;

    couch.del(dbName, id, rev).then(({data, headers, status}) => {
        res.redirect('/customers')
    }, err => {
        res.send(err);
    });

});

app.listen(3000, () => {  
 console.log('Server started on 3000 Port');  
});

