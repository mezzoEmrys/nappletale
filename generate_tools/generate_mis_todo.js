import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, 'data/mis.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// Read data from JSON file, this will set db.data content
await db.read()

// If file.json doesn't exist, db.data will be null
// Set default data
// db.data = db.data || { posts: [] } // Node < v15.x
db.data ||= { mis: [] }             // Node >= 15.x

const { mis } = db.data
for(var i = 1; i < 53; i++){
    mis.push({
        "name":"TODO",
        "image":"nt-mis"+(""+i).padStart(2, "0")+".jpg"
    });
}


// Finally write db.data content to file
await db.write()