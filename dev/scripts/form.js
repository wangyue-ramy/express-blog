(function() {
    var loginBtn = document.getElementById('login');
    var regBtn = document.getElementById('register');

    if (loginBtn) {
        loginBtn.addEventListener('click', login);
    }

    if (regBtn) {
        regBtn.addEventListener('click', register);
    }

    (function() {
        var form = document.forms[0];
        var elements = form.elements;
        var password;
        for (var i = 0; i < elements.length; i++) {
            switch (elements[i].name) {
                case 'name':
                    elements[i].addEventListener('change', function() {
                        if (this.value.length < 6) {
                            this.parentElement.setAttribute('prompt', '用户名太短');
                        } else {
                            this.parentElement.setAttribute('prompt', '');
                        }
                    });
                    break;
                case 'password':
                    password = elements[i];
                    break;
                case 'password-confirm':
                    elements[i].addEventListener('keyup', function() {
                        if (this.value && this.value != password.value) {
                            this.parentElement.setAttribute('prompt', '两次密码不一致');
                        } else {
                            this.parentElement.setAttribute('prompt', '');
                        }
                    });
                    break;
                default:
                    return;
            }
        }
    })();


    function login(e) {
        e.preventDefault();
        var data = JSON.stringify(serialize(this.form));
        var formRow = document.getElementsByClassName('form-row');
        ajax('post', '/login', data, function(text) {
            switch (text.code) {
                case 1:
                    formRow[0].setAttribute('prompt', text.des);
                    formRow[1].setAttribute('prompt', '');
                    break;
                case 2:
                    formRow[1].setAttribute('prompt', text.des);
                    formRow[0].setAttribute('prompt', '');
                    break;
                default:
                    window.location.replace(window.location.protocol + '//' + window.location.host + text.redirect);
            }
        });
    }

    function register(e) {
        e.preventDefault();
        var data = JSON.stringify(serialize(this.form));
        var formRow = document.getElementsByClassName('form-row');
        ajax('post', '/reg', data, function(text) {
            switch (text.code) {
                case 1:
                    formRow[1].setAttribute('prompt', text.des);
                    formRow[0].setAttribute('prompt', '');
                    break;
                case 2:
                    formRow[0].setAttribute('prompt', text.des);
                    formRow[1].setAttribute('prompt', '');
                    break;
                case 3:
                    formRow[0].setAttribute('prompt', text.des);
                    formRow[1].setAttribute('prompt', '');
                    break;
                default:
                    window.location.replace(window.location.protocol + '//' + window.location.host + text.redirect);
            }
        });

    }

    function serialize(form) {
        var result = {};
        inputs = form.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
            if (!!inputs[i].name && inputs[i].value !== '') {
                result[inputs[i].name] = inputs[i].value;
            }
        }
        return result;
    }

})();

function ajax(method, url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(JSON.parse(xhr.responseText));
            xhr = null;
        }
    }
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(data);
}
