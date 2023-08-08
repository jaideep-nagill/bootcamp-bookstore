from rest_framework import serializers
from .models import *
from .utils import validate_username_password


class OrderRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderRecord
        fields = '__all__'


class OrderLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderLog
        fields = '__all__'


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

    def validate(self, data):
        data['role_name'] = data['role_name'].lower()
        return data


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'

    def validate(self, data):
        data['genre_name'] = data['genre_name'].capitalize()
        return data


class BookSerializer(serializers.ModelSerializer):
    # genre = GenreSerializer(many=True)
    class Meta:
        model = Book
        # exclude = ("genre",)
        fields = '__all__'

    def validate(self, data):
        if 'rating' in data:
            data['rating'] = int(data['rating'] * 10) / 10
        return data

    def create(self, validated_data):
        genres = validated_data.pop("genre", "")
        # print(genres)
        slug = validated_data['title'].lower()
        slug = "-".join(slug.split(" "))
        validated_data['slug'] = slug
        book = self.Meta.model(**validated_data)
        book.save()
        if genres == "":
            raise ValueError("Genre required")
        else:
            for genre in genres:
                # print(genre.genre_name)
                book.genre.add(genre.genre_name)
                book.save()

        return book


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'


class AllUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AllUser
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        validate_username_password(data)
        return data

    def create(self, validated_data):
        password = validated_data.pop('password', None)

        instance = self.Meta.model(**validated_data)
        instance.set_password(password)
        instance.save()
        return instance
