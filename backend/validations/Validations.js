const yup = require("yup")

const userValidation = yup.object({
    name: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().required().min(6),
    isAdmin: yup.boolean().required()
});

const passwordValidation = yup.object({ 
    password: yup.string().required().min(6)
});

const companyValidation = yup.object({
    razao_social: yup.string().required(),
})
    
module.exports = {userValidation, passwordValidation, companyValidation}