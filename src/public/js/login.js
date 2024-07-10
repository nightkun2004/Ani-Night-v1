window.fbAsyncInit = function () {
    FB.init({
        appId: '1075150200774995',
        cookie: true,
        xfbml: true,
        version: 'v12.0'
    });

    FB.AppEvents.logPageView();
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function loginWithFacebook() {
    FB.login(function (response) {
        if (response.status === 'connected') {
            FB.api('/me', { fields: 'id,name,email' }, function (user) {
                fetch('/auth/facebook', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: user.id,
                        username: user.name,
                        email: user.email,
                        accessToken: response.authResponse.accessToken
                    })
                }).then(response => response.json())
                    .then(data => {
                        console.log(data)
                        if (data.success) {
                            window.location.href = `/profile?u=${data.username}`;
                        } else {
                            alert('Login failed');
                        }
                    });
            });
        } else {
            alert('User cancelled login or did not fully authorize.');
        }
    }, { scope: 'public_profile,email' });
}
