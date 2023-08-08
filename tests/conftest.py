import pytest
from faker import Faker
from rest_framework.test import APIClient
from api.serializers import *

fake = Faker()
client = APIClient()


@pytest.fixture
def fake_user_factory(db):
    role = 'tester'
    response = client.post("/api/user/add-role/", data={'role_name': role}, format='json')
    data = {
        'first_name': fake.first_name(),
        'last_name': fake.last_name(),
        'username': 'tester',
        'email': fake.email(),
        'password': "1234",
        'role': role
    }
    response = client.post(
        '/api/user/sign-up/',
        data,
        format='json'
    )
    return response


@pytest.fixture()
def fake_book(db):
    client.post("/api/user/add-genre/", data={'genre_name': 'tester'}, format='json')
    data = {
        'title': fake.name(),
        'price': 100,
        'newAuthor': 'tester',
        'genre': ['tester']
    }
    response = response = client.post('/api/book/', data=data, format='json')

    return response

@pytest.fixture()
def fake_order(db, fake_user_factory, fake_book):
    book = fake_book
    user_id = fake_user_factory.data['payload']['id']
    data = {

        'books': [
            {
                'id': book.data['payload']['id'],
                'qty': 1
            }
        ]
    }

    response = client.post('/api/order',data, format='json')
    return response