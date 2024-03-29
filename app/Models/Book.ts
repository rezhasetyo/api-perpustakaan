import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import User from './User'

export default class Book extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public judul: string

  @column()
  public ringkasan: string

  @column()
  public tahun_terbit: number

  @column()
  public halaman: number

  @column()
  public kategori_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Category, {
    foreignKey: 'kategori_id', 
  })
  public category: BelongsTo<typeof Category>

  @manyToMany(() => User,{
    localKey: 'id',
    pivotForeignKey: 'book_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
    pivotTable: "peminjamen"
  })
  public users: ManyToMany<typeof User>
}
