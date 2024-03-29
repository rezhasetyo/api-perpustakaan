import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import AuthValidator from 'App/Validators/AuthValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AuthController {
    /**
     * @swagger
     * /register:
     *      post:
     *          tags:
     *              - Authentication
     *          parameters:
     *              - name: email
     *                description: Inputkan Email
     *                in: query
     *                required: true
     *                format: email
     *                type: string
     *              - name: password
     *                description: Inputkan Password
     *                in: query
     *                required: true
     *                format: password
     *                type: string
     *              - name: role
     *                description: Inputkan Role
     *                schema:
     *                       $ref: '#/components/schemas/Role'
     *                in: query
     *                required: true
     *                type: string
     *          responses:
     *              200:
     *                  data: Register Akun
     *                  example:
     *                      message: Success
     * components:
     *      schemas:
     *          Role:
     *              type: string
     *              enum:
     *                  - admin
     *                  - user
    */
    public async register ({ request, response }: HttpContextContract) {
        try {
            const authValidate = await request.validate(AuthValidator)
            const newUser = await User.create(authValidate)
            
            const email = request.input('email')
            const otp_code = Math.floor(100000 + Math.random() * 900000)
            await Database.table('otp_codes').insert({otp_code: otp_code, user_id: newUser.id})

            await Mail.send((message) => {
                message
                  .from('amdmin@gmail.com')
                  .to(email)
                  .subject('Welcome Onboard!')
                  .htmlView('emails/otp_verification', { otp_code })
              })

            return response.created({
                message: "Register Berhasil, silahkan verifikasi kode otp"
            })
        } catch (error) {
            return response.unprocessableEntity({
                message:error
            })        
        }
    }

    /**
     * @swagger
     * /login:
     *      post:
     *          tags:
     *              - Authentication
     *          parameters:
     *              - name: email
     *                description: Inputkan Email
     *                in: query
     *                required: true
     *                format: email
     *                type: string
     *              - name: password
     *                description: Inputkan Password
     *                in: query
     *                required: true
     *                format: password
     *                type: string
     *          responses:
     *              200:
     *                  data: Login Akun
     *              example:
     *                  message: Success
     */
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
    
     /**
     * @swagger
     * /otp-verification:
     *      post:
     *          tags:
     *              - Authentication
     *          parameters:
     *              - name: email
     *                description: Inputkan Email
     *                in: query
     *                required: true
     *              - name: otp_code
     *                description: Inputkan Otp Code
     *                in: query
     *                required: true
     *          responses:
     *              200:
     *                  data: Otp Verification
     *              example:
     *                  message: Success
     */
    public async otpConfirmation({request, response}: HttpContextContract)   {
        let otp_code = request.input('otp_code')
        let email = request.input('email')

        let user = await User.findBy('email', email)
        let otpCheck = await Database.query().from('otp_codes').where('otp_code', otp_code).first()
        
        if(user?.id == otpCheck.user_id){
            // user.is_verified = "1"
            await user?.save()
            return response.status(200).json({ message: 'berhasil konfirmasi OTP'})
        } else {
            return response.status(400).json({ message: 'gagal konfirmasi OTP'})
        }
    }

     /**
     * @swagger
     * /update-profile:
     *      post:
     *          tags:
     *              - Authentication
     *          parameters:
     *              - name: alamat
     *                description: Inputkan Alamat
     *                in: query
     *                required: true
     *              - name: bio
     *                description: Inputkan Bio
     *                in: query
     *                required: true
     *          security:
     *              - bearerAuth: []
     *          responses:
     *              200:
     *                  data: Update Profile
     *              example:
     *                  message: Success
     */
    public async updateProfile ({ request, response, auth }: HttpContextContract) {
        const userData = auth.user;

        const profileValidate = schema.create({
            alamat: schema.string(),
            bio: schema.string(),
        })
        await request.validate({schema: profileValidate});

        const alamat = request.input("alamat");
        const bio = request.input("bio");

        const persistancePayload = {
            alamat,
            bio,
         }

         await userData?.related('profile').updateOrCreate({}, persistancePayload);

         return response.created({
            message: "Success create/update profile"
         }) 
    }

}
