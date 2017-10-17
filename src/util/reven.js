var $ = require('jquery')
var Raven = require('raven-js')
var unloadOccurred = false
var onbeforeunload = window.onbeforeunload
window.onbeforeunload = function (event) {
    unloadOccurred = true
    if (typeof onbeforeunload === 'function') {
        onbeforeunload(event)
    }
}

Raven.config(process.env.DSN, {
    whitelistUrls: [/.*.amap.com/, /.*.gaode.com/],
    ignoreErrors: [/Cannot read property 'addEventListener' of null/,/codemirror/],
    ignoreUrls: [/\.cnzz\.com/],
    release: process.env.version,
    dataCallback: function (data) {
        if (!data.user.AMAPID) {
            data.user.AMAPID = getAMAPID()
        }
        if (!data.user.userName || data.user.userName === 'blank') {
            data.user.userName = getUserName()
        }
        return data
    },
    autoBreadcrumbs: {
        'xhr': false,      // XMLHttpRequest
        'console': false,  // console logging
        'dom': true,       // DOM interactions, i.e. clicks/typing
        'location': true  // url changes, including pushState/popState
    },
    shouldSendCallback: function (data) {
        if (unloadOccurred) {
            return false
        } else if (window.navigator && window.navigator.userAgent && window.navigator.userAgent.indexOf('spider') !== -1) {
            return false
        } else {
            return true
        }
    },
    maxBreadcrumbs: 15,

    //collectWindowErrors: false
}).install()

Raven.setUserContext({
    userName: getUserName(),
    AMAPID: getAMAPID()
})
function getUserName() {
    var node = document.getElementsByClassName('user-name')[0]
    var userName = window.user_name || (node && node.innerText.trim())
    return userName || 'blank'
}
window.uploadError = function () {
    throw 3;
}
function getAMAPID() {
    var result = document.cookie.match(/AMAPID=([^;]+)/)
    return result && result[1] || 'blank'
}
function captureGlobal() {
    // window.onerror = function (msg, url, lineNumber, columnNumber, ex) {
    //     Raven.captureException(ex, {
    //         extra: {
    //             type: 'onerror',
    //             args: arguments
    //         }
    //     })
    // }
}
function captureAjax() {
    function report(msg, event, request, settings, type) {
        try {
            var response = request.responseJSON || JSON.parse(request.responseText)
        } catch (e) {
            //不需要任何处理
        }
        Raven.captureException(msg, {
            extra: {
                url: settings.url,
                data: settings.data,
                method: settings.type,
                status: request.status,
                response: response,
                type: type
            }
        })
    }

    $(document).ajaxError(function (event, request, settings, thrownError) {
        if (request.status) {//如果status为0,不上报
            report(thrownError || request.statusText, event, request, settings, 'ajaxError')
        }
    })
    $(document).ajaxSuccess(function (event, request, settings) {
        try {
            var result = request.responseJSON = (request.responseJSON || JSON.parse(request.responseText))
            if (result.code !== undefined && result.code !== 0 && result.code != 99) {
                //Raven.captureMessage('Request Log', {
                //    level: 'info',
                //    extra: {
                //        url: settings.url,
                //        data: settings.data,
                //        method: settings.type,
                //        status: request.status,
                //        response: result
                //    }
                //})
            }
        } catch (e) {
            //report(e, event, request, settings)
        }
    })
}
captureAjax()
captureGlobal()
window.Raven = module.exports = Raven


// WEBPACK FOOTER //
// ./src/raven.js