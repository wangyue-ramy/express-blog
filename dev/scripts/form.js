(function() {
    var loginBtn = document.getElementById('login');
    loginBtn.addEventListener('click', login);
    var formRow = document.getElementsByClassName('form-row');

    function login(e) {
        e.preventDefault();

        var data = JSON.stringify(serialize(this.form));

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                console.log(xhr);
                var text = JSON.parse(xhr.responseText);
                console.log(text);
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

            }
        };
        xhr.open('post', '/login', true);
        xhr.setRequestHeader('Content-type', 'application/json');
        console.log(data);
        xhr.send(data);
    }

    function serialize(form) {
        var result = {};
        inputs = form.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].name !== null && inputs[i].value !== null) {
                result[inputs[i].name] = inputs[i].value;
            }
        }
        return result;
    }

})();

window.addEventListener('load', login);
