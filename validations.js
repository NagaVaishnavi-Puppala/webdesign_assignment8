//validations
const validateEmail = (mail)  =>
{
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return (true)
  }

  return (false)
}

const checkPassword = (inputtxt) => { 
  var passw=  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  if(inputtxt.match(passw)) 
  { 
    return true;
  } else { 
    return false;
  }
}
const validateName = (fullname)  =>
{

  if (/^[a-zA-Z]+( [a-zA-Z]+)*$/i.test(fullname)) {
    return (true)
  }

  return (false)
}

module.exports = { validateEmail, checkPassword, validateName };