// $(document).ready(function() {
    "use strict"
    // get token
    var token, pageContent, currentUserName;
    function startLoad(cookie){
        console.log(cookie)
        if (cookie) {
            token = getCookie('token', cookie);
            currentUserName = getCookie('username', cookie);
        }
        if (token) {
            creaElement('div', 'container', '', 'body', 'afterbegin');
            creaElement('div', 'wrapper', 'root', '.container', 'afterbegin');
            insertHtml('#root', '<a href="javaScript:;" class="back-to-top"><i class="bx bxs-up-arrow-alt"></i></a>', 'afterbegin');
            insertHtml('#root', '<div class="overlay toggle-icon"></div>', 'afterbegin');
            loadHtml('head.html', '#root', 'header', '', '', 'afterbegin', '../../../assets/js/admin/header.js');
            loadHtml('sidebar.html', '#root', 'div', 'sidebar-wrapper', '', 'afterbegin', '../../../assets/js/admin/sidebar.js');
            loadHtml('setBg.html', '.container', 'div', 'switcher-wrapper', '', 'afterend', '../../../assets/js/admin/setBg.js');
        } else {
            loadHtml('login.html', 'body', 'div', 'wrapper', '', 'afterbegin', '../../../assets/js/admin/login.js');
        }
    }
    startLoad(document.cookie);
    function getCookie (key, cookie){
        if (cookie) {
            var value;
            var split = cookie.split(';');
            if (split && split.length > 0) {
                for (let index = 0, len = split.length; index < len; index++) {
                    var element = split[index].trim();
                    if (element.indexOf(key) != -1) {
                        value = element.split('=')[1];
                    }
                }
            }
            return value;
        } else {
            return '';
        }
    }
    function creaElement(ele, className, id, position, position1){
        var positionElement = document.querySelectorAll(position);
        var eleFirst = document.createElement(ele);
        if (className) {
            eleFirst.className = className;
        }
        if (id) {
            eleFirst.id = id;
        }
        if (position1) {
            positionElement.item(0).insertAdjacentElement(position1, eleFirst);
        } else {
            positionElement.item(0).appendChild();
        }
    }
    function insertHtml(startPoint, text, position){
        var positionElement = document.querySelectorAll(startPoint);
        positionElement.item(0).insertAdjacentHTML(position, text);
    }
    // load html
    function loadHtml(url, startPoint, createEle, className, id, position, src){
        fetch(url)
        .then(function(response){
            return response.text()
        })
        .then(function (html){
            var getEle = document.querySelectorAll(startPoint);
            var createElement = document.createElement(createEle);
            if (className) {
                createElement.className = className;
            }
            if (id) {
                createElement.id = id;
            }
            createElement.innerHTML = html;
            getEle.item(0).insertAdjacentElement(position, createElement);
            if (src) {
                var newSrc = document.createElement('script');
                newSrc.src = src;
                document.body.appendChild(newSrc);
            }
        })
        .catch(error => console.log(console.log(error)));
        
    }

    function getConnectAPI(method, url, dataPost, successCallback, failCallback){
        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: dataPost ? JSON.stringify(dataPost) : null,
        })
        .then((response) => response.json())
        .then(function (data) {
            if (successCallback) {
                successCallback(data);
            }
        })
        .catch(function (error) {
            failCallback();
        });
    }
// });