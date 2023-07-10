const insertUserQuery = require('../../models/usersQuery/insertUserQuery');
const { v4: uuid } = require('uuid');
const { generateError } = require('../../services/errors');
const sendMail = require('../../services/sendMail');

const newUser = async (req, res, next) => {
  try {
    const { email, username, password, personalInfo } = req.body;
    if (!email || !username || !password) {
      generateError('Faltan campos', 400);
    }

    const registrationCode = uuid();

    await insertUserQuery(
      email,
      username,
      password,
      registrationCode,
      personalInfo
    );

    const emailSubject = 'Activación de usuario en tattooArt';

    const emailBody = `

            ¡Bienvenid@ ${username} a tattoArt!
            
            Puedes activar tu usuario a través del siguiente enlace:
           
            <button><a href="http://localhost:8000/users/validate/${registrationCode}">Activar cuenta</a></button>

            Este es un email autogenerado, por favor no responda a este email.
        `;

    await sendMail(email, emailSubject, emailBody);

    res.send({
      status: 'ok',
      message:
        'Usuario creado, por favor revise su email para completar la activación de su cuenta',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = newUser;
