from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Genre)
admin.site.register(AllUser)
admin.site.register(Role)
admin.site.register(Book)
admin.site.register(OrderRecord)
admin.site.register(OrderLog)
