import validator from 'validator';

export const validateSignUpData = (req)=>{
    const {firstName, lastName, emailId, password, age, gender, location, ProfileImage, bgImage, about} = req;

    if(!firstName || !lastName){
        throw new Error("Name is not valid!")
    }
    else if(firstName < 4 || firstName > 50){
        throw new Error("Characters must be in 4-50")
    }
    else if(lastName < 4 || lastName > 50){
        throw new Error("Characters must be in 4-50")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid format!")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password!")
    }
    else if(age<18 || age>80){
        throw new Error("Age must be in 18-80!")
    }
    else if(!['male','female','others'].includes(gender)){
        throw new Error("Gender is not valid!")
    }
}

export const validateEditProfileData = (req)=>{
    const ALLOWED_DATA = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "location",
      "ProfileImage",
      "bgImage",
      "about",
    ];

     const isUpdatedAllowed = Object.keys(req).every((value) => {  // true or false
        return ALLOWED_DATA.includes(value);  
    });

    return isUpdatedAllowed;
}

export const validateEditPasswordData = (req)=>{
    if(!validator.isStrongPassword(req)){
        throw new Error("Password invalid")
    }
}