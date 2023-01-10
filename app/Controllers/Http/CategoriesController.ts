import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Database from '@ioc:Adonis/Lucid/Database'
import CategoryCrudValidator  from "App/Validators/CategoryCrudValidator";
import Category from 'App/Models/Category'

export default class CategoriesController {
  public async index({response}: HttpContextContract) {
    // const category = await Database.from('categories').select('*')
    const category = await Category.all()
    
    return response.ok({
        message: "Berhasil menampilkan semua data kategori",
        data:category
    });
  }

  public async store({response, request}: HttpContextContract) {
    const CategoryValidator = await request.validate(CategoryCrudValidator);
    // await Database.table('categories').insert(CategoryValidator)
    await Category.create(CategoryValidator);

    return response.created({
      message: "Berhasil tambah data kategori!",
    });
  }

  public async show({response, params}: HttpContextContract) {
    // const category = await Database.from('categories').where('id', CategoryID).firstOrFail()
    try {
      const CategoryID = params.id
      const category = await Category.findOrFail(CategoryID)
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

  public async update({response, request, params}: HttpContextContract) {
    const CategoryID = params.id
    const CategoryValidator = await request.validate(CategoryCrudValidator);
    // await Database.from('categories').where('id', CategoryID).update(CategoryValidator)
    await Category.query().where('id', CategoryID).update(CategoryValidator)

    return response.ok({
      message: "Berhasil update data kategori!",
    });
  }

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