$(function() {
    var body = $('body'),
        formWrap = $('.form-wrapper'),
        boolenTrue = false,
        num_pattern = /[^.0-9]/g,
        reg_date_pattern = /[^-0-9]/g,
        email_patern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;

    notEmpti('.required');

    function notEmpti(elem) {
        body.on('blur', elem, function(){
            if ($(this).val() == '') {
                $(this).parent().addClass('has-error');
            } else if ($(this).val() != '' && $(this).parent().hasClass('has-error')) {
                $(this).parent().removeClass('has-error');
            }
        });
    }

    body.on('blur', '#email', function(){
        var email = $(this).val();
        if (email_patern.test(email)) {
            if ($(this).parent().hasClass('has-error')) {
                $(this).parent().removeClass('has-error');
            }
        } else {
            $(this).parent().addClass('has-error');
        }
    });

    //регулярные вырожения для проверки полей ввода
    body.on('keyup', '#sum, #period, #percent', function() {
        $(this).val($(this).val().replace(num_pattern, ""));
    });
    body.on('keyup', '#reg_date', function() {
        var thisVal = $(this).val();

        $(this).val($(this).val().replace(reg_date_pattern, ""));
        if (thisVal.length == 4 || thisVal.length == 7) {
            $(this).val(thisVal + '-');
        }
    });
    
    body.on('click', '#or-reg', function(e){
        e.preventDefault();
        formWrap.load('../templates/registration-form.php');
    });

    body.on('click', '#forgot-pass', function(e){
        e.preventDefault();
        formWrap.load('../templates/forgot-pass-form.php');
    });
    
    body.on('click', '#back-signin', function(e){
        e.preventDefault();
        formWrap.load('../templates/signin-form.php');
    });


    //регистрация
    body.on('click', '#submit', function(e) {
        e.preventDefault();

        var regPass = $(this).closest('form').find('#pass'),
            regPass1 = $(this).closest('form').find('#pass1'),
            model = $('#form-reg').serialize(),
            elem = $(this);

        if (regPass.val() != regPass1.val()) {
            regPass1.parent().addClass('has-error');
            var header = 'Пароль не совпадает!',
                dec = 'dangerous';
            loadAlert(dec, header);
        }

        validNoEmpty(elem);
        if (boolenTrue == true) {
            return false;
        }

        $.ajax({
            url: '../ajax/registration.php',
            type: 'POST',
            cache: false,
            data: model,
            dataType: 'text',
            success: function(response) {
                var data = $.parseJSON(response);
                raSuccess(data);
            },
            error: function() {
                ajaxError();
            }
        });
    });

    //проверка уникальности email и login при регистрации
    function checkLoginEmail(elem, data) {
        if (data.disabled == true) {
            elem.parent().addClass('has-error')
                .end().siblings('.text-help').text(data.text)
                .end().closest('#form-reg').find('#submit').prop('disabled', true);
        } else {
            elem.parent().removeClass('has-error')
                .end().siblings('.text-help').text('')
                .end().closest('#form-reg').find('#submit').prop('disabled', false);
        }
    }
    body.on('change', '#form-reg #name', function(){
        var elem = $(this),
            elemVal = elem.val(),
            model = 'name='+elemVal;

        $.ajax({
            url: '../ajax/checkLogin.php',
            type: 'POST',
            cache: false,
            data: model,
            dataType: 'text',
            success: function(response) {
                var data = $.parseJSON(response);
                checkLoginEmail(elem, data);
            }
        });
    });
    body.on('change', '#form-reg #email', function(){
        var elem = $(this),
            elemVal = elem.val(),
            model = 'email='+elemVal;

        $.ajax({
            url: '../ajax/checkEmail.php',
            type: 'POST',
            cache: false,
            data: model,
            dataType: 'text',
            success: function(response) {
                var data = $.parseJSON(response);
                checkLoginEmail(elem, data);
            }
        });
    });

    function ajaxError() {
        $('.load-cont').load('../templates/alert.php', function(){
            $('.alert-wrap').addClass('dangerous');
            $('.alert-wrap h4').text('При выполнении запроса произошла ошибка!');
            setTimeout(function(){
                $('.alert-wrap').fadeOut();
            }, 1500);
        });
    }

    function loadAlert(dec, header, message) {
        $('.load-cont').load('../templates/alert.php', function(){
            $('.alert-wrap').addClass(dec);
            $('.alert-wrap h4').text(header);
            $('.alert-wrap p').text(message);
            setTimeout(function(){
                $('.alert-wrap').fadeOut();
            }, 1500);
        });
    }

    function loadConfirm(dec, header, message, btnLeft, btnRight) {
        $('.load-cont').load('../templates/confirm.php', function(){
            $('.modal').addClass(dec);
            $('.modal-title').text(header);
            $('.modal-body p').text(message);
            $('#btn-no').text(btnLeft);
            $('#btn-yes').text(btnRight);
        });
    }

    //функция проверки пустое ли поле при нажатии на кнопку
    function validNoEmpty(elem) {
        var requiresElem = elem.closest('form').find('.required');
        requiresElem.each(function() {
            if ($(this).val() == '') {
                $(this).parent().addClass('has-error');
            }
        });
        if ($('.has-error').length > 0) {
            boolenTrue = true;
        } else {
            boolenTrue = false;
        }
        return boolenTrue;
    }


    //авторизация
    body.on('click', '#signin', function(e) {
        e.preventDefault();
        var model = $('#form-signin').serialize(),
            elem = $(this);

        validNoEmpty(elem);
        if (boolenTrue == true) {
            return false;
        }

        $.ajax({
            url: '../ajax/autorization.php',
            type: 'POST',
            cache: false,
            data: model,
            dataType: 'text',
            success: function(response) {
                var data = $.parseJSON(response);
                raSuccess(data);
            },
            error: function() {
                ajaxError();
            }
        });
    });

    //отправка письма для смены пароля
    body.on('click', '#recall-pass', function() {
        var model = $('#form-recall-pass').serialize(),
            elem = $(this);

        validNoEmpty(elem);
        if (boolenTrue == true) {
            return false;
        }

        $.ajax({
            url: '../ajax/recall-pass.php',
            type: 'POST',
            cache: false,
            data: model,
            dataType: 'text',
            success: function(response) {
                var data = eval("(" + response + ")");
                $('.load-cont').load('../templates/alert.php', function () {
                    $('.alert-wrap').addClass(data.class);
                    $('.alert-wrap h4').text(data.text);
                    $('.alert-wrap p').text(data.message);
                    setTimeout(function () {
                        $('.alert-wrap').fadeOut();
                    }, 1500);
                    setTimeout(function () {
                        formWrap.load('../templates/signin-form.php');
                        $('head title').text('Вход | регистрация');
                    }, 2000);
                });
            },
            error: function() {
                ajaxError();
            }
        });
    });

    //смена пароля
    body.on('click', '#change-pass', function(e) {
        e.preventDefault();
        var name = $(this).closest('form').find('#name').val(),
            regPass = $(this).closest('form').find('#pass'),
            regPass1 = $(this).closest('form').find('#pass1'),
            model = 'name='+name+'&pass='+regPass.val(),
            elem = $(this);

        if (regPass.val() != regPass1.val()) {
            regPass1.parent().addClass('has-error');
            var header = 'Пароль не совпадает!',
                dec = 'dangerous';
            loadAlert(dec, header);
        }

        validNoEmpty(elem);
        if (boolenTrue == true) {
            return false;
        }

        $.ajax({
            url: '../ajax/change-pass.php',
            type: 'POST',
            cache: false,
            data: model,
            dataType: 'text',
            success: function(response) {
                var data = $.parseJSON(response);
                console.log(data);
                $('.load-cont').load('../templates/alert.php', function(){
                    $('.alert-wrap').addClass(data.class);
                    $('.alert-wrap h4').text(data.text);
                    setTimeout(function(){
                        $('.alert-wrap').fadeOut();
                    }, 1500);
                    setTimeout(function(){
                        window.location.href = "/";
                    }, 2500);
                });
            },
            error: function() {
                ajaxError();
            }
        });
    });


    function raSuccess(data) {
        $('.load-cont').load('../templates/alert.php', function(){
            $('.alert-wrap').addClass(data.class);
            $('.alert-wrap h4').text(data.text);
            $('.alert-wrap p').text(data.message);
            setTimeout(function(){
                $('.alert-wrap').fadeOut();
            }, 1500);
            if (data.class == 'success') {
                loadMainCont();
            }
        });
    }

    function loadMainCont() {
        setTimeout(function(){
            $('.wrapper').load('../templates/main.php');
            $('head title').text('Личный кабинет - мой банкир');
        }, 2000);
    }

    function responsSuccessWithModal(obj) {
        $('.load-cont').load('../templates/alert.php', function(){
            $('.alert-wrap').addClass(obj.class);
            $('.alert-wrap h4').text(obj.text);
            setTimeout(function(){
                $('.alert-wrap').fadeOut();
                $('.modal').fadeOut();
            }, 1500);
        });
    }

    body.on('click', '.alert-close', function() {
        $('.alert-wrap').fadeOut();
    });


    /*
    * страница пользователя с его депозитами и кредитами
    * */
    //нажатие на кнопку "Добавить депозит"
    body.on('click', '#add-dep', function(){
        $('#user').val($('.main-header .user').text());
        $('#data-table').val('deposits');
        $('.modal-title').text("Добавить депозит");
        $('label[for="sum"]').text("Сумма депозита");
        $('#add').text("Добавить депозит");
        $('.modal').show();
    });

    //нажатие на кнопку "Добавить кредит"
    body.on('click', '#add-credit', function(){
        $('#user').val($('.main-header .user').text());
        $('#data-table').val('credits');
        $('.modal-title').text("Добавить кредит");
        $('label[for="sum"]').text("Сумма кредита");
        $('#add').text("Добавить кредит");
        $('.modal').show();
    });

    //закрытие модального окна
    body.on('click', '.close, #cancel, #btn-no', function(){
        $(this).closest('.modal').hide();
    });

    //нажатие на кнопку добавить запись
    body.on('click', '#add', function(e) {
        e.preventDefault();
        var model = $('#modal-form').serialize(),
            typeTable = $('#data-table').val(),
            elem = $(this);

        validNoEmpty(elem);
        if (boolenTrue == true) {
            return false;
        }

        $.ajax({
            type: 'POST',
            url: '../ajax/add.php',
            cache: false,
            dataType: 'text',
            data: model,
            success: function(response) {
                var obj = $.parseJSON(response),
                    elem = "<tr><td><input type='text' hidden value='"+obj.id+"'>" +
                    "<span>"+obj.name_bank+"</span></td>" +
                    "<td>"+obj.sum+"</td><td>"+obj.period+"</td>" +
                    "<td>"+obj.percent+"</td><td>"+obj.reg_date+"</td>" +
                    "<td><button class='btn btn-block btn-default btn-xs edit has-tultip' type='button' data-tultip='Изменить запись'><i class='glyphicon glyphicon-edit'></i></button></td>" +
                    "<td><button class='btn btn-block btn-default btn-xs trash has-tultip' type='button' data-tultip='Удалить запись'><i class='glyphicon glyphicon-trash'></i></button></td></tr>";

                responsSuccessWithModal(obj);
                if ($('.'+typeTable+' .not-data').length > 0) {
                    $('.'+typeTable+' .not-data').parent().remove();
                }
                $('.'+typeTable+'').append(elem);
            },
            error: function() {
                ajaxError();
            }
        });
    });


    //нажатие на кнопку "удаление записи"
    var delRecordObg = {};
    body.on('click', '.trash', function() {
        var thisTR = $(this).closest('tr'),
            dec = 'remove-record modal-danger',
            header = 'Удаление записи!',
            message = 'Вы действительно хотите удалить запись и все связанные с ней данные?',
            btnLeft = 'Отмена',
            btnRight = 'Удалить';

        delRecordObg.table = typeTable = thisTR.closest('.table').data('table');
        delRecordObg.id = thisTR.find('input[type="text"]').val();

        loadConfirm(dec, header, message, btnLeft, btnRight);
        console.log(delRecordObg);
        return delRecordObg;
    });
    //подтверждение удаления записи
    body.on('click', '.remove-record #btn-yes', function() {
        var model = 'recordToDelete='+delRecordObg.id+'&typeTable='+delRecordObg.table,
            thisTR = $('.'+delRecordObg.table+'').find('input[value="'+delRecordObg.id+'"]').closest('tr');
        console.log(model);
        console.log(thisTR);
        $.ajax({
            type: 'POST',
            url: '../ajax/delete.php',
            cache: false,
            dataType: 'text',
            data: model,
            success: function(response) {
                if (thisTR.siblings().not('.removed').length > 1) {
                    thisTR.addClass('removed').fadeOut();
                } else {
                    thisTR.html("<td colspan='7' class='text-center not-data'>У вас нет данных!</td>");
                }

                var obj = $.parseJSON(response);
                responsSuccessWithModal(obj);
            },
            error: function (){
                ajaxError();
            }
        });
    });
    body.on('click', '.remove-record #btn-no', function() {
        delRecordObg = {};
        console.log(delRecordObg);
        $(this).closest('.modal').fadeOut();
        return delRecordObg;
    });

    //нажатие на кнопку "редактировать"
    body.on('click', '.edit', function() {
        var thisTR = $(this).closest('tr'),
            idRecord = thisTR.find('input[type="text"]').val(),
            name_bank = thisTR.find('td').eq(0).find('span').text(),
            sum = thisTR.find('td').eq(1).text(),
            period = thisTR.find('td').eq(2).text(),
            percent = thisTR.find('td').eq(3).text(),
            reg_date = thisTR.find('td').eq(4).text();

        thisTR.addClass('id-'+idRecord);
        $('#modal-form').data('data-id', idRecord);
        $('#name_bank').val(name_bank);
        $('#sum').val(sum);
        $('#period').val(period);
        $('#percent').val(percent);
        $('#reg_date').val(reg_date);

        if($(this).closest('.table').data('table') == 'deposits') {
            $('#data-table').val('deposits');
            $('.modal-title').text("Изменение депозита");
            $('label[for="sum"]').text("Сумма депозита");
        } else {
            $('#data-table').val('credits');
            $('.modal-title').text("Изменение кредита");
            $('label[for="sum"]').text("Сумма кредита");
        }
        $('button[type="submit"]').attr('id', 'update').text("Сохранить");
        $('.modal').show();
    });

    //нажатие на кнопку "сохранить" изменения после редактирования (на модальном окне)
    body.on('click', '#update', function(e) {
        e.preventDefault();
        var typeTable = $('#data-table').val(),
            id = $('#modal-form').data('data-id'),
            thisTR = $('.'+typeTable+'').find('.id-'+id+''),
            name_bank = $('#name_bank').val(),
            sum = $('#sum').val(),
            period = $('#period').val(),
            percent = $('#percent').val(),
            reg_date = $('#reg_date').val(),
            myData = 'id='+id+'&table='+typeTable+'&bank='+name_bank+'&sum='+sum+'&period='+period+'&percent='+percent+'&reg_date='+reg_date,
            elem = $(this);

        validNoEmpty(elem);
        if (boolenTrue == true) {
            return false;
        }

        $.ajax({
            type: 'POST',
            url: '../ajax/update.php',
            cache: false,
            dataType: 'text',
            data: myData,
            success: function(response) {
                thisTR.find('td').eq(0).find('span').text(''+name_bank+'');
                thisTR.find('td').eq(1).text(''+sum+'');
                thisTR.find('td').eq(2).text(''+period+'');
                thisTR.find('td').eq(3).text(''+percent+'');
                thisTR.find('td').eq(4).text(''+reg_date+'');

                var obj = $.parseJSON(response);
                responsSuccessWithModal(obj);
            },
            error: function (){
                ajaxError();
            }
        });
    });
});