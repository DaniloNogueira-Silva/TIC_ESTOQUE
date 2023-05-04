const yup = require("yup")

const userValidation = yup.object({
    name: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().required().min(6),
    isAdmin: yup.boolean().required()
});

module.exports = userValidation