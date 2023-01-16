import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Database from '@ioc:Adonis/Lucid/Database'
import CategoryCrudValidator  from "App/Validators/CategoryCrudValidator";
import Category from 'App/Models/Category'

export default class CategoriesController {
  /**
    * @swagger
    * /category:
    *      get:
    *          tags:
    *              - Category
    *          responses:
    *              200:
    *                  data: Get All Book
    *              example:
    *                  message: Success
    */
  public async index({response}: HttpContextContract) {
    // const category = await Database.from('categories').select('*')
    const category = await Category.query().preload("book")
    
    return response.ok({
        message: "Berhasil menampilkan semua data kategori",
        data:category
    });
  }

  /**
    * @swagger
    * /category:
    *      post:
    *          tags:
    *              - Category
    *          security:
    *              - bearerAuth: []
    *          parameters:
    *              - name: nama
    *                description: Inputkan Nama Kategori
    *                in: query
    *                required: true
    *                type: string
    *          responses:
    *              200:
    *                  data: Input Kategori
    *              example:
    *                  message: Success
    */
  public async store({response, request}: HttpContextContract) {
    const CategoryValidator = await request.validate(CategoryCrudValidator);
    // await Database.table('categories').insert(CategoryValidator)
    await Category.create(CategoryValidator);

    return response.created({
      message: "Berhasil tambah data kategori!",
    });
  }

  /**
    * @swagger
    * /category/{id}:
    *      get:
    *          tags:
    *              - Category
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
    // const category = await Database.from('categories').where('id', CategoryID).firstOrFail()
    try {
      const CategoryID = params.id
      const category = await Category.query()
          .where('id', CategoryID)
          .preload("book")
          .firstOrFail()

      return response.ok({
        message: "Berhasil menampilkan kategory " + CategoryID,
        data:category
      });
    } catch (error) {
      return response.ok({
        error: error.message
      });
    }
  
  }

  /**
    * @swagger
    * /category/{id}:
    *      put:
    *          tags:
    *              - Category
    *          security:
    *              - bearerAuth: []
    *          parameters:
    *              - in: path
    *                name: id
    *                schema:
    *                  type: integer
    *                  required: true
    *              - name: nama
    *                description: Inputkan Nama Kategori
    *                in: query
    *                required: true
    *                type: string
    *          responses:
    *              200:
    *                  data: Input Kategori
    *              example:
    *                  message: Success
    */
  public async update({response, request, params}: HttpContextContract) {
    const CategoryID = params.id
    const CategoryValidator = await request.validate(CategoryCrudValidator);
    // await Database.from('categories').where('id', CategoryID).update(CategoryValidator)
    await Category.query().where('id', CategoryID).update(CategoryValidator)

    return response.ok({
      message: "Berhasil update data kategori!",
    });
  }

  /**
    * @swagger
    * /category/{id}:
    *      delete:
    *          tags:
    *              - Category
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
    const CategoryID = params.id
    // await Database.from('categories').where('id', CategoryID).delete()
    const category = await Category.findOrFail(CategoryID)
    await category.delete()

    return response.ok({
      message: "Berhasil hapus kategori " + CategoryID,
    });
  }
}