// BEHOLD YE MIGHTY AND DESPAIR

const data = {};

var dataFetched = Promise.allSettled([
    $.get("./data/area.json").then(res => data.area = res.area),
    $.get("./data/item.json").then(res => data.item = res.item),
    $.get("./data/mis.json").then(res => data.mis = res.mis),
    $.get("./data/paffet.json").then(res => data.paffet = res.paffet),
    $.get("./data/quest.json").then(res => data.quest = res),
]);

$(async () => {
    await dataFetched;
    loadPaffetTab(data.paffet);
    loadMISTab(data.mis);
    $(".journal-expander").click(() => {
        if($(".journal-col").hasClass("no-display")){
            $(".journal-expander").html("▶");
            $(".journal-col").removeClass("no-display");
        }
        else {
            $(".journal-expander").html("◀");
            $(".journal-col").addClass("no-display");
        }
    })
});

function referenceMIS(misName){
    var mis = data.mis.filter(o => o.name == misName)[0];
    var el = $("#mis-ref-template").clone();
    el.removeAttr("id");
    el.removeClass("hidden-template");
    $(".mis-image", el).attr("src", "images/"+mis.image);
    return el;
}

function referencePaffet(paffetName){
    var paffet = data.paffet.filter(o => o.name == paffetName)[0];
    var el = $("#paffet-ref-template").clone();
    el.removeAttr("id");
    el.removeClass("hidden-template");
    $(".paffet-image", el).attr("src", "images/"+paffet.image);
    return el;
}

function referenceItem(itemName){
    var item = data.item.filter(o => o.name == itemName)[0];
    var el = $("#item-ref-template").clone();
    el.removeAttr("id");
    el.removeClass("hidden-template");
    $(".item-image", el).attr("src", "images/"+item.image);
    return el;
}

function loadPaffetTab(){
    data.paffet.forEach(paffet => {
        var el = $("#paffet-template").clone();
        el.attr("id", "paffet-"+paffet.name);
        el.removeClass("hidden-template");
        $(".paffet-name", el).html(paffet.name);
        $(".paffet-image", el).attr("src", "images/"+paffet.image);
        paffet.mis.forEach(misName => {
            $(".paffet-recipe", el).append(referenceMIS(misName));
        })
        $("#paffet-tab-pane").append(el);
    });
}

function loadMISTab(){
    data.mis.forEach(mis => {
        var el = $("#mis-template").clone();
        el.attr("id", "mis-"+mis.name);
        el.removeClass("hidden-template");
        if("display_name_en"in mis){
            $(".mis-name", el).html(mis.display_name_en);
        } else {
            $(".mis-name", el).html(mis.name);
        }
        $(".mis-image", el).attr("src", "images/"+mis.image);
        data.item
            .filter(i => i.mis.includes(mis.name))
            .forEach(item => {
            $(".mis-items", el).append(referenceItem(item.name));
            });
        data.paffet
            .filter(p => p.mis.includes(mis.name))
            .forEach(paffet => {
            $(".mis-paffets", el).append(referencePaffet(paffet.name));
            });

        $("#mis-tab-pane").append(el);
    });
}

function loadItemTab(){

}

function loadQuestTab(){

}

function loadAreaTab(){

}
