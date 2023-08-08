from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from django.http import HttpResponse
from django.contrib.auth import authenticate
from .authentication import generate_tokens, authentication
from .serializers import *
from api.utils import send_cookie


@api_view(['GET'])
def authorize(request):
    jwt_token = request.COOKIES['jwt_token']
    user_role = request.COOKIES['user_role']
    if user_role is None or jwt_token is None:
        return Response(
            status=status.HTTP_401_UNAUTHORIZED
        )
    status_code = authentication(jwt_token=jwt_token, role=user_role)

    return Response(
        status=status_code
    )


@api_view(['Post'])
def add_role(request):
    new_role = RoleSerializer(data=request.data)
    if new_role.is_valid():
        new_role.save()
        return Response(
            status=status.HTTP_200_OK,
        )
    else:
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data={
                'errors': new_role.errors
            }
        )


@api_view(['Post'])
def add_author(request):
    new_author = AuthorSerializer(data=request.data)
    if new_author.is_valid():
        new_author.save()
        return Response(
            status=status.HTTP_200_OK,
        )
    else:
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data={
                'errors': new_author.errors
            }
        )


@api_view(['Post'])
def add_genre(request):
    new_genre = GenreSerializer(data=request.data)
    if new_genre.is_valid():
        new_genre.save()
        return Response(
            status=status.HTTP_200_OK,
        )
    else:
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data={
                'errors': new_genre.errors
            }
        )


@api_view(['POST'])
def sign_up(request):
    # request.data['role'] = 'admin'
    new_user = AllUserSerializer(data=request.data)
    if new_user.is_valid():
        new_user = new_user.save()
        return Response(
            status=status.HTTP_200_OK,
            data={
                'message': 'User Added!',
                'payload': {
                    'id': new_user.id
                }
            }
        )
    else:
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data={
                'errors': new_user.errors
            }
        )


@api_view(['POST'])
def sign_in(request):
    user = authenticate(username=request.data['username'], password=request.data['password'])
    if user is not None:
        jwt_token = generate_tokens(user)
        response = HttpResponse("Token cookies added! ")
        send_cookie(response=response, jwt_token=jwt_token)
        response.set_cookie(
            key='user_role',
            value=user.role,
            samesite='None',
            secure=True,
            httponly=False
        )
        response.set_cookie(
            key='user_id',
            value=user.id,
            samesite='None',
            secure=True,
            httponly=False
        )
        response.status_code = 200
        return response
    else:
        return Response(
            status=status.HTTP_401_UNAUTHORIZED,

        )


@api_view(['DELETE'])
def delete_user(request, pk):
    user = AllUser.objects.get(pk=pk)
    user.delete()
    return Response(
        status=status.HTTP_204_NO_CONTENT
    )


@api_view(['GET'])
def get_user(request, pk):
    user = AllUser.objects.get(pk=pk)
    user_serialized = AllUserSerializer(user)
    return Response(
        status=status.HTTP_200_OK,
        data={
            'payload': user_serialized.data
        }
    )


@api_view(['GET'])
def all_users(request):
    all_users = AllUser.objects.all()
    # print(all_users.values())
    all_users_serialized = AllUserSerializer(all_users, many=True)
    return Response(
        status=status.HTTP_200_OK,
        data={
            'payload': all_users_serialized.data
        }
    )


@api_view(['GET'])
def top_five_rated(request):
    books = Book.objects.all().order_by('-rating', 'sale')[:5]
    books_serialized = BookSerializer(books, many=True)
    return Response(
        status=status.HTTP_200_OK,
        data={
            'payload': books_serialized.data
        }

    )


@api_view(['GET'])
def recently_added(request):
    books = Book.objects.all().order_by('-created_at')[:5]
    books_serialized = BookSerializer(books, many=True)
    return Response(
        status=status.HTTP_200_OK,
        data={
            'payload': books_serialized.data
        }

    )


