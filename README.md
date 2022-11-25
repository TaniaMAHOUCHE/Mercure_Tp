TpMercure

Pour lancer le projet, il faut lancer les commandes suivantes : 

```shell
docker-compose up -d
cd front
cd projet
npm install
npm run start
```

Puis, depuis le container de symfony, lancer les commandes suivantes :
```shell
cd html
composer install
symfony console doctrine:migrations:migrate
symfony console doctrine:fixtures:load
```

