(function( $ ){

    $.fn.compare = function(start_pos) {

        return this.each(function(start_pos) {

            var $this = $(this);

            var element = this;

            var compare_before = $this.find('.compare_before');


            //Задаем ширину и высоту родительского блока, относительно параметров изображения
            $this.width( compare_before.width() ).height( compare_before.height() );

            var separator = '<div class="compare_separator">'+

                    '<span class="arrow top_arrow"></span>'+
                    '<span class="line"></span>'+
                    '<span class="arrow bottom_arrow"></span>'+

                '</div>';

            //Добавляем разделитель
            if( $this.prepend(separator) ) {



            }


            //Оборачиваем второе изображение в блок
            compare_before.wrap('<div class="moved_block"></div>');

            //Двигаем мышью
            function go_position(e, x) {

                //Позиция compare блока на странице
                var r = element.getBoundingClientRect();

                //Mobile touch detect
                if( event.targetTouches ) {

                    var touch = event.targetTouches[0];
                    var event_x = touch.pageX;

                } else {

                    var event_x = e.clientX;

                }


                //Насколько переместилась мышь влево от левого края блока compare
                if( x === false || x === undefined ) var left = event_x - r.left;
                else var left = x;

                var separator = $(element).find(".compare_separator");

                //Двигаем разделитель и блок обрезки
                if( left >= 0 && left <= $(element).width() && ( left - separator.width()/2 > 0 ) && ( left < $(element).width() - separator.width() / 2) ) {


                    $(element).find(".moved_block").css({"left": left+'px'});


                    separator.css({"left": left - separator.width()/2 + 'px'});
                    compare_before.css({"left": -left+"px"});

                //Защита от дурака
                } else if( left < 0 ) {

                    $(element).find(".moved_block").css({"left": 0+'px'});
                    separator.css({"left": '0px'});
                    compare_before.css({"left": 0+"px"});

                } else if( left > $(element).width() || ( left >= $(element).width() - separator.width())  ) {

                    $(element).find(".moved_block").css({"left": $(element).width()+'px'});
                    separator.css({"left": $(element).width() - separator.width() + 'px'});
                    compare_before.css({"left": -$(element).width()+"px"});



                }


                //Показываем достижение рабивки яйца

                if( left > $(element).width() / 2 ) {

                    if( !attainment ) {

                        attainment = true;
                        message( "Поздравляем!",  "Вы открыли новое достижение - 'Гроза Яиц'" );


                    }

                }

            }

            //Функция посредник, для передачи данных
            var move_separator = function(e) {

                go_position(e, false);

            }

            //Функция привязки событий
            var bind_move = function() {
                $(document).bind('mousemove touchmove', move_separator);
            }

            //Отвязываем события когда отпускаем левую кнопку мыши
            var unbind_move = function() {
                $(document).unbind('mousemove touchmove', move_separator);
            }

            //Mobile touch



            $($this.find(".compare_separator")).bind("mousedown touchstart", bind_move);
            $(document).bind("mouseup touchend", unbind_move);

            //При клике по блоку compare перемещаем на соответсвующую позицию
            $(element).bind("click", function(e) {
                go_position(e);
            });


            //Отцентровка
            if( start_pos === undefined ) var start_pos = $(element).width() / 2;
            else var start_pos = ( start_pos + 1 ) /100 * $(element).width();

            go_position(false, start_pos );

        })
    }
})( jQuery );


// Возвращает случайное целое число между min (включительно) и max (не включая max)
function getRandomInt(min, max) {
    ++max;
    return Math.floor(Math.random() * (max - min)) + min;

}

function _scrollTop() {

    return $("body").scrollTop() ? $("body").scrollTop() : $("html").scrollTop();

}

//Popup
$(document).on("click", ".popup-dialog-wrapper", function(e) {

    if( $(e.target).hasClass('popup-dialog-wrapper') ) bn_dialogClose(this);
    else return false;

});

//Закрываем PopUp
//Или удаляем, если deleteDialog = true
function bn_dialogClose( dialog, deleteDialog) {

    if( typeof dialog == 'string') var dialog = $(dialog);
    else if( typeof dialog == 'object' && $(dialog).hasClass("popup-dialog-wrapper") ) var dialog = $(dialog);
    else if( typeof dialog == 'object' ) var dialog = $(dialog).parents(".popup-dialog-wrapper");
    else var dialog = $(".popup-dialog-wrapper");



    dialog.css({"display":"flex"}).fadeOut(100, function() {

        if( !$(".popup-dialog-wrapper:visible").length ) $("body").css({"overflow":"auto"});
        dialog.removeClass("bn-active-dialog");

        if( deleteDialog ) dialog.remove();

    });



}

//Показываем PopUp
function bn_dialogShow(dialog) {

    $("body").css({"overflow":"hidden"});

    if( typeof dialog == 'string') var dialog = $(dialog);
    else if( typeof dialog == 'object' && $(dialog).hasClass("popup-dialog-wrapper") ) var dialog = $(dialog);
    else if( typeof dialog == 'object' ) var dialog = $(dialog).parents(".popup-dialog-wrapper");
    else var dialog = $(".popup-dialog-wrapper");

    dialog.css({"display":"flex"}).fadeIn(500);
    dialog.addClass("bn-active-dialog");


}



