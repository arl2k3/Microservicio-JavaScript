const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const { errorHandler, notFoundHandler, malformedJsonHandler } = require('./src/middleware/errorHandler');
const path = require('path');

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(malformedJsonHandler);

app.get("/login", (req, res)=>{
    res.render("login");
});

app.get("/register", (req, res)=>{
    res.render("register");
});

app.get("/verify-Acc", (req, res)=>{
    res.render("verifyAcc");
});

app.get("/forgot-password", (req, res)=>{
    res.render("forgotPass");
});

// Rutas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

app.use(notFoundHandler);
app.use(errorHandler); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

