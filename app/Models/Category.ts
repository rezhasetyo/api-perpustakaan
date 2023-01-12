import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Book from './Book'


export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nama: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Book, {
    foreignKey: 'kategori_id', 
  })
  public book: HasMany<typeof Book>

}
