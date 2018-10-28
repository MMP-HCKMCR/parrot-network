$(document).ready(() => {
    $('div.post form').submit(function(e) {
        sendPost($('div.post form input[name=message]'));
        e.preventDefault();
    });
})

function sendPost(msg) {
    $.ajax({
        url: "/api/posts",
        method: "POST",
        data: { message: msg },
        dataType: "json",
        success: function(data) {
            console.log(data);
            //getPosts();
        },
        error: function(err) {
            console.log('[SEND] Failed: ' + error);
        }
    });
}

function getPosts() {
    var req = $.ajax({
        url: "/api/posts",
        method: "GET",
        dataType: "json"
    });

    req.done((data) => {
        if (data.error) {
            console.log('[LOAD] Failed');
            return;
        }

        data.posts.forEach((v) => {
            addPostToFeed(v.message);
        });
    });

    req.fail((jq, status) => {
        console.log('[LOAD] Failed: ' + status);
    });
}

function addPostToFeed(post) {

}

function mapMessageToParrots(msg) {
    var atoms = msg.split(' ');
    var img = '';

    atoms.forEach((v) => {
        if (v.startsWith(':') && v.endsWith(':')) {
            v = v.replace(/\:/g, '');
            img += '<img src="http://parrotnetwork-parrots.s3-eu-west-1.amazonaws.com/' + v + '.gif" />';
        }
    });

    return img;
}