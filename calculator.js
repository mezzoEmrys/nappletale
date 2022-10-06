import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import _ from 'lodash'

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const mis_db = new Low(new JSONFile(join(__dirname, 'data/mis.json')))
const item_db = new Low(new JSONFile(join(__dirname, 'data/item.json')))
const paffet_db = new Low(new JSONFile(join(__dirname, 'data/paffet.json')))
const area_db = new Low(new JSONFile(join(__dirname, 'data/area.json')))

// Read data from JSON file, this will set db.data content
await mis_db.read()
await item_db.read()
await paffet_db.read()
await area_db.read()

const { mis } = mis_db.data
const { item } = item_db.data
const { paffet } = paffet_db.data
const { area } = area_db.data

function paffetByName(name){
    return _.find(paffet, p => p.name == name)
}

function getMis(paffet){
    return paffet.mis.map(mis_name => _.find(mis, m => m.name == mis_name))
}

function sourceItems(mis){
    return _.filter(item, item => item.mis.includes(mis.name))
}

function getAreas(item){
    return _.filter(area, area => area.items.includes(item.name))
}

console.log(_.chain(getMis(paffetByName("Healihoo"))).map(sourceItems).map(items => _.chain(items).flatMap(getAreas).map(a => a.name).uniq().value()).value());
//.flatMap(getAreas).map(a => a.name).uniq()