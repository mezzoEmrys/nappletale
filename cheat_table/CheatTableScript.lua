local scan = createMemScan()
scan.firstScan(soExactValue,vtString,rtTruncated,"Spirit World"," ",0x25850000,0x29850000, "*W", fsmNotAligned, nil, true, false, false, false)
scan.waitTillDone()
local flist = createFoundList(scan)
flist.initialize()

function calcOffset(base, other)
  return tonumber(other,"16")-tonumber(base, "16")
end

local base = flist.getAddress(0)
local tweakable = tonumber(base, "16")
local head = tweakable >> 16

function stdOffset(other)
  return string.format("%x",head + calcOffset("2594", other))
end

local dataOffset = calcOffset("2594", "25AE")
local newhead = string.format("%x",head+dataOffset)

function val(addr, offset)
return string.format("%x",tonumber(addr,"16")+offset)
end

local alist = getAddressList()

function newHeader(name)
local header = alist.createMemoryRecord()
header.description = name
header.isGroupHeader = true
header.options = '[moHideChildren,moAllowManualCollapseAndExpand,moManualExpandCollapse]'
return header
end

header = newHeader("MIS")

local misStart = "47E9"
for i=0,52
do
  mis = alist.createMemoryRecord()
  mis.type = vtByte
  mis.description = "MIS " .. i
  mis.address = newhead .. val(misStart, i)
  mis.appendToEntry(header)
end

header = newHeader("Items")

local itemStart = "4825"
for i=1,49
do
  item = alist.createMemoryRecord()
  item.type = vtByte
  item.description = "Item" .. (i)
  item.address = newhead .. val(itemStart, i - 1)
  item.appendToEntry(header)
end

-- paffet recipe flags start at xxxx4972
-- first byte: information known about paffet
-- second byte: flag: 1 2 4 8 (know season 1-4) 16 32 64 128 (know element 1-4)
-- these things are ordered by aliens

local paffetFlags = "4972"
recipe = alist.createMemoryRecord()
recipe.type = vtWord
recipe.description = "First recipe"
recipe.address = newhead .. paffetFlags

-- slot 1 paffet counts

header = newHeader("Paffet Uses")

entry = alist.createMemoryRecord()
entry.type = vtByte
entry.description = "Paffet Slot 1 In-stage"
entry.address = stdOffset("264C") .. "7458"
entry.appendToEntry(header)

entry = alist.createMemoryRecord()
entry.type = vtByte
entry.description = "Paffet Slot 1 In-town"
entry.address = stdOffset("264F") .. "DAAB"
entry.appendToEntry(header)

header = newHeader("Paffet Data")

entry = alist.createMemoryRecord()
entry.type = vtByte
entry.description = "Some kind of count? 1"
entry.address = stdOffset("25A0") .. "9D14"
entry.appendToEntry(header)

entry = alist.createMemoryRecord()
entry.type = vtByte
entry.description = "Some kind of count? 2"
entry.address = stdOffset("25A0") .. "9D18"
entry.appendToEntry(header)

entry = alist.createMemoryRecord()
entry.type = vtByte
entry.description = "Some kind of count? 3"
entry.address = stdOffset("25A0") .. "9D1C"
entry.appendToEntry(header)

entry = alist.createMemoryRecord()
entry.type = vtByte
entry.description = "??? 1"
entry.address = stdOffset("25BA") .. "444C"
entry.appendToEntry(header)

entry = alist.createMemoryRecord()
entry.type = vtByte
entry.description = "??? 2"
entry.address = stdOffset("25BA") .. "444D"
entry.appendToEntry(header)

entry = alist.createMemoryRecord()
entry.type = vtByte
entry.description = "??? 3"
entry.address = stdOffset("25BA") .. "4450"
entry.appendToEntry(header)

entry = alist.createMemoryRecord()
entry.type = vtByte
entry.description = "??? 4"
entry.address = stdOffset("25BA") .. "4451"
entry.appendToEntry(header)

entry = alist.createMemoryRecord()
entry.type = vtByte
entry.description = "Equipped Paffet 1"
entry.address = stdOffset("262E") .. "1746"
entry.appendToEntry(header)

entry = alist.createMemoryRecord()
entry.type = vtByte
entry.description = "Equipped Paffet 2"
entry.address = stdOffset("262E") .. "1747"
entry.appendToEntry(header)

entry = alist.createMemoryRecord()
entry.type = vtByte
entry.description = "??? 3"
entry.address = stdOffset("262E") .. "175C"
entry.appendToEntry(header)

entry = alist.createMemoryRecord()
entry.type = vtByte
entry.description = "??? 1"
entry.address = stdOffset("264F") .. "DA8C"
entry.appendToEntry(header)

entry = alist.createMemoryRecord()
entry.type = vtByte
entry.description = "??? 2"
entry.address = stdOffset("264F") .. "DA91"
entry.appendToEntry(header)


flist.deinitialize()
flist.destroy()
scan.destroy()