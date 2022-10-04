import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import _ from 'lodash'
import * as http from 'http'
import * as fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const mis_db = new Low(new JSONFile(join(__dirname, 'data/mis.json')))
const item_db = new Low(new JSONFile(join(__dirname, 'data/item.json')))
const paffet_db = new Low(new JSONFile(join(__dirname, 'data/paffet.json')))

// Read data from JSON file, this will set db.data content
await mis_db.read()
await item_db.read()
await paffet_db.read()

const { mis } = mis_db.data
const { item } = item_db.data
const { paffet } = paffet_db.data

function image(el){
    return "<img src='/images/"+el.image+"' title='"+el.name+"'>";
}

function big_image(el){
    return "<img class='big' src='/images/"+el.image+"' title='"+el.name+"'>";
}

function generate_mis_container(item) {
    var out = "";
    out += big_image(item);
    
    item.mis
        .map(mis_name => _.find(mis, m => m.name == mis_name))
        .forEach(mi => {
            try{
            out +=(image(mi))
            }
            catch(err){
                console.log("Bad MIS in " + item.name);
            }
        });
    out +=('<br>');
    return out;
}

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.write("<html><head><style>");
        res.write("img.big { width:64px;}")
        res.write("</style></head><body>")
        paffet.forEach(el => res.write(generate_mis_container(el)));
        res.write("</body></html>")
        res.end();
    }
    else if (req.url.startsWith("/i/")) {
        var id = req.url.substring(3);
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.write("<html><head><style>");
        res.write("img.big { width:64px;}")
        res.write("</style></head><body>")
        res.write(big_image(item[id]));
        res.write("</body></html>")
        res.end();
    }
    else if (req.url.startsWith("/images/")) {
        if(fs.existsSync("."+req.url)){
            res.setHeader("Content-Type", "image/jpeg");
            res.writeHead(200);
            res.end(fs.readFileSync("."+req.url));
        } else {
            res.writeHead(404);
            res.end();
        }
    }
    else {
        console.log(req.url);
        res.writeHead(404);
        res.end();
    }
});

server.listen(1000);
console.log("server started");