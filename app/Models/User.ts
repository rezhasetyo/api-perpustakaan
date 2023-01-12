import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasOne, HasOne, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'
import Book from './Book'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public role: string

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasOne(() => Profile, {
    foreignKey: 'user_id', // defaults to userId
  })
  public profile: HasOne<typeof Profile>


  @manyToMany(() => Book,{
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'book_id',
    pivotTable: "peminjamen"
  })
  public book: ManyToMany<typeof Book>
}

