const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config({path: '../.env'})

exports.enviarEmail = async(datos) => {

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    //secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

    const { email, password, nombre } = datos
    
    await transport.sendMail({
        from: 'SIMOCAVER PROYECT',
        to: email,
        subject: 'Acceso al sistema ',
        text:'Accede al sistema',
        html: 
        `<p>Hola ${nombre}, Se le envia su contraseña para el acceso al sistema de SIMOCAVER</p>
         <p>Tu contraseña de acceso: ${password} asegurate de no compartir tu contraseña y guardarla en un lugar seguro</p>
        `
      })
}

exports.resetPasswordEmail = async (datos) => {

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    //secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
    const { email, token, nombre } = datos

    await transport.sendMail({
      from: 'SIMOCAVER PROYECT',
      to: email,
      subject: 'Recuperar contraseña',
      text:'Recuperacion de contraseña',
      html: 
      `<p>Hola ${nombre}, Usted recientemente solicito recuperar su contraseña de acceso al sistema simocaver para ello de click en el siguiente enlace de o ser asi ignore este mensaje</p>
       <a href='${process.env.URLFRONTEND}/auth/reset-password/${token}'>Da click aqui para recuperar tu cotraseña</a>
      `
    })
}