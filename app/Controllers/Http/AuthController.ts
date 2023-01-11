import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import AuthValidator from 'App/Validators/AuthValidator'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class AuthController {

    public async register ({ request, response }: HttpContextContract) {
        try {
            const authValidate = await request.validate(AuthValidator)
            await User.create(authValidate)
            return response.created({
                message: "Register Berhasil"
            })
        } catch (error) {
            return response.unprocessableEntity({
                message:error
            })        
        }
    }

    public async login ({ request, response, auth }: HttpContextContract) {
        try {
            const loginValidation = schema.create({
                email: schema.string(),
                password: schema.string()
            })

            await request.validate({schema: loginValidation})
            const email = request.input('email')
            const password = request.input('password')
            const token = await auth.use('api').attempt(email, password, {
                expiresIn: '7 Days'
            })

            return response.ok({
                message: 'Login Success',
                token
            })

        } catch (error) {
            if (error.guard) {
                return response.badGateway({
                    message: "Login Validasi Error",
                    error: error
                })
            } else {
                return response.badRequest({
                    message: "Login Error",
                    error: error.message
                })
            }
        }
    }
}
