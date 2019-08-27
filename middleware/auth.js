module.exports = {
	isLogin: async (req,res,next) =>{
		try{
			let id = req.session._id;
			let username = req.session.username;
			let fullname = req.session.fullname;
			//console.log(req.session);
			if(username){
				// const auth_token =  await JWT.sign({id:id,fullname:fullname},process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });
				//req.session.token = auth_token;

				next();
			}else{
				res.redirect('/login');
			}
		}catch(err){
			res
			.sendStatus(401);
			
		}
    }
}