//Показываем сообщение
function message( title,  text, time ) {

    var time = time ? time : 3000;
    var a = $("#bn-message_content");

    if( !a.length ) {

        $("body").append('<div id="bn-message_content" class="bn-message_content"></div>');

    }

    var b = $(".bn-message").length + 1;

    $("#bn-message_content").prepend('<div id="bn-message-'+b+'" class="bn-message clear"> <div class="message-container"> <div class="bn-message-img"></div> <div class="right-side"> <div class="title">'+title+'</div> <div class="text">'+text+'</div> </div> </div> </div>');
    $("#bn-message-"+b).slideDown(300);

    setTimeout("hide_message("+b+")", time);

}

//Прячем сообщение по таймеру
function hide_message(id) {

    var a = $("#bn-message-"+id);
    a.slideUp(300, function() { a.remove(); });

}




/*
    Разбиваем яйцо
 */

//Количество ударов по яйцу :D
var strikes = 0;
var max_strike = 5;
var attainment = false;
var preventEggClick = {};


//Добавляем трещины
function break_an_egg(t, e) {

    ++strikes;

    if( strikes > max_strike ) return;
    if( strikes == max_strike ) {

        bn_dialogShow("#popup-cleaning");

        $('#cleaning_egg').compare(1);
        e.stopPropagation();
        return;

    }

    var egg = $(t);

    var pageX = e.clientX;
    var pageY = e.clientY;
    var rect = t.getBoundingClientRect();


    if( strikes > 1 && preventEggClick[strikes-1].x == pageX && preventEggClick[strikes-1].y == pageY ) {

        var x_max = egg.width() - 80;
        var y_max = egg.height() - 80;

        var crack_X = getRandomInt(0, x_max);
        var crack_Y = getRandomInt(0, y_max);

        console.log( pageX +" "+pageY );

    }

    preventEggClick[strikes] = {x: pageX, y: pageY};

    //console.log( pageY +' '+rect.top );

    if( !crack_X ) var crack_X = Number( pageX ) - Number( rect.left ) -55;
    if( !crack_Y ) var crack_Y = Number( pageY ) - Number( rect.top ) - 50;


    egg.append('<div class="crack" style="left: '+ crack_X +'px; top: '+ crack_Y +'px;background-image: url(assets/img/crack/crack'+getRandomInt(1, 3)+'.png)"></div>');



}


//Стукам по яйцу
$(document).on("mousedown", "#cleaning_egg", function() {

    if( strikes >= max_strike ) return;

    $(this).css({"top": "5px"});

}).on("mouseup", "#cleaning_egg", function() {

    if( strikes >= max_strike ) return;

    $(this).css({"top": "0"});

});


//Отзывы
function leafRev( target ) {


    var wrapper = $(".reviews_wrap");
    var activeRev = $(".reviews__item-active");

    if( target == "next" ) var t = wrapper.find(".reviews__item_next");
    else var t = wrapper.find(".reviews__item_prev");





    var nextRev = t.next(".reviews__item");
    var nextRev = nextRev.length ? nextRev : wrapper.find(".reviews__item:first");

    var prevRev = t.prev(".reviews__item");
    var prevRev = prevRev.length ? prevRev : wrapper.find(".reviews__item:last-child");

    $(".reviews__item").removeClass("reviews__item_prev reviews__item_next reviews__item-active");

    t.addClass("reviews__item-active");

    prevRev.addClass("reviews__item_prev");
    nextRev.addClass("reviews__item_next");


}

//Section navigation
var scrooling_flag = false;
function goSection( id, t ) {

    $(".top_menu__container").removeClass("top_menu__container-active");

    scrooling_flag = true;
    var _this = $(t);
    var section = $(id);

    var pageY = section.offset().top;

    $("html, body").stop().animate({scrollTop: pageY }, 500, 'swing', function() {

        scrooling_flag = false;

    });


}

var callBacks = {};

callBacks["showCleaningInstr"] = function showCleaningInstr() {

    setTimeout(function() {

        var scrollTop = _scrollTop();
        var cleaning = $("#cleaning");

        if( scrollTop > cleaning.offset().top + cleaning.height() || scrollTop + window.screen.height < cleaning.offset().top ) {


            cleaning.removeClass("animated");

        } else {

            bn_dialogShow("#popup-crack");
            goSection("#cleaning_egg");

        }



    }, 1000);

}

//Animate blocks when scrolling
var section_an_w_s = $("*[animation-when-scrolling]");

$(window).scroll(function () {

    var scrollTop = _scrollTop();

    section_an_w_s.each(function() {

        var _this = $(this);


        if( !scrooling_flag && !_this.hasClass("animated")  &&    (  _this.offset().top < scrollTop + window.screen.height )  ) {

            _this.addClass("animated");

            var callBack = _this.attr("call-back");

            if( callBack ) {

                callBacks[callBack]();

            }

        }

    })

});



//Левое меню
$(".top_menu__trigger").on("click", function () {

    $(".top_menu__container").toggleClass("top_menu__container-active");

});



$(document).ready(function() {

   var hash = window.location.hash;
   if( hash ) goSection( hash );

});