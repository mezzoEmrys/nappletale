var data = {};

var dataFetched = Promise.allSettled([
    $.get("../data/area.json").then(res => data.area = res.area),
    $.get("../data/item.json").then(res => data.item = res.item),
    $.get("../data/mis.json").then(res => data.mis = res.mis),
    $.get("../data/paffet.json").then(res => data.paffet = res.paffet),
    $.get("../data/quest.json").then(res => data.quest = res),
]);

function makeOption(value){
    return $("<option></option>").val(value.name).html(disName(value));
}

function disName(obj){
    return ("display_name_en" in obj ) ? obj.display_name_en : obj.name;
}

function updateJson(){
    var building = ""; // += is the fastest way to produce long strings, as it turns out
    $(".entry").each(function(ix, el) {
        building += '{\n';
        building += '  "area":"' + $("input[list=areas]", el).val() + '",\n';
        var target = $("input[list=drop-types]", el).val();
        building += '  "type":"' + target + '",\n';
        if(target == "enemy"){
            building += '  "enemy":"' + $("input[list=enemies]", el).val() + '",\n';
        }
        building += '  "description":"' + $("input[data-json-tag=description]", el).val() + '",\n';
        building += '  "contents":[\n'
        $(".content-entry", el).each(function (ix, el) {
            var target = $("input[list=content-types]", el).val();
            building += "    {\n";
            building += '    "type":"' + target + '",\n';
            if(target == "recipe"){
                building += '    "name":"' + $("input[list=paffets]", el).val() + '"\n';
            }
            else if (target == "item"){
                building += '    "name":"' + $("input[list=items]", el).val() + '"\n';
            }
            building += "    },\n";
        });
        building = building.slice(0, -2)+"\n";
        building += "  ]\n";
        building += '},\n';
    });

    $("#json").val("[\n" + building.trim().slice(0, -1) + "\n]");
}

function jsonToElements() {
    var str; 
    try{
        str = JSON.parse($("textarea").val());
    }
    catch(e){
        try {
            str = JSON.parse("[" + $("textarea").val() + "]");
        }
        catch(e){
            $.toast("Couldn't load data.");
            return;
        }
    }
    if(!Array.isArray(str)) {
        if("treasure" in str){
            str = str.treasure;
        }
        else
            str = [str];
    }

    console.log(str);

    $(".entry").remove();
    str.forEach(obj => createEntry($(".add-treasure"), obj));
}

function createEntry(context, obj = null) {
    var newEl = $("#treasure-template").clone();
    newEl.removeAttr("id");
    newEl.removeClass("hidden-template");
    newEl.addClass("entry");
    newEl.insertBefore($(context).parent());
    $("input", newEl)[0].focus();
    $("#content-template", newEl).remove();

    if(obj){
        $("[data-json-tag=area]", newEl).val(obj.area);
        $("[data-json-tag=type]", newEl).val(obj.type);
        $("[data-json-tag=enemy]", newEl).val(obj.enemy);
        $("[data-json-tag=description]", newEl).val(obj.description);

        obj.contents.forEach((val) => {
            createContent($(".add-content", newEl), val);
        });
    }

    $("input[list=drop-types]", newEl).on("change", function() {
        var val = $(this).val();
        if(val == "enemy") $("input[list=enemies]", newEl).show();
        else $("input[list=enemies]", newEl).hide();
    }).trigger("change");

    $(".add-content", newEl).on("click", function() {
        createContent(this);
    });

    $(".remove-entry", newEl).on("click", function() {
        $(this).closest('li').remove();
        updateJson();
    });

    $("input", newEl).on("change", updateJson);
}

function createContent(context, obj = null){
    var newEl = $("#content-template").clone();
    newEl.removeAttr("id");
    newEl.removeClass("hidden-template");
    newEl.addClass("content-entry");
    newEl.insertBefore($(context).parent());
    $("input", newEl)[0].focus();

    if(obj){
        var type = obj.type;
        $("[data-json-tag=type]", newEl).val(type);
        if(type == "recipe")
            $("input[list=paffets]", newEl).val(obj.name);
        if(type == "item")
            $("input[list=items]", newEl).val(obj.name);
    }

    $("input[list=content-types]", newEl).on("change", function() {
        var val = $(this).val();
        if(val == "recipe") $("input[list=paffets]", newEl).show();
        else $("input[list=paffets]", newEl).hide();
        if(val == "item") $("input[list=items]", newEl).show();
        else $("input[list=items]", newEl).hide();
    }).trigger("change");
    $("input", newEl).on("change", updateJson);
    $(".remove-entry", newEl).on("click", function() {
        $(this).closest('li').remove();
        updateJson();
    });
}

$(async () => {
    await dataFetched;
    data.area.map(o => makeOption(o)).forEach(o => $("#areas").append(o));
    data.paffet.map(o => makeOption(o)).forEach(o => $("#paffets").append(o));
    data.item.map(o => makeOption(o)).forEach(o => $("#items").append(o));

    $(".add-treasure").on("click", function() {
        createEntry(this);
    });
    $(".add-treasure")[0].focus();

    $("#copy").on("click", () => {
        $("#json").select();
        document.execCommand("copy");
        if (document.selection && document.selection.empty) 
        {
            document.selection.empty();
        } 
        else if (window.getSelection) 
        {
            var sel= window.getSelection();
            if(sel && sel.removeAllRanges)
                sel.removeAllRanges();
        }
        $.toast("Copied");
    });

    $("#load").on("click", () => {
        jsonToElements();
    });
});