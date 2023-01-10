import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import CategoryCrudValidator  from "App/Validators/CategoryCrudValidator";

export default class CategoriesController {
  public async index({response}: HttpContextContract) {
    const category = await Database
      .from('categories') // 👈 gives an instance of select query builder
      .select('*')
    
    return response.ok({
        message: "Berhasil menampilkan semua data kategori",
        data:category
    });
  }

  public async store({response, request}: HttpContextContract) {
    const CategoryValidator = await request.validate(CategoryCrudValidator);

    await Database
      .table('categories') // 👈 gives an instance of insert query builder
      .insert(
        CategoryValidator
      )

    return response.created({
      message: "Berhasil tambah data kategori!",
    });
  }

  public async show({response, params}: HttpContextContract) {
    const CategoryID = params.id

    const category = await Database
      .from('categories')
      .where('id', CategoryID)
      .firstOrFail()

    return response.ok({
      message: "Berhasil menampilkan kategory " + CategoryID,
      data:category
    });
  }

  public async update({response, request, params}: HttpContextContract) {
    const CategoryID = params.id
    const CategoryValidator = await request.validate(CategoryCrudValidator);

    await Database
      .from('categories')
      .where('id', CategoryID)
      .update(CategoryValidator)

    return response.ok({
      message: "Berhasil update data kategori!",
    });
  }

  public async destroy({response, params}: HttpContextContract) {
    const CategoryID = params.id

    await Database
      .from('categories')
      .where('id', CategoryID)
      .delete()

    return response.ok({
      message: "Berhasil hapus kategori " + CategoryID,
    });
  }
}