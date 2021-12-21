from rest_framework import serializers


class HabitSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=200, read_only=True)
    name = serializers.CharField(max_length=200)
    desc = serializers.CharField(max_length=200)
    category = serializers.CharField(max_length=200)
    created = serializers.DateTimeField()
    repeat_days = serializers.DictField(child = serializers.BooleanField())
    value = serializers.IntegerField(required=False)
    set_value = serializers.IntegerField(required=False)
    countable = serializers.BooleanField()    
    stats = serializers.DictField(child = serializers.DictField(), required = False)

class AccountSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=200, read_only=True)
    username = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    weight = serializers.FloatField()
    height = serializers.FloatField()
    api_token = serializers.CharField(max_length=200)
    #target_weight = serializers.FloatField()
