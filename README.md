# Napple Tale Resource

Napple Tale is a cute platforming RPG for the Dreamcast, designed by a team of mostly women, with excellent music by Yoko Kanno.

This node project is meant to be a simple webserver that can be run locally to provide a quick reference to various aspects of the game that are useful for routing in speedruns, races, etc.

## Data

### paffet.json 
contains paffet names and recipes
### item.json 
contains decodable items and their MIS
#### TODO
* images for decode locations
### mis.json 
contains all MIS
### area.json 
contains each explorable area, along with any other important data pertinent to the area
#### TODO
* map renders?
### treasure.json
list of all treasures (enemies, chests, events)
#### TODO
* list of recipes that can be found
* images for chests + contents
* images for enemies that drop items
### quest.json 
contains each quest, with paffets required, requirements, and blockers
#### TODO
* list of required paffets
* list of prereqs
* list of blockers


## Webpage TODO:

### Encyclopedia
blocked by quest, treasure data

### Journal
provide calculators for additional information
* craftable paffets with current mis
* backpack problem item sets to solve mis requirements

## Bingo TODO:

* Bingo page to generate exportable list of bingo options for a given ruleset
* Define rules that can be in a ruleset

## Romhack TODO:

* Open World romhack
* More Dove Clock
* No Dove Clock
* Dove Clock Jumpscare

## Randomizer TODO:

* Research what can be randomized
* Decide what is randomized
* Make compatible with above Romhacks

### Notes:

* MIS pool for paffets, items
* Enemizer
* fucked up quest prerequisites (eg. winter petal for the wind to work in Wild Wind)