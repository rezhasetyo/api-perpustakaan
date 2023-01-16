import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Peminjaman from 'App/Models/Peminjaman';

export default class PeminjamanController {
  /**
    * @swagger
    * /book/{id}/pinjam:
    *      post:
    *          tags:
    *              - Peminjaman
    *          security:
    *              - bearerAuth: []
    *          parameters:
    *              - in: path
    *                name: id
    *                description: Inputkan Id Buku
    *                schema:
    *                  type: integer
    *                  required: true
    *              - name: tanggal_pinjam
    *                description: Inputkan Tanggal Pinjam (Datetime)
    *                in: query
    *                required: true
    *                type: string
    *              - name: tanggal_kembali
    *                description: Inputkan Tanggal Kembali (Datetime)
    *                in: query
    *                required: true
    *                type: string
    *          responses:
    *              200:
    *                  data: Input Kategori
    *              example:
    *                  message: Success
    */
    public async store({request, response, auth, params}: HttpContextContract){
        try {
            const userId = auth.user?.id;
            await Peminjaman.create({
                user_id: userId,
                book_id: params.id,
                tanggal_pinjam: request.input('tanggal_pinjam'),
                tanggal_kembali: request.input('tanggal_kembali')
            })

            response.ok({
                message: "Berhasil Meminjam Buku"
            })
            
        } catch (error) {
            response.badRequest({
                message: error
            });
        }
    }

    /**
      * @swagger
      * /peminjaman:
      *      get:
      *          tags:
      *              - Peminjaman
      *          responses:
      *              200:
      *                  data: Get All Book
      *              example:
      *                  message: Success
      */
    public async index({ response }: HttpContextContract){
        try {
            const peminjaman = await Peminjaman.query()
                .preload("user")
                .preload("book");

            response.ok({
                message: "Berhasil Menampilkan Data Peminjaman",
                data:peminjaman
            })

        } catch (error) {
            response.badRequest({
                message: error
            });
        }
    }

    /**
      * @swagger
      * /peminjaman/{id}:
      *      get:
      *          tags:
      *              - Peminjaman
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
    public async show({ response, params }: HttpContextContract){
        const peminjamanId = params.id
        try {
            const peminjaman = await Peminjaman.query()
                .where('id', peminjamanId)
                .preload("user")
                .preload("book")
                .firstOrFail();

            response.ok({
                message: "Berhasil Menampilkan Data Peminjaman Id  : " + peminjamanId,
                data:peminjaman
            })
        } catch (error) {
            response.badRequest({
                message: error
            });
        }
    }
}
