module.exports = {
    ViewShow : async (view,data,req,res)=>{
        let datax = {
            _AppTitle : "ATM Services",
            _AppTitleSmall : "ATM Services",
            _AppTitleAlias : "ATMS",
            _Copyright : "2019 DN, Admin LTE 3",
            _Version : "1.0.1 Alpha",
            _UserName : req.session.fullname
        };
        await Object.assign(datax,data);
        try{
            await res.render(view,datax);
        }catch(err){
            res.send(404);
        }
    }
};