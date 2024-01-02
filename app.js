// Task1: initiate app and run server at 3000

const express = require('express');
const mongoose = require('mongoose');
const app = new express();
const cors = require('cors');
const morgan = require('morgan');

const PORT = process.env.PORT || 3000

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));

require('dotenv').config();

// middlewares
app.use(cors({
    origin:process.env.CORS_ORIGIN || '*',
    credentials:true
}));


app.use(morgan('dev'));
app.use(express.json());  
app.use(express.urlencoded({extended:true}));


// Task2: create mongoDB connection 
// const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017'
const mongoUrl = process.env.MONGODB_URL || 'mongodb+srv://vsm00:vaishnavi@cluster0.zmibsrh.mongodb.net/?retryWrites=true&w=majority'
const dbName = process.env.DB_NAME || 'employeeDB'

mongoose.connect(`${mongoUrl}/${dbName}`)
.then(()=>{
    console.log(`connected to mongodb ${mongoUrl}/${dbName}`)
})
.catch(err => console.err)

// schema
const employeeSchema = new mongoose.Schema({
    Name: String,
    Location: String,
    Position: String,
    Salary: Number
  });
  
  const Employee = mongoose.model('Employee', employeeSchema);



//Task 2 : write api with error handling and appropriate api mentioned in the TODO below







//TODO: get data from db  using api '/api/employeelist'
app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        if (employees.length > 0) {
            res.status(200).send({ success: true, data: employees });
        } else {
            res.status(203).send({ success: false, error: "no data" });
        }
    } catch (error) {
        console.error(error);
        res.status(404).json({ error });
    }
});



//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const employee = await Employee.findById(id);
        if (employee) {
            res.status(200).send({ success: true, data: employee });
        } else {
            res.status(203).send({ success: false, error: "no data" });
        }
    } catch (error) {
        console.error(error);
        res.status(404).json({ error });
    }
});



//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist', async (req, res) => {
    try {
        const item = req.body;
        if (!item) {
            res.status(203).json({ error: 'no data' });
        } else {
            const newEmployee = new Employee(item);
            const saveEmployee = await newEmployee.save();
            res.status(200).json({ success: true, data: saveEmployee });
        }
    } catch (error) {
        console.error(error);
        res.status(404).json({ error });
    }
});




//TODO: delete a employee data from db by using api '/api/employeelist/:id'

app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const employee = await Employee.findByIdAndDelete(id);
        if (employee) {
            res.status(200).send({ success: true });
        } else {
            res.status(203).send({ success: false, error: "no data" });
        }
    } catch (error) {
        console.error(error);
        res.status(404).json({ error });
    }
});



//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.put('/api/employeelist/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const updateItem = await Employee.findByIdAndUpdate(
            id,
            { $set: updatedData },
            { new: true }
        );
        if (updateItem) {
            res.status(200).send({ success: true, data: updateItem });
        } else {
            res.status(203).send({ success: false, error: "update failed" });
        }
    } catch (error) {
        console.error(error);
        res.status(404).json({ error });
    }
});


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});


app.listen(PORT,()=>{
    console.log('listening on port '+ PORT)
})