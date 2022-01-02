from rest_framework import serializers


class HabitSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=200, read_only=True)
    name = serializers.CharField(max_length=200, required=False)
    desc = serializers.CharField(max_length=200, required=False)
    category = serializers.CharField(max_length=20)
    created = serializers.CharField(max_length=10)
    repeat_days = serializers.DictField(child = serializers.BooleanField())
    value = serializers.IntegerField(required=False)
    set_value = serializers.IntegerField(required=False)
    countable = serializers.BooleanField()    
    stats = serializers.DictField(child = serializers.DictField(), required = False)
    reminder = serializers.IntegerField()
    is_active = serializers.BooleanField()

class AccountSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=200, read_only=True)
    username = serializers.CharField(max_length=200)
    age = serializers.IntegerField()    
    height = serializers.IntegerField()
    rise_time = serializers.CharField(max_length=5)
    sleep_time = serializers.CharField(max_length=5)

