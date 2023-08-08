from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User, AbstractUser


class Author(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Role(models.Model):
    role_name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.role_name


class AllUser(AbstractUser):
    role = models.ForeignKey(Role, to_field="role_name", null=True, blank=True, on_delete=models.CASCADE,
                             related_name='all_user')
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ()

    def __str__(self):
        return super().username


class Genre(models.Model):
    genre_name = models.CharField(max_length=50, primary_key=True)

    def __str__(self):
        return self.genre_name


class Book(models.Model):
    title = models.CharField(max_length=50)
    author = models.ForeignKey(Author, to_field='name', on_delete=models.CASCADE)
    genre = models.ManyToManyField(Genre, blank=True, related_query_name='book')
    price = models.FloatField()
    description = models.CharField(max_length=400, default="No description provided!", blank=True, null=True)
    publisher = models.CharField(max_length=50, default='Penguin')
    rating = models.FloatField(
        default=3,
        validators=[
            MinValueValidator(0.0),
            MaxValueValidator(5.0),
        ],
        null=True,
        blank=True
    )
    sale = models.IntegerField(default=0, null=True, blank=True)
    stock = models.IntegerField(default=100)
    slug = models.SlugField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class OrderRecord(models.Model):
    user = models.ForeignKey(AllUser, null=True, blank=True, on_delete=models.SET_NULL, related_name='order')
    order_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.id} {self.user}"


class OrderLog(models.Model):
    order_id = models.ForeignKey(OrderRecord, on_delete=models.CASCADE, related_name='order_item')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='order')
    book_qty = models.IntegerField()
    amount = models.FloatField()

    def __str__(self):
        return f"{self.order_id}"
