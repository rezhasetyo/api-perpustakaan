import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookCrudValidator from 'App/Validators/BookCrudValidator'
import Book from 'App/Models/Book'

export default class CategoriesController {

  public async index({response}: HttpContextContract) {
    const book = await Book.query().preload("category").preload("users")
    
    return response.ok({
        message: "Berhasil menampilkan semua data buku",
        data:book
    });
  }

  public async store({response, request}: HttpContextContract) {
    const BookValidator = await request.validate(BookCrudValidator);
    await Book.create(BookValidator);

    return response.created({
      message: "Berhasil tambah data buku!",
    });
  }

  public async show({response, params}: HttpContextContract) {
    try {
      const BookId = params.id
      // const book = await Book.findOrFail(BookId)
      const book = await Book
          .query()
          .where('id', BookId)
          .preload("category")
          .firstOrFail()

      return response.ok({
        message: "Berhasil menampilkan buku id : " + BookId,
        data:book
      });
    } catch (error) {
      return response.ok({
        error: error.message
      });
    }
  }

  public async update({response, request, params}: HttpContextContract) {
    const BookId = params.id
    const BookValidator = await request.validate(BookCrudValidator);
    await Book.query().where('id', BookId).update(BookValidator)

    return response.ok({
      message: "Berhasil update data buku!",
    });
  }

  public async destroy({response, params}: HttpContextContract) {
    const BookId = params.id
    const book = await Book.findOrFail(BookId)
    await book.delete()

    return response.ok({
      message: "Berhasil hapus data buku id : " + BookId,
    });
  }
}
