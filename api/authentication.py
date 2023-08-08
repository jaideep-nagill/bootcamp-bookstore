import jwt
import traceback
import datetime
import bookstore.settings
from .models import AllUser


def authentication(jwt_token, role):
    jwt_payload = None
    try:
        jwt_payload = jwt.decode(
            jwt_token,
            bookstore.settings.SECRET_KEY,
            algorithms=['HS256']
        )
    except:
        traceback.print_exc()
        return 401
    user = AllUser.objects.get(pk=jwt_payload['id'])

    if (user is None) or (str(user.role) != role):
        return 401
    return 200


def generate_tokens(user):
    jwt_token = jwt.encode(
        {
            "id": user.id,
            'role': str(user.role),
            'exp': datetime.datetime.now(tz=datetime.timezone.utc) + bookstore.settings.SIMPLE_JWT[
                'ACCESS_JWT_TOKEN_LIFETIME']
        },
        bookstore.settings.SECRET_KEY,
        algorithm='HS256'
    )
    return jwt_token

# class CustomJWTAuthentication(JWTAuthentication):
#     media_type = "application/json"
#
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         self.user_model = get_user_model()
#
#     def authenticate(self, request):
#         jwt_token = None
#         if 'jwt_token' in request.COOKIES:
#             jwt_token = request.COOKIES['jwt_token']
#
#         if jwt_token is None:
#             raise InvalidToken("No Token available")
#
#         is_jwt_expired = False
#         jwt_payload = None
#         try:
#             jwt_payload = jwt.decode(
#                 jwt_token,
#                 bookstore.settings.SECRET_KEY,
#                 algorithms=['HS256']
#             )
#         except jwt.exceptions.ExpiredSignatureError as e:
#             is_jwt_expired = True
#         except jwt.exceptions.InvalidSignatureError as e:
#             raise InvalidToken("Invalid Token Signature")
#
#         user = None
#         if jwt_payload is not None:
#             user = self.get_user(int(jwt_payload['id']))
#         if user is None:
#             raise AuthenticationFailed("No user found!!")
#         # return None
#         return (user, jwt_payload)
#
#     def get_user(self, id):
#         user = AllUser.objects.get(pk=id)
#         return user


# class CustomJWTAuthenticationMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response
#
#     def __call__(self, request, *args, **kwargs):
#         # self.id =
#
#         response = self.get_response(request)
#         print(request.COOKIES)
#         return response
#
#     def process_response(self, request, response):
#         print("=====================>",request.body)
#         if 'create_new_access_token' in request.body:
#             new_access_token = jwt.encode(
#                 {
#                     "id": request.headers['create_new_access_token'],
#                     'exp': datetime.datetime.now(tz=datetime.timezone.utc) + bookstore.settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
#                 },
#                 bookstore.settings.SECRET_KEY,
#                 algorithm='HS256'
#             )
#
#             send_cookie(response, access_token=new_access_token)
#         return response
