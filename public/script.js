$(document).ready(() => {
    $('div.post form button[name=add-post]').click(function(e) {
        sendPost($('div.post form input[name=message]')[0].value);
        e.preventDefault();
    });

    if (window.location.pathname == '/') {
        getPosts();
        setInterval(getPosts, 10000);
    }

    if (window.location.pathname.includes("/user")) {
        getCurrentUser((e, u) => {
            if (e) { 
                console.log(e);
                return;
            }

            var username = getUserFromQuery();

            if (username && username != u.username) {
                $('div.post').hide();
            }

            getUserInfo((username || u.username), (e, u) => {
                loadForUser(u);
            });
        });
    }
})

function loadForUser(user) {
    $('img#profile-pic').attr('src', 'img/avatar/' + (user.avatar || 'coolparrot') + '.png');
    $('h1#profile-name').html(user.username);
    getPosts('/api/posts/' + user.username);
}

function getUserFromQuery() {
    return (new URLSearchParams(window.location.search).get('u'));
}

function getCurrentUser(cb) {
    $.ajax({
        url: "/api/user",
        method: "GET",
        dataType: "json",
        success: function(data) {
            cb(null, data.user);
        },
        error: function(err) {
            console.log('[GETCURUSER] Failed: ' + error);
            cb(err, null);
        }
    });
}

function getUserInfo(username, cb) {
    $.ajax({
        url: "/api/users/" + username,
        method: "GET",
        dataType: "json",
        success: function(data) {
            console.log(data);
            cb(null, data.user);
        },
        error: function(err) {
            console.log('[GETUSER] Failed: ' + error);
            cb(err, null);
        }
    });
}

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

            if (window.location.pathname == '/user') {
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
    if (time >= 60) {
        time = (moment().utc()).diff((moment(post.created_at)), 'hours');
        time = (time + 'h');
    }
    else {
        time = (time + 'm');
    }

    $('div.all-posts').append('' +
        '<div class="post-block">' +
            '<img src="img/avatar/' + (post.user.avatar || 'coolparrot') + '.png">' +
            '<div class="post-content">' +
                    '<div class="post-header">' +
                        '<p class="post-name"></p>' +
                        '<p class="post-username"><a href="/user?u=' + post.user.username + '">' + post.user.username + '</a></p>' +
                        '<p class="dot"> &#149; </p>' +
                        '<p class="post-time">' + time + '</p>' +
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