import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookCrudValidator from 'App/Validators/BookCrudValidator'
import Book from 'App/Models/Book'

export default class CategoriesController {
  /**
   * @swagger
   * /book:
   *      get:
   *          tags:
   *              - Book
   *          responses:
   *              200:
   *                  data: Get All Book
   *              example:
   *                  message: Success
   */
  public async index({response}: HttpContextContract): Promise<void> {
    const book = await Book.query().preload("category").preload("users")
    
    return response.ok({
        message: "Berhasil menampilkan semua data buku",
        data:book
    });
  }
  
  /**
    * @swagger
    * /book:
    *      post:
    *          tags:
    *              - Book
    *          security:
    *              - bearerAuth: []
    *          parameters:
    *              - name: judul
    *                description: Inputkan Judul
    *                in: query
    *                required: true
    *                type: string
    *              - name: ringkasan
    *                description: Inputkan Ringkasan
    *                in: query
    *                required: true
    *                type: string
    *              - name: tahun_terbit
    *                description: Inputkan Tahun Terbit
    *                in: query
    *                required: true
    *                type: integer
    *              - name: halaman
    *                description: Inputkan Halaman
    *                in: query
    *                required: true
    *                type: integer
    *              - name: kategori_id
    *                description: Inputkan Kategori Id
    *                in: query
    *                required: true
    *                type: integer
    *          responses:
    *              200:
    *                  data: Input Buku
    *              example:
    *                  message: Success
    */
  public async store({response, request}: HttpContextContract) {
    const BookValidator = await request.validate(BookCrudValidator);
    await Book.create(BookValidator);

    return response.created({
      message: "Berhasil tambah data buku!",
    });
  }

  /**
    * @swagger
    * /book/{id}:
    *      get:
    *          tags:
    *              - Book
    *          parameters:
    *              - in: path
    *                name: id
    *                schema:
    *                  type: integer
    *                  required: true
    *          responses:
    *              200:
    *                  data: Get All Book
    *              example:
    *                  message: Success
    */
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

  /**
    * @swagger
    * /book/{id}:
    *      put:
    *          tags:
    *              - Book
    *          security:
    *              - bearerAuth: []
    *          parameters:
    *              - in: path
    *                name: id
    *                schema:
    *                  type: integer
    *                  required: true
    *              - name: judul
    *                description: Inputkan Judul
    *                in: query
    *                required: true
    *                type: string
    *              - name: ringkasan
    *                description: Inputkan Ringkasan
    *                in: query
    *                required: true
    *                type: string
    *              - name: tahun_terbit
    *                description: Inputkan Tahun Terbit
    *                in: query
    *                required: true
    *                type: integer
    *              - name: halaman
    *                description: Inputkan Halaman
    *                in: query
    *                required: true
    *                type: integer
    *              - name: kategori_id
    *                description: Inputkan Kategori Id
    *                in: query
    *                required: true
    *                type: integer
    *          responses:
    *              200:
    *                  data: Input Buku
    *              example:
    *                  message: Success
  */
  public async update({response, request, params}: HttpContextContract) {
    const BookId = params.id
    const BookValidator = await request.validate(BookCrudValidator);
    await Book.query().where('id', BookId).update(BookValidator)

    return response.ok({
      message: "Berhasil update data buku!",
    });
  }

  /**
    * @swagger
    * /book/{id}:
    *      delete:
    *          tags:
    *              - Book
    *          security:
    *              - bearerAuth: []
    *          parameters:
    *              - in: path
    *                name: id
    *                schema:
    *                  type: integer
    *                  required: true
    *          responses:
    *              200:
    *                  data: Get All Book
    *              example:
    *                  message: Success
    */
  public async destroy({response, params}: HttpContextContract) {
    const BookId = params.id
    const book = await Book.findOrFail(BookId)
    await book.delete()

    return response.ok({
      message: "Berhasil hapus data buku id : " + BookId,
    });
  }
}
