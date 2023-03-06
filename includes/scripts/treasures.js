
var dataFetched = Promise.allSettled([
    $.get("./data/area.json").then(res => data.area = res.area),
    $.get("./data/item.json").then(res => data.item = res.item),
    $.get("./data/mis.json").then(res => data.mis = res.mis),
    $.get("./data/paffet.json").then(res => data.paffet = res.paffet),
    $.get("./data/quest.json").then(res => data.quest = res),
]);

$(async () => {
    await dataFetched;

});