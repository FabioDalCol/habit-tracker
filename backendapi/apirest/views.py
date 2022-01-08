from rest_framework.exceptions import NotFound
from apirest.firebase_client import FirebaseClient
from apirest.serializers import HabitSerializer, AccountSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from datetime import datetime


class HabitViewSet(viewsets.ViewSet):
    
    client = FirebaseClient() 
    
    def check_token(self, uid, token): 
        token_to_check= self.client._db.collection(u'users_api_keys').document(f'{uid}').get().to_dict() 
        print(token_to_check['expire']) 
        if(datetime.strptime(token_to_check['expire'],"%Y-%m-%d")>=datetime.now()): 
            return token==token_to_check['api_token'] 
        else:
            return False

    def create(self, request, *args, **kwargs):
        if not self.check_token(kwargs.get("uid"), request.headers['Token']):
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        self.client._collection = self.client._db.collection(u'users').document(f'{kwargs.get("uid")}').collection(u'habits')
        serializer = HabitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.client.create(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    def list(self, request, *args, **kwargs):
        if not self.check_token(kwargs.get("uid"), request.headers['Token']):
            return Response(status=status.HTTP_401_UNAUTHORIZED)        
        self.client._collection = self.client._db.collection(u'users').document(f'{kwargs.get("uid")}').collection(u'habits')
        Habits = self.client.all()        
        serializer = HabitSerializer(Habits, many=True)
        return Response(serializer.data)
            

    def retrieve(self, request, *args, **kwargs):
        if not self.check_token(kwargs.get("uid"), request.headers['Token']):
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        self.client._collection = self.client._db.collection(u'users').document(f'{kwargs.get("uid")}').collection(u'habits')
        pk = kwargs.get('pk')
        Habit = self.client.get_by_id(pk)
        

        if Habit:
            serializer = HabitSerializer(Habit)
            return Response(serializer.data)

        raise NotFound(detail="Habit Not Found", code=404)

    def destroy(self, request, *args, **kwargs):
        if not self.check_token(kwargs.get("uid"), request.headers['Token']):
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        self.client._collection = self.client._db.collection(u'users').document(f'{kwargs.get("uid")}').collection(u'habits')
        pk = kwargs.get('pk')
        self.client.delete_by_id(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        if not self.check_token(kwargs.get("uid"), request.headers['Token']):
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        self.client._collection = self.client._db.collection(u'users').document(f'{kwargs.get("uid")}').collection(u'habits')
        pk = kwargs.get('pk')
        serializer = HabitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.client.update(pk, serializer.data)
        return Response(serializer.data)


class AccountViewSet(viewsets.ViewSet):
    
    client = FirebaseClient()

    def check_token(self, uid, token): 
        token_to_check= self.client._db.collection(u'users_api_keys').document(f'{uid}').get().to_dict() 
        print(token_to_check['expire']) 
        if(datetime.strptime(token_to_check['expire'],"%Y-%m-%d")>=datetime.now()): 
            return token==token_to_check['api_token'] 
        else:
            return False

    def create(self, request, *args, **kwargs):
        if not self.check_token(kwargs.get("pk"), request.headers['Token']):
            return Response(status=status.HTTP_401_UNAUTHORIZED)
            
        serializer = AccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.client.createWithId(serializer.data,kwargs.get("pk"))

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    def list(self, request):
        Accounts = self.client.all()
        serializer = AccountSerializer(Accounts, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        if not self.check_token(kwargs.get("pk"), request.headers['Token']):
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        pk = kwargs.get('pk')
        Account = self.client.get_by_id(pk)

        if Account:
            serializer = AccountSerializer(Account)
            return Response(serializer.data)

        raise NotFound(detail="Account Not Found", code=404)

    def destroy(self, request, *args, **kwargs):
        if not self.check_token(kwargs.get("pk"), request.headers['Token']):
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        pk = kwargs.get('pk')
        self.client.delete_by_id(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        if not self.check_token(kwargs.get("pk"), request.headers['Token']):
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        pk = kwargs.get('pk')
        serializer = AccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.client.update(pk, serializer.data)
        return Response(serializer.data)