require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w5eri.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const categoryCollection = client.db('library_management').collection('books_category');
    const booksCollection = client.db('library_management').collection('books');
    const borrowedCollection = client.db('library_management').collection('borrowedBooks');

    // get category data
    app.get('/category', async (req, res) => {
      const cursor = categoryCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // get all books
    app.get('/books', async (req, res) => {
      const cursor = booksCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // get category books
    app.get('/category/:category', async (req, res) => {
      const books =req.params.category
      const query = {category : books}
      const result = await booksCollection.find(query).toArray();
      res.send(result)
    })
    
    // get single book
    app.get('/book/:id', async (req, res) => {
      const id =req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await booksCollection.findOne(query)
      res.send(result)
    })


         // Update Book
        app.put('/book/:id', async (req, res) => {
          const id = req.params.id
          const query = { _id: new ObjectId(id) }
          const options = { upsert: true }
          const updatedBook = req.body
          const book = {
            $set: {
              image: updatedBook.image,
              bookName: updatedBook.bookName,
              category: updatedBook.category,
              rating: updatedBook.rating,
              authorName: updatedBook.authorName,
            }
          }
            const result = await booksCollection.updateOne(query, book, options)
            res.send(result);
      })

         // Update Book
        app.put('/books/:id', async (req, res) => {
          const id = req.params.id
          const query = { _id: new ObjectId(id) }
          const options = { upsert: true }
          const updatedBook = req.body
          const book = {
            $set: {
              quantity: updatedBook.quantity,
            }
          }
            const result = await booksCollection.updateOne(query, book, options)
            res.send(result);
      console.log(result)
      })


    // post add book
    app.post('/add-book', async(req, res) =>{
      const book = req.body
      console.log("New book received:", book);
      const result = await booksCollection.insertOne(book)
      res.send(result)

    })

    // post borrowed book
    app.post('/borrowed-book', async(req, res) =>{
      const book = req.body
      console.log("New borrowed book received:", book);
      const result = await borrowedCollection.insertOne(book)
      res.send(result)

    })
      // get borrowed books
      app.get('/borrowed-book', async (req, res) => {
        const cursor = borrowedCollection.find()
        const result = await cursor.toArray()
        res.send(result)
      })


    app.get('/user', async (req, res) => {
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Make and Fly!')
  })

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })