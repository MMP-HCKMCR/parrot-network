$(document).ready(() => {
    $('div.post form button[name=add-post]').click(function(e) {
        sendPost($('div.post form input[name=message]')[0].value);
        e.preventDefault();
    });

    if (window.location.pathname == '/') {
        getPosts();
        setInterval(getPosts, 10000);
    }

    if (window.location.pathname == '/profile') {
        getPosts('/api/users/posts');
    }

    if (window.location.pathname.includes("/user")) {
        var user = new URLSearchParams(window.location.search).get('u');
        getPosts('/api/posts/' + user);
    }
})

function sendPost(msg) {
    $.ajax({
        url: "/api/posts",
        method: "POST",
        data: "message=" + msg,
        dataType: "json",
        success: function(data) {
            console.log(data);
            clearPost();

            if (window.location.pathname == '/') {
                getPosts();
            }

            if (window.location.pathname == '/profile') {
                getPosts('/api/users/posts');
            }
        },
        error: function(err) {
            console.log('[SEND] Failed: ' + error);
        }
    });
}

function clearPost() {
    $('div.post form input[name=message]')[0].value = '';
}

function getPosts(url) {
    url = (url || '/api/posts');

    var req = $.ajax({
        url: url,
        method: "GET",
        dataType: "json"
    });

    req.done((data) => {
        if (data.error) {
            console.log('[LOAD] Failed');
            return;
        }

        clearPosts();

        data.posts.forEach((v) => {
            addPostToFeed(v);
        });
    });

    req.fail((jq, status) => {
        console.log('[LOAD] Failed: ' + status);
    });
}

function clearPosts() {
    $('div.all-posts').html('')
}

function addPostToFeed(post) {
    var time = (moment().utc()).diff((moment(post.created_at)), 'minutes');

    $('div.all-posts').append('' +
        '<div class="post-block">' +
            '<img src="img/avatar/' + (post.user.avatar || 'coolparrot') + '.png">' +
            '<div class="post-content">' +
                    '<div class="post-header">' +
                        '<p class="post-name"></p>' +
                        '<p class="post-username"><a href="/user?u=' + post.user.username + '">' + post.user.username + '</a></p>' +
                        '<p class="dot"> &#149; </p>' +
                        '<p class="post-time">' + time + 'm</p>' +
                    '</div>' +
                    '<div class="post-gifs">' +
                        mapMessageToParrots(post.message) +
                    '</div>' +
                '</div>' +
            '</div>' +
    '');
}

function mapMessageToParrots(msg) {
    msg = msg.replace(/\:\:/g, ': :')
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