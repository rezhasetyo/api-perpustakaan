import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Book from './Book'

export default class Peminjaman extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public book_id: number

  @column()
  public tanggal_pinjam: DateTime

  @column()
  public tanggal_kembali: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_id', 
  })
  public user: BelongsTo<typeof User>
  
  @belongsTo(() => Book, {
    foreignKey: 'book_id', 
  })
  public book: BelongsTo<typeof Book>
}
