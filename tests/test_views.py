import pytest
from rest_framework.test import APIClient
from faker import Faker
from api.serializers import *

client = APIClient()
fake = Faker()


@pytest.mark.django_db
def test_add_role():
    testing_role = 'tester'
    response = client.post("/api/user/add-role/", data={'role_name': testing_role}, format='json')

    assert response.status_code == 200


@pytest.mark.django_db
def test_add_author():
    testing_author = 'tester'
    response = client.post("/api/user/add-author/", data={'name': testing_author}, format='json')

    assert response.status_code == 200


@pytest.mark.django_db
def test_add_genre():
    testing_genre = 'tester'
    response = client.post("/api/user/add-genre/", data={'genre_name': testing_genre}, format='json')

    assert response.status_code == 200


@pytest.mark.django_db
def test_all_users():
    response = client.get("/api/user/all-users")
    assert response.status_code == 200


@pytest.mark.django_db
def test_get_all_authors():
    response = client.get("/api/user/get-all-author")
    assert response.status_code == 200


@pytest.mark.django_db
def test_get_all_genres():
    response = client.get("/api/user/get-all-genres")
    assert response.status_code == 200


def test_sign_up(fake_user_factory):
    response = fake_user_factory
    assert response.data['payload']['id'] is not None


def test_sign_in(fake_user_factory):
    response = client.post('/api/user/sign-in/',
                           data={
                               'username': 'tester',
                               'password': '1234'
                           },
                           format='json'
                           )

    assert response.status_code == 200
    response = client.get('/api/user/authorization')
    assert response.status_code == 200


def test_get_user(fake_user_factory):
    user_id = fake_user_factory.data['payload']['id']
    response = client.get(f'/api/user/get-user/{user_id}/')

    assert response.status_code == 200


@pytest.mark.django_db
def test_delete_user(fake_user_factory):
    response = fake_user_factory
    user_id = response.data['payload']['id']
    response = client.delete(f'/api/user/delete-user/{user_id}/')

    assert response.status_code == 204


def test_add_new_book(fake_book):
    response = fake_book
    assert response.status_code == 201


@pytest.mark.django_db
def test_update_book(fake_book):
    response = fake_book
    book_id = response.data['payload']['id']
    new_name = fake.name()
    book = Book.objects.get(pk=book_id)
    updated_book = BookSerializer(book, data={'title': new_name}, partial=True)
    updated_book.is_valid()
    updated_book.save()

    book = Book.objects.get(pk=book_id)
    assert book.title == new_name


@pytest.mark.django_db
def test_delete_book(fake_book):
    response = fake_book
    book_id = response.data['payload']['id']
    delete_response = client.delete(f'/api/book/{book_id}/')
    assert delete_response.status_code == 204


def test_order(fake_order):
    response = fake_order
    assert response.status_code == 201


def test_get_order(fake_order):
    response = fake_order
    ord_id = response.data['payload']['id']
    response = client.get(f'/api/order/{ord_id}/')

    assert response.status_code == 200


@pytest.mark.now
def test_get_all_orders(fake_order):
    response = client.get('/api/order')

    assert response.status_code == 200
