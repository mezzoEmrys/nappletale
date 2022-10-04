import * as https from 'https'; // or 'https' for https:// URLs
import * as fs from 'fs';

for(var i = 1; i <= 52; i++){
    const fn = "nt-mis"+(""+i).padStart(2, "0")+".jpg";
    const file = fs.createWriteStream("images/"+fn);
    const request = https.get("https://kihaku01.web.fc2.com/parts/DC/nt/nt-mis/"+fn, (res, err)=> {
        if(err) console.err("no "+fn);
        res.pipe(file);

    // after download completed close filestream
    file.on("finish", () => {
        file.close();
        console.log("downloaded "+fn);
    });
});
}
