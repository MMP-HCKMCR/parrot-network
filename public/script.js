$(document).ready(() => {
    var path = getCurrentPath();

    if (path == '/' || path.includes("/user")) {
        $('div.post form button[name=add-post]').click(function(e) {
            sendPost($('div.post form input[name=message]')[0].value);
            e.preventDefault();
        });
    }

    if (path == '/') {
        getPosts();
        setInterval(getPosts, 10000);
    }

    if (path.includes("/search")) {
        $('div.post form button[name=find-users]').click(function(e) {
            getUsers($('div.post form input[name=query]')[0].value);
            e.preventDefault();
        });
    }

    if (path.includes("/user")) {
        getCurrentUser((e, u) => {
            if (e) { 
                console.log(e);
                return;
            }

            var username = getUserFromQuery();

            // show the follow or unfollow button?
            if (username && username != u.username) {
                $('div.post').hide();

                isUserFollowing(username, (e, d) => {
                    if (e) {
                        showError(d.message);
                        return;
                    }

                    if (d.following) {
                        $('button#follow').hide();
                        $('button#unfollow').show();
                    }
                    else {
                        $('button#follow').show();
                        $('button#unfollow').hide();
                    }

                    bindFollowingEvents();
                });
            }

            // load user posts
            getUserInfo((username || u.username), (e, d) => {
                if (e) {
                    showError(d.message);
                    return;
                }

                loadForUser(d.user);
            });
        });
    }
})

function getCurrentPath() {
    return window.location.pathname;
}

function bindFollowingEvents() {
    $('button#follow').click(function(e) {
        callFollowUnfollow('follow', (e, d) => {
            if (!d.error) {
                $('button#follow').hide();
                $('button#unfollow').show();
            }
        });
    })

    $('button#unfollow').click(function(e) {
        callFollowUnfollow('unfollow', (e, d) => {
            if (!d.error) {
                $('button#follow').show();
                $('button#unfollow').hide();
            }
        });
    })
}

function callFollowUnfollow(action, cb) {
    $.ajax({
        url: "/api/user/" + action + "/" + $('h1#profile-name').html(),
        method: "POST",
        dataType: "json",
        success: function(data) {
            console.log(data);
            cb(null, data);
        },
        error: function(err) {
            console.log('[GETCURUSER] Failed: ' + error);
            cb(err, null);
        }
    });
}

function showError(msg) {
    $('.page-content').hide();
    $('#error-message').html(msg);
    $('#error-content').show();
}

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
            console.log('[GETCURUSER] Failed: ' + err);
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
            cb(data.error, data);
        },
        error: function(err) {
            console.log('[GETUSER] Failed: ' + err);
            cb(err, null);
        }
    });
}

function isUserFollowing(username, cb) {
    $.ajax({
        url: "/api/user/following/" + username,
        method: "GET",
        dataType: "json",
        success: function(data) {
            console.log(data);
            cb(data.error, data);
        },
        error: function(err) {
            console.log('[GETUSER] Failed: ' + err);
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
            clearPost();

            if (window.location.pathname == '/') {
                getPosts();
            }

            if (window.location.pathname == '/user') {
                getPosts('/api/users/posts');
            }
        },
        error: function(err) {
            console.log('[SEND] Failed: ' + err);
        }
    });
}

function clearPost() {
    $('div.post form input[name=message]')[0].value = '';
}

function getUsers(query) {
    $.ajax({
        url: "/api/users/find?query=" + query,
        method: "GET",
        dataType: "json",
        success: function(data) {
            if (data.error) {
                console.log('[FIND] Failed: ' + data.message);
                return;
            }

            clearPosts();

            data.users.forEach((v) => {
                addUserToFeed(v);
            });
        },
        error: function(err) {
            console.log('[FIND] Failed: ' + err);
        }
    });
}

function getPosts(url) {
    url = (url || '/api/posts');

    var req = $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        success: function(data) {
            if (data.error) {
                console.log('[LOAD] Failed');
                return;
            }

            clearPosts();

            data.posts.forEach((v) => {
                addPostToFeed(v);
            });
        },
        error: function(err) {
            console.log('[LOAD] Failed: ' + err);
        }
    });
}

function clearPosts() {
    $('div.all-posts').html('')
}

function addPostToFeed(post) {
    var time = mapDateToTimestamp(post.created_at);

    $('div.all-posts').append('' +
        '<div class="post-block">' +
            '<img src="img/avatar/' + (post.user.avatar || 'coolparrot') + '.png">' +
            '<div class="post-content">' +
                    '<div class="post-header">' +
                        '<p class="post-name"></p>' +
                        '<p class="post-username"><a href="/user?u=' + post.user.username + '">' + post.user.username + '</a></p>' +
                        '<p class="dot"> &#149; </p>' +
                        '<p class="post-time" alt="' + post.created_at + '">' + time + '</p>' +
                    '</div>' +
                    '<div class="post-gifs">' +
                        mapMessageToParrots(post.message) +
                    '</div>' +
                '</div>' +
            '</div>' +
    '');
}

function addUserToFeed(user) {
    $('div.all-posts').append('' +
        '<div class="post-block">' +
            '<img src="img/avatar/' + (user.avatar || 'coolparrot') + '.png">' +
            '<div class="post-content">' +
                    '<div class="post-header">' +
                        '<p class="post-name"></p>' +
                        '<p class="post-username"><a href="/user?u=' + user.username + '">' + user.username + '</a></p>' +
                    '</div>' +
                    '<div class="post-gifs">' +
                    '</div>' +
                '</div>' +
            '</div>' +
    '');
}

function mapDateToTimestamp(date) {
    var time = (moment().utc()).diff((moment(date)), 'minutes');
    if (time < 60) {
        return (time + 'm');
    }

    time = (moment().utc()).diff((moment(date)), 'hours');
    if (time < 24) {
        return (time + 'h');
    }

    time = (moment().utc()).diff((moment(date)), 'days');
    if (time < 365) {
        return (time + 'd');
    }

    time = (moment().utc()).diff((moment(date)), 'years');
    return (time + 'y');
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