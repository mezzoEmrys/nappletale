import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, 'data/paffet.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// Read data from JSON file, this will set db.data content
await db.read()

// If file.json doesn't exist, db.data will be null
// Set default data
// db.data = db.data || { posts: [] } // Node < v15.x
db.data ||= { paffet: [] }             // Node >= 15.x

const { paffet } = db.data
for(var i = 1; i < 7; i++){
    paffet.push({
        "name":"TODO",
        "image":"nt-p-"+(""+i).padStart(2, "0")+".jpg",
        "type":"petal",
        "mis":[]
    });
}
for(var i = 7; i < 29; i++){
    paffet.push({
        "name":"TODO",
        "image":"nt-p-"+(""+i).padStart(2, "0")+".jpg",
        "type":"assist",
        "mis":[]
    });
}
for(var i = 29; i <= 71; i++){
    paffet.push({
        "name":"TODO",
        "image":"nt-p-"+(""+i).padStart(2, "0")+".jpg",
        "type":"furniture",
        "mis":[]
    });
}


// Finally write db.data content to file
await db.write()