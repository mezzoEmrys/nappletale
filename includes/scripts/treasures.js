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
    
}

$(async () => {
    await dataFetched;
    data.area.map(o => makeOption(o)).forEach(o => $("#areas").append(o));
    data.paffet.map(o => makeOption(o)).forEach(o => $("#paffets").append(o));
    data.item.map(o => makeOption(o)).forEach(o => $("#items").append(o));

    $(".add-treasure").on("click", function(){
        var newEl = $("#treasure-template").clone();
        newEl.removeAttr("id");
        newEl.removeClass("hidden-template");
        newEl.insertBefore($(this).parent());
        $("input", newEl)[0].focus();
        $("#content-template", newEl).remove();

        $("input[list=drop-types]", newEl).on("change", function(){
            var val = $(this).val();
            if(val == "enemy") $("input[list=enemies]", newEl).show();
            else $("input[list=enemies]", newEl).hide();
        }).trigger("change");

        $(".add-content", newEl).on("click", function(){
            var newEl = $("#content-template").clone();
            newEl.removeAttr("id");
            newEl.removeClass("hidden-template");
            newEl.insertBefore($(this).parent());
            $("input", newEl)[0].focus();

            $("input[list=content-types]", newEl).on("change", function(){
                var val = $(this).val();
                if(val == "recipe") $("input[list=paffets]", newEl).show();
                else $("input[list=paffets]", newEl).hide();
                if(val == "item") $("input[list=items]", newEl).show();
                else $("input[list=items]", newEl).hide();
            }).trigger("change");

            $("input", newEl).on("change", updateJson);
        });
    });
    $(".add-treasure")[0].focus();
});