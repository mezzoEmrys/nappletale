import * as https from 'https'; // or 'https' for https:// URLs
import * as fs from 'fs';

//first six not on site
for(var i = 7; i <= 71; i++){
    const fn = "nt-p-"+(""+i).padStart(2, "0")+".jpg";
    const file = fs.createWriteStream("images/"+fn);
    const request = https.get("https://kihaku01.web.fc2.com/parts/DC/nt/nt-p/"+fn, (res, err)=> {
        if(err) console.err("no "+fn);
        res.pipe(file);

    // after download completed close filestream
    file.on("finish", () => {
        file.close();
        console.log("downloaded "+fn);
    });
});
}
