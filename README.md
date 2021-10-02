# CouchDB-NodeJS-Express-EJS
A simple web app using nodejs and express, composed of a template view engine called EJS and bootstrap. The app is connected to CouchDB, having CRUD operations and views for querying the DB. It was made for a 4th year college module called Advanced Databases.

To run the app download or clone the repo and npm install, create a couch db account with the username 'admin' and password 'root'

For the application and queries to work correctly, the database needs to have these properties:

----

Create a database called Customers'

The design document is called 'all_customers'

----

The first view is called 'count_pets'

It has the following map function:

  function(doc) {
  emit(doc._id, [doc.cats, doc.dogs]);
}

It has a reduce of _sum

----

The second view is called 'get_all_customers'

It has the following map function:

function (doc) {
  emit(doc._id, {
    name:doc.name, email:doc.email, cats:doc.cats, dogs:doc.dogs, rev:doc._rev
  });
}

It has a reduce of NONE (no reduce option in the view)

