def validate_username_password(data):
    username = data.get('username', None)
    password = data.get('password', None)

    if username is None or password is None:
        raise ValueError("must enter username or password! ")
    data['username'] = username.lower()
    if len(username) < 3:
        raise ValueError("username must be longer than 2  characters!")
    if len(password) < 4:
        raise ValueError("password must be longer than 3 characters! ")


def send_cookie(response, jwt_token=None):

    if jwt_token is not None:
        response.set_cookie(
            key='jwt_token',
            value=jwt_token,
            # max_age=86400,  # 1 day in seconds
            secure=True,
            httponly=True,
            path="/",
            samesite='None',
        )

