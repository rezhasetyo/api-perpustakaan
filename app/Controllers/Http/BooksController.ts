import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import BookCrudValidator  from "App/Validators/BookCrudValidator";

export default class BooksController {
  public async index({response}: HttpContextContract) {
    const book = await Database
      .from('books') // 👈 gives an instance of select query builder
      .select('*')
    
    return response.ok({
        message: "Berhasil menampilkan semua data buku",
        data:book
    });
  }

  public async store({response, request}: HttpContextContract) {
    const BookValidator = await request.validate(BookCrudValidator);

    await Database
      .table('books') // 👈 gives an instance of insert query builder
      .insert(
        BookValidator
      )

    return response.created({
      message: "Berhasil tambah data buku!",
    });
  }

  public async show({response, params}: HttpContextContract) {
    const BookID = params.id

    const book = await Database
      .from('books')
      .where('id', BookID)
      .firstOrFail()

    return response.ok({
      message: "Berhasil menampilkan kategory " + BookID,
      data:book
    });
  }

  public async update({response, request, params}: HttpContextContract) {
    const BookID = params.id
    const BookValidator = await request.validate(BookCrudValidator);

    await Database
      .from('books')
      .where('id', BookID)
      .update(BookValidator)

    return response.ok({
      message: "Berhasil update data kategori!",
    });
  }

  public async destroy({response, params}: HttpContextContract) {
    const BookID = params.id

    await Database
      .from('books')
      .where('id', BookID)
      .delete()

    return response.ok({
      message: "Berhasil hapus kategori " + BookID,
    });
  }
}