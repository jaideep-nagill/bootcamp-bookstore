# Generated by Django 4.2.3 on 2023-08-02 02:13

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='AllUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('price', models.FloatField()),
                ('description', models.CharField(blank=True, default='No description provided!', max_length=400, null=True)),
                ('publisher', models.CharField(default='Penguin', max_length=50)),
                ('rating', models.FloatField(blank=True, default=3, null=True, validators=[django.core.validators.MinValueValidator(0.0), django.core.validators.MaxValueValidator(5.0)])),
                ('sale', models.IntegerField(blank=True, default=0, null=True)),
                ('stock', models.IntegerField(default=100)),
                ('slug', models.SlugField(blank=True, max_length=150)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.author', to_field='name')),
            ],
        ),
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('genre_name', models.CharField(max_length=50, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role_name', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='OrderRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_date', models.DateTimeField(auto_now_add=True)),
                ('total_amount', models.FloatField(blank=True, null=True)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='order', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='OrderLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('book_qty', models.IntegerField()),
                ('amount', models.FloatField()),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order', to='api.book')),
                ('order_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order_item', to='api.orderrecord')),
            ],
        ),
        migrations.AddField(
            model_name='book',
            name='genre',
            field=models.ManyToManyField(blank=True, related_query_name='book', to='api.genre'),
        ),
        migrations.AddField(
            model_name='alluser',
            name='role',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='all_user', to='api.role', to_field='role_name'),
        ),
        migrations.AddField(
            model_name='alluser',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions'),
        ),
    ]