@api_view(['GET'])
def search(request):
    params = {'title': request.GET.get('title', None), 'author': request.GET.get('author', None),
              'genres': request.GET.get('genres', None)}
    # print(params)
    books = Book.objects.all()

    if params['title'] is not None and params['title'] != '':
        books = books.filter(title__icontains=params['title'])
    if params['author'] is not None and params['author'] != '':
        books = books.filter(author=params['author'])
    if params['genres'] is not None and params['genres'] != '':
        params['genres'] = params['genres'].split(",")
        books = books.filter(genre__in=params['genres'])
    books_serialized = BookSerializer(books, many=True)
    return Response(
        status=status.HTTP_200_OK,
        data={
            'payload': books_serialized.data
        }
    )


@api_view(['GET'])
def get_all_authors(request):
    all_authors = Author.objects.all()
    all_authors_serialized = AuthorSerializer(all_authors, many=True)
    return Response(
        status=status.HTTP_200_OK,
        data={
            'payload': all_authors_serialized.data
        }
    )


@api_view(['GET'])
def get_all_genres(request):
    all_genres = Genre.objects.all()
    all_genres_serialized = GenreSerializer(all_genres, many=True)
    return Response(
        status=status.HTTP_200_OK,
        data={
            'payload': all_genres_serialized.data
        }
    )


@api_view(['PATCH'])
def rate_book(request, bookId, rating):
    bookId = int(bookId)
    rating = int(rating)
    if rating > 5:
        rating = 5
    if rating < 1:
        rating = 1
    book = Book.objects.get(pk=bookId)
    if book is not None:
        rating = int(((book.rating * book.sale + rating) / (book.sale + 1)) * 10) / 10
        book_serialized = BookSerializer(book, data={'rating': rating}, partial=True)
        book_serialized.save()
        return Response(
            status=status.HTTP_206_PARTIAL_CONTENT
        )
    else:
        return Response(
            status=status.HTTP_400_BAD_REQUEST
        )


class BookView(APIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get(self, request, slug=-1):
        if slug == -1:
            book_set = Book.objects.all()
            books = BookSerializer(book_set, many=True)
            # books.is_valid()
            return Response(
                status=status.HTTP_200_OK,
                data={
                    'message': 'list of all the books',
                    'payload': books.data
                }
            )
        else:
            if slug.isdigit():
                pk = int(slug)
                book = Book.objects.get(pk=pk)
                if book is not None:
                    book_serialized = BookSerializer(book)

                    return Response(
                        status=status.HTTP_200_OK,
                        data={
                            'payload': book_serialized.data
                        }
                    )
                else:
                    return Response(
                        status=status.HTTP_404_NOT_FOUND,
                        data={
                            'message': 'Cannot find the book you are searching for!'
                        }
                    )
            else:
                book = Book.objects.get(slug=slug)
                if book is not None:
                    book_serialized = BookSerializer(book)
                    return Response(
                        status=status.HTTP_200_OK,
                        data={
                            'payload': book_serialized.data
                        }
                    )
                else:
                    return Response(
                        status=status.HTTP_404_NOT_FOUND,
                        data={
                            'message': 'Cannot find the book you are searching for!'
                        }
                    )

    def post(self, request):
        # genres = request.data.pop("genres", {})
        # print(request.data)
        if 'cart' in request.data:
            cart_books = Book.objects.filter(pk__in=request.data['cart'])

            cart_books_serialized = BookSerializer(cart_books, many=True)
            return Response(
                status=status.HTTP_200_OK,
                data={
                    'payload': cart_books_serialized.data
                }
            )
        else:
            new_author = None
            if 'newAuthor' in request.data:
                # new_author = request.pop("newAuthor")
                new_author = Author(name=request.data.pop('newAuthor'))
                new_author.save()
                request.data['author'] = new_author.name
            book_serialized = BookSerializer(data=request.data)
            if book_serialized.is_valid():
                book = book_serialized.save()
                return Response(
                    status=status.HTTP_201_CREATED,
                    data={
                        'message': 'book added successfully',
                        'payload': {
                            'id': book.id
                        }
                    }
                )
            else:
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data={
                        'message': 'Invalid data!',
                        'errors': book_serialized.errors
                    }
                )


    def patch(self, request, slug=""):
        pk = int(slug)
        book = Book.objects.get(pk=pk)
        if book is not None:
            fields = ['title', 'author', 'genre', 'price', 'description', 'publisher', 'slug', 'rating', 'sale',
                      'stock']
            for field in request.data:
                if field not in fields:
                    return Response(
                        status=status.HTTP_400_BAD_REQUEST,
                        data={
                            'message': "can't update on/more of the given fields!",
                        }
                    )
            book_update = BookSerializer(book, data=request.data, partial=True)
            if book_update.is_valid():
                book_update.save()
                return Response(
                    status=status.HTTP_206_PARTIAL_CONTENT,
                    data={
                        'message': 'Data successfully updated!'
                    }
                )
            else:
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data={
                        'message': "invalid data",
                        'errors': book_update.errors
                    }
                )
        else:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={
                    'message': 'Cannot find the book you are searching for!'
                }
            )


    def delete(self, request, slug=""):
        pk = int(slug)
        book = Book.objects.get(pk=pk)
        if book is not None:
            book.delete()
            return Response(
                status=status.HTTP_204_NO_CONTENT,
                data={
                    'message': 'book deleted successfully'
                }
            )
        else:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={
                    'message': 'Cannot find the book you are searching for!'
                }
            )


