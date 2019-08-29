module.exports = {
    ViewShow : async (view,data,req,res)=>{
        let datax = {
            _AppTitle : "ATM Services",
            _AppTitleSmall : "ATM Services",
            _AppTitleAlias : "ATMS",
            _Copyright : "Diebold 2017",
            _Version : "1.0 Beta",
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