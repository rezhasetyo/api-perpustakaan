/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// Route.get('/', async () => {
//   return 'Hello world from a slim app'
// })

// Route.resource('category','CategoriesController').apiOnly();
    Route.get('/category', 'CategoriesController.index')
    Route.get('/category/:id', 'CategoriesController.show')
    Route.post('/category', 'CategoriesController.store').middleware('auth')
    Route.put('/category/:id', 'CategoriesController.update').middleware('auth')
    Route.delete('/category/:id', 'CategoriesController.destroy').middleware('auth')

// Route.resource('book','BooksController').apiOnly();
    Route.get('/book', 'BooksController.index')
    Route.get('/book/:id', 'BooksController.show')
    Route.post('/book', 'BooksController.store').middleware('auth')
    Route.put('/book/:id', 'BooksController.update').middleware('auth')
    Route.delete('/book/:id', 'BooksController.destroy').middleware('auth')

Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')
Route.post('/update-profile', 'AuthController.updateProfile').middleware('auth')
Route.post('/otp-verification', "AuthController.otpConfirmation").middleware("auth")

Route.post('book/:id/pinjam', "PeminjamanController.store").middleware("auth")
Route.get('/peminjaman', 'PeminjamanController.index')
Route.get('/peminjaman/:id', 'PeminjamanController.show')
