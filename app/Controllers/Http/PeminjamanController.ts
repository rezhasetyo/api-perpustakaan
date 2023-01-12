import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Peminjaman from 'App/Models/Peminjaman';

export default class PeminjamanController {
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
