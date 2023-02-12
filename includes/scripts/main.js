// BEHOLD YE MIGHTY AND DESPAIR

const data = {};

function getFromByName(array, name){
    return array.filter(o => o.name == name)[0]
}

function idFix(name){
    return name.replaceAll(" ", "_");
}

var dataFetched = Promise.allSettled([
    $.get("./data/area.json").then(res => data.area = res.area),
    $.get("./data/item.json").then(res => data.item = res.item),
    $.get("./data/mis.json").then(res => data.mis = res.mis),
    $.get("./data/paffet.json").then(res => data.paffet = res.paffet),
    $.get("./data/quest.json").then(res => data.quest = res),
]);

$(async () => {
    await dataFetched;
    loadPaffetTab();
    loadMISTab();
    loadItemTab();
    loadAreaTab();
    loadQuestTab();
    $(".journal-expander").click(() => {
        if($(".journal-col").hasClass("no-display")){
            $(".journal-expander").html("▶");
            $(".journal-col").removeClass("no-display");
        }
        else {
            $(".journal-expander").html("◀");
            $(".journal-col").addClass("no-display");
        }
    });
    $(".hidden-template").remove();
});

function bindReferenceElement(element){
    $(element).on("click", (event) => {
        const tabTarget = $(event.currentTarget).attr("data-tab") + "-tab";
        const finalTarget = $(event.currentTarget).attr("href");
        $("#"+tabTarget).click();
        console.log(finalTarget);
        document.querySelector(finalTarget)
            .scrollIntoView();
        $(finalTarget).addClass("selected");
        setTimeout(() => {
            console.log("removing");
            $(finalTarget).removeClass("selected");
        }, 200);
    });
}

function referenceMIS(mis){
    var el = $("#mis-ref-template").clone();
    el.removeAttr("id");
    el.removeClass("hidden-template");
    $(".mis-image", el).attr("src", "images/"+mis.image);
    $("a", el).attr("href", "#mis-"+idFix(mis.name));
    bindReferenceElement($("a", el));
    return el;
}

function referencePaffet(paffet){
    var el = $("#paffet-ref-template").clone();
    el.removeAttr("id");
    el.removeClass("hidden-template");
    $(".paffet-image", el).attr("src", "images/"+paffet.image);
    $("a", el).attr("href", "#paffet-"+idFix(paffet.name));
    bindReferenceElement($("a", el));
    return el;
}

function referenceItem(item){
    var el = $("#item-ref-template").clone();
    el.removeAttr("id");
    el.removeClass("hidden-template");
    $(".item-image", el).attr("src", "images/"+item.image);
    $("a", el).attr("href", "#item-"+idFix(item.name));
    bindReferenceElement($("a", el));
    return el;
}

function referenceArea(area){
    var el = $("#area-ref-template").clone();
    el.removeAttr("id");
    el.removeClass("hidden-template");
    $(".area-name", el).html(area.name);
    $("a", el).attr("href", "#area-"+idFix(area.name));
    bindReferenceElement($("a", el));
    return el;
}

function tooltipImage(el, array){
    var parent = $(".tooltip-data", el);
    if(array.length == 0) {
        parent.remove();
    }
    else {
        array.forEach(obj => {
            var ttdiv = $("#quickref-image").clone();
            ttdiv.removeAttr("id");
            ttdiv.removeClass("hidden-template");
            $("img", ttdiv).attr("src", "images/"+obj.image);
            parent.append(ttdiv);
        });
    }
    return el;
}

function tooltipText(el, array){
    var parent = $(".tooltip-data", el);
    if(array.length == 0) {
        parent.remove();
    }
    else {
        array.forEach(obj => {
            var ttdiv = $("#quickref-text").clone();
            ttdiv.removeAttr("id");
            ttdiv.removeClass("hidden-template");
            $("span", ttdiv).html(obj.name);
            parent.append(ttdiv);
        });
    }
    return el;
}

function loadPaffetTab(){
    data.paffet.forEach(paffet => {
        var el = $("#paffet-template").clone();
        el.attr("id", "paffet-"+idFix(paffet.name));
        el.removeClass("hidden-template");
        $(".paffet-name", el).html(paffet.name);
        $(".paffet-image", el).attr("src", "images/"+paffet.image);
        paffet.mis.forEach(misName => {
            const mis = getFromByName(data.mis, misName);
            const items = data.item.filter(i => i.mis.includes(mis.name));
            $(".paffet-recipe", el).append(tooltipImage(referenceMIS(mis), items));
        });
        $("#paffet-tab-pane").append(el);
    });
}

function loadMISTab(){
    data.mis.forEach(mis => {
        var el = $("#mis-template").clone();
        el.attr("id", "mis-"+idFix(mis.name));
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
                const areas = data.area.filter(a => a.items.includes(item.name));
                $(".mis-items", el).append(tooltipText(referenceItem(item), areas));
            });
        data.paffet
            .filter(p => p.mis.includes(mis.name))
            .forEach(p => {
                var misObjects = p.mis.map(m => getFromByName(data.mis, m));
                $(".mis-paffets", el).append(tooltipImage(referencePaffet(p), misObjects));
            });

        $("#mis-tab-pane").append(el);
    });
}

function loadItemTab(){
    data.item.forEach(item => {
        var el = $("#item-template").clone();
        el.attr("id", "item-"+idFix(item.name));
        el.removeClass("hidden-template");
        $(".item-name", el).html(item.name);
        $(".item-image", el).attr("src", "images/"+item.image);
        item.mis.forEach(misName => {
            const mis = getFromByName(data.mis, misName);
            const paffets = data.paffet.filter(p => p.mis.includes(mis.name));
            $(".item-mis", el).append(tooltipImage(referenceMIS(mis), paffets));
        })
        data.area
            .filter(a => a.items.includes(item.name))
            .forEach(area => {
                var itemObjects = area.items.map(m => getFromByName(data.item, m));
                $(".item-areas", el).append(tooltipImage(referenceArea(area), itemObjects));
            });


        $("#items-tab-pane").append(el);
    });
}

function loadQuestTab(){

}

function loadAreaTab(){

}
