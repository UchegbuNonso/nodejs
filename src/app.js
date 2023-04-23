// console.log('Hello');
// const {v4: uuidv4} = require('uuid');
// import { v4 as uuidv4 } from "uuid";  /*as seen in React */

// (once done, you have to add a type property  after the name and give it a value of module in package.json  
// use toptal node.js gitignore(browse it) to get list of git ignore files
// console.log(uuidv4())

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Customer = require('./models/customer')
const app = express();

// =========ENV config===========
// dotenv.config();



mongoose.set('strictQuery', false)
app.use(express.json());
app.use(express.urlencoded({extended: true}));

if(process.env.NODE_ENV !== 'production'){
     dotenv.config()
    //  require('dotenv').config()
}
  

const PORT = process.env.PORT || 3000
const CONNECTION = process.env.MONGO_URI



// const json = {
//     "name": "Sammy",
//     "industry": "Tech",
//     "favoriteColors": [
//         "red", "blue","indigo"
//     ],
//      "favoriteNumbers":[
//         3,4,7
//      ],
//      "favoritePeople":[
//         {
//             "name": "Christian",
//             "relationship": "Brother"
//         },
//         {
//             name: "Dad",
//             "relationship": "Parent"
//         }
//      ]
// }
const customers =[
     {
        "name": "Sammy",
        "industry": "Tech"
     },
     {
        "name": "Greg",
        "industry": "Music"
     },
     {
        "name": "Kate",
        "industry": "Fashion"
     },
     {
        "name": "Emmy",
        "industry": "Comedy"
     },
     {
        "name": "John",
        "industry": "Designer"
     }
];
// ======To move a dir or folder use mv name of dir and new dir/the dir e.g mv models src/models

const customer = new Customer({
   name: 'Greg',
   industry: 'Medicine'
})
// ========Home Page=============
app.get('/',(req,res)=>{
   res.send('<h1>Welcome to our page</h1>')
   // res.send(customer);
})
// customer.save();
app.get('/api/customers', async (req,res)=>{
   // console.log( await mongoose.connection.db.listCollections().toArray());
   try {
      const result = await Customer.find()
      //    res.send('<h1>Welcome!!!</h1>')
      //    res.send({"data": json.favoritePeople})
         // res.send({"Customers": customers})
         // res.send({"Customers": result})
         res.json({"Customers": result})
   } catch (e) {
      res.status(500).json({error: e.message})
   }
  
});

// =========To pass in ID=====================
app.get('/api/customers/:id',async (req,res)=>{
   console.log({ 
      requestParams: req.params,
      requestQuery: req.query
   
   }) 
   // const customerId = req.params.id;
   // ========Destructuring can be used instead=========
   try {
      const {id: customerId} = req.params;
      console.log(customerId); 
      const customer = await Customer.findById(customerId);
      console.log(customer);  
      if(!customer){
          res.status(404).json({error: 'User not found'})  
      }else{
         res.json({customer: customer})
      }
      
   } catch (err) {
      res.status(500).json({error: 'Something went wrong'})
   }
   
});
// =========UPDATE A CUSTOMER===========
app.put('/api/customers/:id', async(req,res)=>{
   try {
      const { id: customerId } = req.params;
      const result = await Customer.replaceOne({_id: customerId}, req.body);
      console.log(result);
      res.json({updatedCount: result.modifiedCount})
   } catch (err) {
      res.status(500).json({error: 'Something went wrong'});
   }
    

});
app.delete('/api/customers/:id', async(req,res)=>{
   try {
      const customerId = req.params.id
      const result = await Customer.deleteOne({_id: customerId});
      res.json({deletedCount: result.deletedCount})
   } catch (err) {
      res.status(500).json({error: 'Something went wrong'})
   }
   
})

app.post('/api/customers', async (req,res)=>{
   console.log(req.body);
   // res.send(req.body)
   // const customer = new Customer({
   //    name: req.body.name,
   //    industry: req.body.industry,
   //    age: req.body.age,
   //    status: req.body.status
   // })
   const customer = new Customer(req.body)
   try {
      await customer.save()
      res.status(201).json({customer})
   } catch (err) {
      res.status(400).json({Error: err.message})
   }
   

})
app.post('/',(req,res)=>{
   res.send('This is a post request')
})


const start = async()=>{
    try {
        await mongoose.connect(CONNECTION)
        app.listen(PORT, ()=>{
          console.log(`App listening on Port ${PORT}`)
  })
  
    } catch (err) {
        console.log(err.message);
    }

}

start();