class OrderRecordView(APIView):
    queryset = OrderRecord.objects.all()
    serializer_class = OrderRecordSerializer

    def get(self, reqeust, pk=-1):
        if pk == -1:
            total_amount = 0
            order_set = OrderRecord.objects.all()
            order_set_serialized = OrderRecordSerializer(data=order_set, many=True)
            order_set_serialized.is_valid()
            res = []
            for each_order in order_set_serialized.data:
                each_order_set = OrderLog.objects.filter(order_id=each_order['id'])
                each_order_set_serialized = OrderLogSerializer(data=each_order_set, many=True)
                each_order_set_serialized.is_valid()
                each_order['books'] = each_order_set_serialized.data
                res.append(each_order)
            return Response(
                status=status.HTTP_200_OK,
                data={
                    'message': 'List of all the orders placed',
                    'payload': res
                }
            )
        else:
            pk = int(pk)
            order_record = OrderRecord.objects.filter(user=pk)
            if order_record is not None:
                order_set_serialized = OrderRecordSerializer(order_record, many=True)
                # if not order_record_serialized.is_valid():
                #     print(order_record_serialized.errors)

                for each_order in order_set_serialized.data:
                    each_order_set = OrderLog.objects.filter(order_id=each_order['id'])
                    each_order_set_serialized = OrderLogSerializer(data=each_order_set, many=True)
                    each_order_set_serialized.is_valid()
                    each_order['books'] = each_order_set_serialized.data

                return Response(
                    status=status.HTTP_200_OK,
                    data={
                        'message': 'List of all the orders placed',
                        'payload': order_set_serialized.data
                    }
                )
            else:
                return Response(
                    status=status.HTTP_404_NOT_FOUND,
                    data={
                        'message': 'Cannot find the order you are searching for!'
                    }
                )

    def post(self, request):
        # print(request.data)
        books_order = request.data.pop('books', None)

        order_record = OrderRecordSerializer(data=request.data)
        if order_record.is_valid():
            total_amount = 0
            order_record_obj = order_record.save()
            for each_book in books_order:
                book_price = Book.objects.get(pk=each_book['id']).price
                amount = each_book['qty'] * book_price
                book_order = OrderLogSerializer(
                    data={
                        'order_id': order_record_obj.id,
                        'book': each_book['id'],
                        'book_qty': each_book['qty'],
                        'amount': amount
                    }
                )
                total_amount += amount
                if book_order.is_valid():
                    book_order.save()
                    order_record_obj.total_amount = total_amount
                    order_record_obj.save()

                else:
                    return Response(
                        status=status.HTTP_400_BAD_REQUEST,
                        data={
                            'message': "invalid data",
                            'errors': book_order.errors
                        }
                    )

            return Response(
                status=status.HTTP_201_CREATED,
                data={
                    'message': "order details stored successfully!",
                    'payload': {
                        'id': order_record_obj.id
                    }
                }
            )
        else:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={
                    'message': "invalid data",
                    'errors': order_record.errors
                }
            )
