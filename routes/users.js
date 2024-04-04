const express = require('express');

   const router = express.Router();

   const { PrismaClient } = require('@prisma/client');


   const prisma = new PrismaClient();


   // GET /users

   router.get('/users', async (req, res) => {

     try {

       const users = await prisma.user.findMany();

       res.json(users);

     } catch (error) {

       res.status(500).json({ error: 'An error occurred' });

     }

   });


   // POST /users

   router.post('/users', async (req, res) => {

     const { name, email } = req.body;

     try {

       const user = await prisma.user.create({

         data: {

           name,

           email,

         },

       });

       res.json(user);

     } catch (error) {

       res.status(500).json({ error: 'An error occurred' });

     }

   });


   module.exports = router;