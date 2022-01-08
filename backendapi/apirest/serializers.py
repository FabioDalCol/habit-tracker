from rest_framework import serializers 
 
 
class HabitSerializer(serializers.Serializer): 
    id = serializers.CharField(max_length=200, read_only=True) 
    name = serializers.CharField(max_length=200, required=False) 
    desc = serializers.CharField(max_length=200, required=False) 
    category = serializers.RegexField(regex="[a-zA-Z]{4,10}") #CharField(max_length=10) 
    created = serializers.RegexField(regex="[0-9]{4}-[0-9]{2}-[0-9]{2}") #CharField(max_length=10) 
    repeat_days = serializers.DictField(child = serializers.BooleanField())  
    value = serializers.IntegerField(required=False) 
    set_value = serializers.IntegerField(required=False) 
    countable = serializers.BooleanField()     
    stats = serializers.DictField(child = serializers.DictField(), required = False) #questo come si sanitizza? 
    reminder = serializers.IntegerField(max_value=20) 
    is_active = serializers.BooleanField() 
 
class AccountSerializer(serializers.Serializer): 
    id = serializers.CharField(max_length=200, read_only=True) 
    username = serializers.CharField(max_length=200) 
    age = serializers.IntegerField(max_value=120)     
    height = serializers.IntegerField(max_value=250) 
    rise_time = serializers.RegexField(regex="[0-9]{2}:[0-9]{2}") #CharField(max_length=5) 
    sleep_time = serializers.RegexField(regex="[0-9]{2}:[0-9]{2}") #CharField(max_length=5)

