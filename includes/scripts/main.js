// BEHOLD YE MIGHTY AND DESPAIR

const data = {};

class countedObj {
    constructor(obj, count) {
        this.obj = obj;
        this.count = count;
    }
}

class countedList {
    constructor(){
        this.list = [];
    }

    add(obj, val=1){
        var add = this.list.filter((cobj) => cobj.obj == obj);
        if(add.length != 0){
            add[0].count += val;
        }
        else {
            this.list.push(new countedObj(obj, val));
        }
        return this;
    }

    remove(obj, val=-1){
        return this.add(obj, val);
    }

    clean(){ this.list = this.list.filter((cobj) => cobj.count != 0); return this; }

    sort(fn){
        this.list.sort(fn); return this;
    }

    forEach(fn) { this.list.forEach(fn); }
}

class set {
    constructor() {
        this.list = [];
    }

    add(obj){
        if(!this.list.includes(obj)){
            this.list.push(obj);
        }
        return this;
    }

    remove(obj){
        var ix = this.list.indexOf(obj);
        if(ix > -1){
            this.list.splice(ix, 1);
        }
        return this;
    }

    sort(fn){
        this.list.sort(fn); return this;
    }

    forEach(fn) { this.list.forEach(fn); return this;}
}

const journal = {
    mis : new countedList(),
    paffet : new set(),
    item : new countedList(),
};

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
    //$(".hidden-template").remove();
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

function bindJAdd(el, list, obj){
    $(".journal-add", el).on("click", () => {
        list.add(obj);
        reloadJournal();
    });
}

function bindJRemove(el, list, obj){
    $(".journal-remove", el).on("click", () => {
        list.remove(obj);
        reloadJournal();
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

function tooltipRemove(el){
    $(".tooltip-data", el).remove();
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
        bindJAdd(el, journal.paffet, paffet);
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
        bindJAdd(el, journal.mis, mis);
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
        bindJAdd(el, journal.item, item);
        $("#items-tab-pane").append(el);
    });
}

function loadQuestTab(){

}

function loadAreaTab(){

}

function countedRef(refEl, count){
    var el = $("#counter-template").clone();
    el.removeAttr("id");
    el.removeClass("hidden-template");
    $(".ref-holder", el).append(refEl);
    $(".counter-value", el).html(count);
    if(count < 0){
        $(".counter-value", el).addClass("negative");
    }
    return el;
}

function setRef(refEl) {
    var el = $("#set-template").clone();
    el.removeAttr("id");
    el.removeClass("hidden-template");
    $(".ref-holder", el).append(refEl);
    return el;
}

function reloadJournal(){
    $("#mis-list").empty();
    $("#paffet-list").empty();
    $("#item-list").empty();
    journal.mis.clean();
    journal.item.clean();

    var misList = new countedList();

    journal.mis.forEach((countedMis) => {
        misList.add(countedMis.obj, countedMis.count);
    })
    // paffets are uncounted. you can only have 1 or 0.
    journal.paffet
        .sort((a, b) => data.paffet.indexOf(a) - data.paffet.indexOf(b))
        .forEach((paffet) => {
        var misObjects = paffet.mis.map(m => getFromByName(data.mis, m));
        misObjects.forEach((mis) => misList.remove(mis));
        var newEl = setRef(tooltipImage(referencePaffet(paffet), misObjects));
        bindJRemove(newEl, journal.paffet, paffet);
        $("#paffet-list").append(newEl);
    });
    journal.item
        .sort((a, b) => data.item.indexOf(a.obj) - data.item.indexOf(b.obj))
        .forEach((countedItem) => {
        var item = countedItem.obj;
        var count = countedItem.count;
        var misObjects = item.mis.map(m => getFromByName(data.mis, m));
        misObjects.forEach((mis) => misList.add(mis, count));
        var newEl = countedRef(tooltipImage(referenceItem(item), misObjects), count);
        bindJAdd(newEl, journal.item, item);
        bindJRemove(newEl, journal.item, item);
        $("#item-list").append(newEl);
    });

    misList
        .sort((a, b) => data.mis.indexOf(a.obj) - data.mis.indexOf(b.obj))
        .forEach((countedMis) => {
        var mis = countedMis.obj;
        var count = countedMis.count;
        var newEl = countedRef(tooltipRemove(referenceMIS(mis)), count);
        bindJAdd(newEl, journal.mis, mis);
        bindJRemove(newEl, journal.mis, mis);
        $("#mis-list").append(newEl);
    });
    

}