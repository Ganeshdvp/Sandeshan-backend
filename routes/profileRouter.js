import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import { validateEditProfileData, validateEditPasswordData } from '../utils/validations.js';
import bcrpt from 'bcrypt';

export const profileRouter = express.Router();


// profile
profileRouter.get('/profile', userAuth, async (req,res)=>{
  try{
    const user = req.user;
    res.json({data: user})
  }
  catch(err){
    res.status(400).json({message: "Something went wrong! " + err.message});
  }
})

// edit profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    const editData = req.body
  try {
    // validate edit data
    if(!validateEditProfileData(editData)){
        throw new Error("update is not allowed!");
    }

    const loggedInUser = req.user;

    Object.keys(editData).forEach(key => loggedInUser[key] = editData[key])

    await loggedInUser.save()

    res.json({message: `${loggedInUser.firstName} your profile updated successfully!`, data: loggedInUser});

  } catch (err) {
    res.status(400).json({message: "Failed to update your profile!" + err.message});
  }
});

// forgot-password
profileRouter.patch('/profile/forgot-password', userAuth, async (req,res)=>{
    try{
        validateEditPasswordData(req.body.password)

        const hashPassword = await bcrpt.hash(req.body.password, 10);

        const loggedInUser = req.user;

        loggedInUser.password = hashPassword;

        await loggedInUser.save();

        res.json({message: `${loggedInUser.firstName} your password updated successfully!`})
    }
    catch(err){
        res.status(400).json({message: "Failed to update password!"})
    }
})